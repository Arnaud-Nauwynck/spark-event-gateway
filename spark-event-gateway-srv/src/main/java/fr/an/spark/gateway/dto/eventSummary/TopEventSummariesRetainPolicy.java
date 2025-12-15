package fr.an.spark.gateway.dto.eventSummary;

import fr.an.spark.gateway.clusters.TopEventSummariesRetainConf;
import fr.an.spark.gateway.eventTrackers.JobTracker;
import fr.an.spark.gateway.eventTrackers.SqlExecTracker;
import lombok.val;

public class TopEventSummariesRetainPolicy {

    public final int ignoreTopLevelJobMinTimeMs;
    public final int ignoreSQLMinTimeMs;

    public final int longestNTopLevelJobExecSummaries;
    public final int longestNSqlExecSummaries;

    public final int retainNRepeatedCallSite;
    public final int retainNExecsPerRepeatedCallSite;


    // -----------------------------------------------------------------------------------------------------------------

    public TopEventSummariesRetainPolicy(TopEventSummariesRetainConf conf) {
        this.ignoreTopLevelJobMinTimeMs = conf.ignoreTopLevelJobMinTimeMs;
        this.ignoreSQLMinTimeMs = conf.ignoreSQLMinTimeMs;
        this.longestNTopLevelJobExecSummaries = conf.slowestNTopLevelJobExecSummaries;
        this.longestNSqlExecSummaries = conf.slowestNSqlExecSummaries;
        this.retainNRepeatedCallSite = conf.retainNRepeatedCallSite;
        this.retainNExecsPerRepeatedCallSite = conf.retainNExecsPerRepeatedCallSite;
    }

    // -----------------------------------------------------------------------------------------------------------------

    public boolean shouldRetainTopLevelJobExecEventSummary(JobTracker job) {
        val duration = job.duration();
        if (duration < ignoreTopLevelJobMinTimeMs) {
            return false;
        }
        // TOADD may add more criteria here
        return true;
    }

    public boolean shouldRetainSQLExecutionEventSummary(SqlExecTracker sqlExec) {
        val duration = sqlExec.duration();
        if (duration < ignoreSQLMinTimeMs) {
            return false;
        }
        // TOADD may add more criteria here
        // for ex, ignore some Hive SQL statements like "set hive:var=value"
        return true;
    }

}
