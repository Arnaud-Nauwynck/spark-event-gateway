package fr.an.spark.gateway.clusters.localdir;

import fr.an.spark.gateway.clusters.SparkClusterApp;
import fr.an.spark.gateway.clusters.SparkEventFileSummary;
import fr.an.spark.gateway.dto.eventSummary.SparkAppSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.TopEventSummariesRetainPolicy;
import fr.an.spark.gateway.eventSummary.SparkAppSummaryBuilder;
import fr.an.spark.gateway.eventlog.model.SparkEvent;
import fr.an.spark.gateway.utils.JsonUtils;
import fr.an.spark.gateway.utils.LsUtils;
import fr.an.spark.gateway.utils.MapUtils;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import java.io.*;
import java.util.*;

/**
 *
 */
@Slf4j
public class LocalSparkClusterApp extends SparkClusterApp {

    private static final FilenameFilter FILTER_SparkEventsFiles = new FilenameFilter() {
        @Override
        public boolean accept(File dir, String name) {
            if (!name.startsWith("events_") || ! name.contains("_spark-")) return false;
            return SparkEventFileSummary.matchesFileName(name);
        }
    };


    private final File appDir;

    // -----------------------------------------------------------------------------------------------------------------

    public LocalSparkClusterApp(LocalSparkCluster cluster, String appName, File appDir) {
        super(cluster, appName);
        this.appDir = Objects.requireNonNull(appDir);
    }

    // -----------------------------------------------------------------------------------------------------------------

    private File checkExistEventSummariesFile() {
        File eventSummariesFile = getSparkEventSummariesFile();
        if (! eventSummariesFile.exists()) {
            throw new IllegalStateException("event summaries file not found for app not found: " + appKey);
        }
        return eventSummariesFile;
    }

    private File getSparkAppSummaryFile() {
        return new File(appDir, appName + "-sparkapp-summary.json");
    }

    private File getSparkEventSummariesFile() {
        return new File(appDir, appName + "-sparkevent-summaries.json");
    }

