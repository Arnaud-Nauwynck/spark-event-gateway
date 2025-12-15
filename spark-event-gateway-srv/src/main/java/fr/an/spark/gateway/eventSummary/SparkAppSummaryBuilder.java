package fr.an.spark.gateway.eventSummary;

import com.fasterxml.jackson.core.JsonProcessingException;
import fr.an.spark.gateway.dto.eventSummary.*;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.*;
import fr.an.spark.gateway.eventTrackers.SparkContextTracker;
import fr.an.spark.gateway.service.SparkEventsReader;
import fr.an.spark.gateway.templates.TemplateDictionariesEntriesDTOBuilder;
import fr.an.spark.gateway.templates.TemplateDictionariesRegistry;
import fr.an.spark.gateway.utils.JsonUtils;
import lombok.RequiredArgsConstructor;
import lombok.val;

import java.io.*;
import java.util.Collection;
import java.util.function.Consumer;

public class SparkAppSummaryBuilder {

    protected final String clusterName;
    protected final String sparkAppName;

    protected final TopEventSummariesRetainPolicy topEventSummariesRetainPolicy;

    protected OutputStream summaryEventOutputStream;

    protected int eventNum;

    protected SparkContextTracker sparkContextTracker;

    protected TemplateDictionariesRegistry dictionariesRegistry = new TemplateDictionariesRegistry();

    protected LongestEventSummariesRetainBuilder longestEventSummariesRetainBuilder;



    // TODO @Deprecated..
    public SparkApplicationStartEventSummaryDTO applicationStart;
    public SparkApplicationEndEventSummaryDTO applicationEnd;
    public SparkLogStartEventSummaryDTO logStart;
    public SparkResourceProfileAddedEventSummaryDTO resourceProfileAdded;
    public SparkEnvironmentUpdateEventSummaryDTO envUpdate;


    // -----------------------------------------------------------------------------------------------------------------

