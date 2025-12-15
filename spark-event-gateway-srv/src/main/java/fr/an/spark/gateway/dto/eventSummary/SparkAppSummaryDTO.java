package fr.an.spark.gateway.dto.eventSummary;

import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor @AllArgsConstructor
public class SparkAppSummaryDTO {

    public String clusterName;
    public String sparkAppName;

    public SparkApplicationConfigDTO sparkAppConfig;

    public SparkAppMetricsDTO appMetrics;

    // TODO @Deprecated..
    public SparkApplicationStartEventSummaryDTO applicationStart;
    public SparkApplicationEndEventSummaryDTO applicationEnd;
    public SparkLogStartEventSummaryDTO logStart;
    public SparkResourceProfileAddedEventSummaryDTO resourceProfileAdded;
    public SparkEnvironmentUpdateEventSummaryDTO envUpdate;

    /** top N longest durations SQLExecutions */
    public List<SparkSQLExecutionEventSummaryDTO> longestSqlExecs;

    /** top N longest durations TopLevel Job Execution */
    public List<SparkTopLevelJobExecEventSummaryDTO> longestTopLevelJobExecs;


    public List<RepeatedLongestSqlExecsPerCallSiteDTO> repeatedLongestSqlExecsPerCallSites;

    public List<RepeatedLongestTopLevelJobExecsPerCallSiteDTO> repeatedLongestTopLevelJobExecsPerCallSites;

    public TemplateDictionariesEntriesDTO templateDictionariesEntries;

    @NoArgsConstructor @AllArgsConstructor
    public static class RepeatedLongestSqlExecsPerCallSiteDTO {
        public CallSiteTemplatedStringDTO callSite;
        public int count;
        public int durationSum;
        // TODO TaskMetricsDTO metricsSum;
        public List<SparkSQLExecutionEventSummaryDTO> topSqlExecs;
    }

    @NoArgsConstructor @AllArgsConstructor
    public static class RepeatedLongestTopLevelJobExecsPerCallSiteDTO {
        public CallSiteTemplatedStringDTO callSite;
        public int count;
        public int durationSum;
        // TODO TaskMetricsDTO metricsSum;
        public List<SparkTopLevelJobExecEventSummaryDTO> topJobsExecs;
    }

}