    @Override
    public List<SparkEventSummaryDTO> listSparkEventSummaryDTOs(int from, int limit) {
        File eventSummariesFile = getSparkEventSummariesFile();
        List<SparkEventSummaryDTO> res = new ArrayList<>(limit);
        try(BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(eventSummariesFile)))) {
            // skip 'from' lines
            for(int i = 0; i < from; i++) {
                String line = reader.readLine();
                if (line == null) {
                    // eof
                    return res;
                }
            }
            // read 'limit' lines
            for(int i = 0; i < limit; i++) {
                String line = reader.readLine();
                if (line == null) {
                    // eof
                    return res;
                }
                try {
                    SparkEventSummaryDTO eventSummary = JsonUtils.parseJson(line, SparkEventSummaryDTO.class);
                    res.add(eventSummary);
                } catch(Exception ex) {
                    log.warn("Failed to parse event summary line: " + line + " .. ignore, no rethrow " + ex.getMessage());
                }
            }
        } catch(IOException ex) {
            throw new RuntimeException("Failed to read event summaries file for " + appKey, ex);
        }
        return res;
    }


    @Override
    public SparkAppSummaryDTO buildAppSummaryDTO() {
        File summaryFile = getSparkAppSummaryFile();
        if (summaryFile.exists()) {
            // load from summary file
            return readSparkAppSummaryFile(summaryFile);
        } else {
            // need parse first few events + write events summaries file...
            SparkAppSummaryDTO res = readSparkEventsAndWriteEventSummaries();
            // also write app summary file
            writeSparkAppSummaryFile(summaryFile, res);
            return res;
        }
    }

    protected SparkAppSummaryDTO readSparkAppSummaryFile(File summaryFile) {
        try (val reader = new BufferedReader(new InputStreamReader(new FileInputStream(summaryFile)))
        ) {
            return SparkAppSummaryBuilder.readJson(reader);
        } catch(IOException ex) {
            throw new RuntimeException("Failed to read summary event log for " + appKey, ex);
        }
    }

    protected void writeSparkAppSummaryFile(File summaryFile, SparkAppSummaryDTO appSummary) {
        try (val writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(summaryFile)))
        ) {
            SparkAppSummaryBuilder.writeJson(writer, appSummary);
        } catch(IOException ex) {
            throw new RuntimeException("Failed to write summary event log for " + appKey, ex);
        }
    }


    protected SparkAppSummaryDTO readSparkEventsAndWriteEventSummaries() {
        File eventSummariesFile = getSparkEventSummariesFile();
        try (val eventSummariesOutputStream = new BufferedOutputStream(new FileOutputStream(eventSummariesFile))
        ) {
            val topRetainPolicy = new TopEventSummariesRetainPolicy(cluster.getTopEventSummariesRetainPolicy());
            val appSummaryBuilder = new SparkAppSummaryBuilder(clusterName, appName,
                    topRetainPolicy,
                    eventSummariesOutputStream);
            // TODO.. filesStatSummaryForApp(appDir);

            File[] eventFiles = appDir.listFiles(FILTER_SparkEventsFiles);
            if (eventFiles == null) {
                eventFiles = new File[0]; // ? no events
            }
            List<SparkEventFileSummary> fileSummaries = LsUtils.map(List.of(eventFiles), fn -> SparkEventFileSummary.parseFileName(fn.getName()));
            Map<Integer, SparkEventFileSummary> fileSummariesByNum = MapUtils.toMap(fileSummaries, fs -> fs.fileNum);

            for(int fileNum = 1; ;fileNum++) {
                SparkEventFileSummary fileSummary = fileSummariesByNum.get(fileNum);
                if (fileSummary != null) {
                    File file = new File(appDir, fileSummary.fileName);
                    try (val fileStream = new FileInputStream(file)) {
                        val lineReader = fileSummary.streamToLineReader(fileStream);

                        // *** The Biggy ***
                        appSummaryBuilder.readSparkEvents(lineReader);

                    } catch (IOException ex) {
                        throw new RuntimeException("Failed to read " + fileSummary.fileName, ex);
                    }
                } else {
                    // no more "events_*_spark-*" file
                    break;
                }
            }

            return appSummaryBuilder.build();
        } catch(IOException ex) {
            throw new RuntimeException("Failed to write summary event log for " + appKey, ex);
        }
    }

    @Override
    public Iterator<SparkEvent> getSparkEventsIterator() {
        return new InnerSparkEventsIterator();
    }

    protected class InnerSparkEventsIterator implements Iterator<SparkEvent> {

        private final Queue<File> pendingFiles;
        private BufferedReader currentFileReader;
        private String nextLine;

        public InnerSparkEventsIterator() {
            File[] eventFiles = appDir.listFiles(FILTER_SparkEventsFiles);
            if (eventFiles == null) {
                eventFiles = new File[0]; // ? no events
            }
            List<File> sortedFiles = LsUtils.sortBy(List.of(eventFiles), fn -> fn.getName());
            this.pendingFiles = new LinkedList<>(sortedFiles);
            this.currentFileReader = null;
            this.nextLine = null;
            advance();
        }

        private void advance() {
            try {
                while (true) {
                    if (currentFileReader == null) {
                        File nextFile = pendingFiles.poll();
                        if (nextFile == null) {
                            nextLine = null;
                            return; // no more files
                        }
                        currentFileReader = new BufferedReader(new InputStreamReader(new FileInputStream(nextFile)));
                    }
                    nextLine = currentFileReader.readLine();
                    if (nextLine != null) {
                        return; // got a line
                    } else {
                        currentFileReader.close();
                        currentFileReader = null; // move to next file
                    }
                }
            } catch (IOException ex) {
                throw new RuntimeException("Failed to read spark events", ex);
            }
        }

        @Override
        public boolean hasNext() {
            return nextLine != null;
        }

        @Override
        public SparkEvent next() {
            if (nextLine == null) {
                throw new NoSuchElementException();
            }
            SparkEvent event = JsonUtils.parseJson(nextLine, SparkEvent.class);
            advance();
            return event;
        }
    }

}
