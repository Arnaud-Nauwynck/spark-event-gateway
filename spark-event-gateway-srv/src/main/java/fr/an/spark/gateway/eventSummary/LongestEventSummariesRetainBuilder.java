package fr.an.spark.gateway.eventSummary;

import fr.an.spark.gateway.dto.eventSummary.CallSiteTemplatedStringDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkAppSummaryDTO.RepeatedLongestSqlExecsPerCallSiteDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkAppSummaryDTO.RepeatedLongestTopLevelJobExecsPerCallSiteDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.SparkSQLExecutionEventSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.SparkTopLevelJobExecEventSummaryDTO;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.val;

import java.util.*;

public class LongestEventSummariesRetainBuilder {

    protected final RetainNByLongestDurationBuilder<SparkSQLExecutionEventSummaryDTO> longestSQLExecs;

    protected final RetainNByLongestDurationBuilder<SparkTopLevelJobExecEventSummaryDTO> longestTopLevelJobExecs;

    protected final int retainNRepeatedCallSite;
    protected final int retainNExecsPerRepeatedCallSite;
    protected final Map<CallSiteTemplatedStringDTO, RetainNByRepeatedDurationBuilder<SparkSQLExecutionEventSummaryDTO>> repeatedSQLDurationSumPerCallSites = new HashMap<>();
    protected final Map<CallSiteTemplatedStringDTO, RetainNByRepeatedDurationBuilder<SparkTopLevelJobExecEventSummaryDTO>> repeatedTopLevelJobDurationSumPerCallSites = new HashMap<>();

    public List<RepeatedLongestSqlExecsPerCallSiteDTO> toRepeatedLongestSqlExecsPerCallSites() {
        val retainRepeatedBuilder = new RetainNByLongestDurationBuilder<RepeatedLongestSqlExecsPerCallSiteDTO>(retainNRepeatedCallSite);
        for(val e : repeatedSQLDurationSumPerCallSites.entrySet()) {
            val callSite = e.getKey();
            val repeatedBuilder = e.getValue();
            if (repeatedBuilder.count <= 1) {
                continue;
            }
            val dto = new RepeatedLongestSqlExecsPerCallSiteDTO(callSite, repeatedBuilder.count, repeatedBuilder.durationSum,
                repeatedBuilder.topNItems(retainNExecsPerRepeatedCallSite));
            val id = callSite.longTemplateId; // may also use callSite.shortTemplateId
            retainRepeatedBuilder.add(new DurationAndIdKey(repeatedBuilder.durationSum, id), dto);
        }
        return new ArrayList<>(retainRepeatedBuilder.items.values());
    }

    public List<RepeatedLongestTopLevelJobExecsPerCallSiteDTO> toRepeatedLongestTopLevelJobExecsPerCallSites() {
        val retainRepeatedBuilder = new RetainNByLongestDurationBuilder<RepeatedLongestTopLevelJobExecsPerCallSiteDTO>(retainNRepeatedCallSite);
        for(val e : repeatedTopLevelJobDurationSumPerCallSites.entrySet()) {
            val callSite = e.getKey();
            val repeatedBuilder = e.getValue();
            if (repeatedBuilder.count <= 1) {
                continue;
            }
            val dto = new RepeatedLongestTopLevelJobExecsPerCallSiteDTO(callSite, repeatedBuilder.count, repeatedBuilder.durationSum,
                    repeatedBuilder.topNItems(retainNExecsPerRepeatedCallSite));
            val id = callSite.longTemplateId; // may also use callSite.shortTemplateId
            retainRepeatedBuilder.add(new DurationAndIdKey(repeatedBuilder.durationSum, id), dto);
        }
        return new ArrayList<>(retainRepeatedBuilder.items.values());
    }

    @RequiredArgsConstructor @EqualsAndHashCode
    protected static class DurationAndIdKey implements Comparable<DurationAndIdKey> {
        protected final int duration;
        protected final long id;