    public SparkAppSummaryBuilder(
            String clusterName, String sparkAppName,
            TopEventSummariesRetainPolicy topEventSummariesRetainPolicy,
            OutputStream summaryEventOutputStream
    ) {
        this.clusterName = clusterName;
        this.sparkAppName = sparkAppName;
        this.topEventSummariesRetainPolicy = topEventSummariesRetainPolicy;
        this.summaryEventOutputStream = summaryEventOutputStream;
        this.longestEventSummariesRetainBuilder = new LongestEventSummariesRetainBuilder(
                topEventSummariesRetainPolicy.longestNSqlExecSummaries,
                topEventSummariesRetainPolicy.longestNTopLevelJobExecSummaries,
                topEventSummariesRetainPolicy.retainNRepeatedCallSite,
                topEventSummariesRetainPolicy.retainNExecsPerRepeatedCallSite);
        val jsonWriter = JsonUtils.jsonWriter;

        Consumer<SparkEventSummaryDTO> summaryConsumer = eventSummary -> {
            addEventSummaryToAppSummary(eventSummary);

            if (summaryEventOutputStream != null) {
                byte[] eventSummaryLine;
                try {
                    eventSummaryLine = jsonWriter.writeValueAsBytes(eventSummary);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
                try {
                    summaryEventOutputStream.write(eventSummaryLine);
                    summaryEventOutputStream.write('\n');
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        };
        val summaryCallback = new SummaryBuilderSparkEventTrackerCallback(dictionariesRegistry, summaryConsumer, topEventSummariesRetainPolicy);
        this.sparkContextTracker = new SparkContextTracker(null, null, summaryCallback);
        summaryCallback.init(sparkContextTracker);
    }

    public static SparkAppSummaryDTO readJson(Reader reader) {
        return JsonUtils.readJson(reader, SparkAppSummaryDTO.class);
    }

    public static void writeJson(Writer writer, SparkAppSummaryDTO src) {
        JsonUtils.writeJson(writer, src);
    }


    public void addEventSummaryToAppSummary(
            SparkEventSummaryDTO eventSummary
    ) {
        boolean isSpecialStartEvent = false;
        if (eventSummary instanceof SparkApplicationStartEventSummaryDTO event2) {
            this.applicationStart = event2;
            isSpecialStartEvent = true;
        } else if (eventSummary instanceof SparkApplicationEndEventSummaryDTO event2) {
            this.applicationEnd = event2;
            isSpecialStartEvent = true;
        } else if (eventSummary instanceof SparkLogStartEventSummaryDTO event2) {
            this.logStart = event2;
            isSpecialStartEvent = true;
        } else if (eventSummary instanceof SparkResourceProfileAddedEventSummaryDTO event2) {
            this.resourceProfileAdded = event2;
            isSpecialStartEvent = true;
        } else if (eventSummary instanceof SparkEnvironmentUpdateEventSummaryDTO event2) {
            this.envUpdate = event2;
            isSpecialStartEvent = true;
        }

        if (eventSummary instanceof SparkSQLExecutionEventSummaryDTO sqlExec) {
            longestEventSummariesRetainBuilder.addSqlExec(sqlExec);
        } else if (eventSummary instanceof SparkTopLevelJobExecEventSummaryDTO jobExec) {
            longestEventSummariesRetainBuilder.addJobExec(jobExec);
        }

    }

    public void readSparkEvents(BufferedReader lineReader) throws IOException {
        for(; ; eventNum++) {
            val line = lineReader.readLine();
            if (line == null) {
                break;
            }
            val sparkEvent = SparkEventsReader.readEvent(line, eventNum);
            if (sparkEvent != null) {
                sparkEvent.accept(sparkContextTracker);

                if (sparkEvent._isApplicationEndEvent()) {
                    // done reading events
                    break;
                }
            }
        }
    }


    public SparkAppSummaryDTO build() {
        if (summaryEventOutputStream != null) {
            // flush + close file
            try {
                summaryEventOutputStream.close();
            } catch (Exception ex) {
                throw new RuntimeException("Failed to close summaryEventOutputStream", ex);
            }
            this.summaryEventOutputStream = null;
        }

        val longestSqlExecs = longestEventSummariesRetainBuilder.longestSqlExecs();
        val longestTopLevelJobExecs = longestEventSummariesRetainBuilder.longestTopLevelJobs();

        val repeatedLongestSqlExecsPerCallSites = longestEventSummariesRetainBuilder.toRepeatedLongestSqlExecsPerCallSites();
        val repeatedLongestTopLevelJobExecsPerCallSites = longestEventSummariesRetainBuilder.toRepeatedLongestTopLevelJobExecsPerCallSites();

        val eventToDictionariesVisitor = new InnerRegisterTemplateEntriesEventSummaryVisitor(dictionariesRegistry);
        eventToDictionariesVisitor.registerEntriesForEvents(longestSqlExecs);
        eventToDictionariesVisitor.registerEntriesForEvents(longestTopLevelJobExecs);
        for(val e : repeatedLongestSqlExecsPerCallSites) {
            eventToDictionariesVisitor.registerEntriesForEvents(e.topSqlExecs);
        }
        for(val e : repeatedLongestTopLevelJobExecsPerCallSites) {
            eventToDictionariesVisitor.registerEntriesForEvents(e.topJobsExecs);
        }

        val templateDictionariesEntries = eventToDictionariesVisitor.toResultDictionariesEntriesDTO();

        return new SparkAppSummaryDTO(clusterName, sparkAppName, //
                sparkContextTracker.toSparkAppConfigDTO(), //
                sparkContextTracker.toAppMetricsDTO(), //
                applicationStart, applicationEnd, logStart, resourceProfileAdded, envUpdate, //
                longestSqlExecs, //
                longestTopLevelJobExecs, //
                repeatedLongestSqlExecsPerCallSites, //
                repeatedLongestTopLevelJobExecsPerCallSites, //
                templateDictionariesEntries
                );
    }

    @RequiredArgsConstructor
    protected static class InnerRegisterTemplateEntriesEventSummaryVisitor extends DefaultSparkEventSummaryVisitor {
        private final TemplateDictionariesEntriesDTOBuilder resBuilder;

        public InnerRegisterTemplateEntriesEventSummaryVisitor(TemplateDictionariesRegistry dics) {
            this.resBuilder = new TemplateDictionariesEntriesDTOBuilder(dics);
        }

        public void registerEntriesForEvents(Collection<? extends SparkEventSummaryDTO> events) {
            if (events != null) {
                for (val event : events) {
                    event.accept(this);
                }
            }
        }

        public TemplateDictionariesEntriesDTO toResultDictionariesEntriesDTO() {
            return resBuilder.toTemplateDictionariesEntriesDTO();
        }

        @Override
        public void onSQLExec(SparkSQLExecutionEventSummaryDTO event) {
            resBuilder.addEntriesForCallSite(event.callSiteTemplated);
            resBuilder.addEntriesForPlan(event.physicalPlanDescriptionTemplateId);
        }

        @Override
        public void onTopLevelJobExec(SparkTopLevelJobExecEventSummaryDTO event) {
            resBuilder.addEntriesForCallSite(event.callSiteTemplated);
        }

    }

}
