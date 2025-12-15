package fr.an.spark.gateway.clusters;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.DeflaterInputStream;

@RequiredArgsConstructor
@Slf4j
public class SparkEventFileSummary {

    public static final Pattern PATTERN_eventsSpark = Pattern.compile("events_([0-9]*)_spark-([^\\.]*)(.*)");

    public final String fileName;
    public final int fileNum;
    public final String sparkAppName;
    public final String fileExtension;

    public static boolean matchesFileName(String name) {
        return PATTERN_eventsSpark.matcher(name).matches();
    }

    public static SparkEventFileSummary parseFileName(String fileName) {
        Matcher m = PATTERN_eventsSpark.matcher(fileName);
        if (! m.matches()) {
            return null;
        }
        int fileNum = Integer.parseInt(m.group(1));
        String sparkAppName = m.group(2);
        String fileExtension = m.group(3);
        return new SparkEventFileSummary(fileName, fileNum, sparkAppName, fileExtension);
    }

    public BufferedReader streamToLineReader(InputStream fileStream) {
        InputStream stream;
        if (fileExtension == null || fileExtension.isEmpty() || fileExtension.equals(".ndjson")) {
            stream = fileStream;
        } else if (fileExtension.equals(".zstd")) {
            stream = new DeflaterInputStream(fileStream); // TOCHECK
        } else {
            log.warn("unrecognized file extension: " + fileExtension + " for file: " + fileName);
            stream = fileStream;
        }
        return new BufferedReader(new InputStreamReader(stream));
    }
}