        @Override
        public int compareTo(DurationAndIdKey other) {
            int cmp = Integer.compare(-duration, -other.duration);
            if (cmp != 0) return cmp;
            return Long.compare(id, other.id);
        }
    }

    @RequiredArgsConstructor
    protected static class RetainNByLongestDurationBuilder<T> {
        protected final int retainCount;

        protected TreeMap<DurationAndIdKey,T> items = new TreeMap<>();
        protected int worstNthDurationSoFar = 0;

        public void add(DurationAndIdKey durationAndId, T item) {
            int duration = durationAndId.duration;
            if (duration > worstNthDurationSoFar) {
                items.put(durationAndId, item);
                if (items.size() > retainCount) {
                    items.remove(items.lastKey()); // TOCHECK first??
                    worstNthDurationSoFar = items.lastKey().duration;
                }
            }
        }

    }

    protected static class RetainNByRepeatedDurationBuilder<T> {
        protected int count = 0;
        protected int durationSum = 0;
        protected final RetainNByLongestDurationBuilder<T> retainNBuilder;

        public RetainNByRepeatedDurationBuilder(int retainCount) {
            this.retainNBuilder = new RetainNByLongestDurationBuilder<>(retainCount);
        }
        public void add(DurationAndIdKey durationAndId, T item) {
            this.count++;
            this.durationSum += durationAndId.duration;
            retainNBuilder.add(new DurationAndIdKey(durationSum, count), item);
        }

        public List<T> topNItems(int n) {
            val ls = new ArrayList<>(retainNBuilder.items.values());
            return (ls.size() > n)? ls.subList(0, n) : ls;
        }

    }


    // -----------------------------------------------------------------------------------------------------------------

    public LongestEventSummariesRetainBuilder(
            int retainSqlExecByDurations,
            int retainTopLevelJobExecByDurations,
            int retainNRepeatedCallSite,
            int retainNExecsPerRepeatedCallSite) {
        this.longestSQLExecs = new LongestEventSummariesRetainBuilder.RetainNByLongestDurationBuilder<>(retainSqlExecByDurations);
        this.longestTopLevelJobExecs = new RetainNByLongestDurationBuilder<>(retainTopLevelJobExecByDurations);
        this.retainNRepeatedCallSite = retainNRepeatedCallSite;
        this.retainNExecsPerRepeatedCallSite = retainNExecsPerRepeatedCallSite;
    }

    // -----------------------------------------------------------------------------------------------------------------

    public void addSqlExec(SparkSQLExecutionEventSummaryDTO sqlExec) {
        val durationAndId = new LongestEventSummariesRetainBuilder.DurationAndIdKey(sqlExec.duration, sqlExec.execId);
        longestSQLExecs.add(durationAndId, sqlExec);

        val callSiteKey = sqlExec.callSiteTemplated;
        repeatedSQLDurationSumPerCallSites.computeIfAbsent(callSiteKey,
                k -> new LongestEventSummariesRetainBuilder.RetainNByRepeatedDurationBuilder<>(retainNRepeatedCallSite)
        ).add(durationAndId, sqlExec);
    }

    public void addJobExec(SparkTopLevelJobExecEventSummaryDTO job) {
        val durationAndId = new DurationAndIdKey(job.duration, job.jobId);
        longestTopLevelJobExecs.add(durationAndId, job);

        val callSiteKey = job.callSiteTemplated;
        repeatedTopLevelJobDurationSumPerCallSites.computeIfAbsent(callSiteKey,
                k -> new RetainNByRepeatedDurationBuilder<>(retainNRepeatedCallSite)
        ).add(durationAndId, job);
    }

    public List<SparkSQLExecutionEventSummaryDTO> longestSqlExecs() {
        return new ArrayList<>(longestSQLExecs.items.values());
    }
    public List<SparkTopLevelJobExecEventSummaryDTO> longestTopLevelJobs() {
        return new ArrayList<>(longestTopLevelJobExecs.items.values());
    }

}
