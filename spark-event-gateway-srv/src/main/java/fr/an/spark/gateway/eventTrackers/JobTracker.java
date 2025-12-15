package fr.an.spark.gateway.eventTrackers;

import fr.an.spark.gateway.eventlog.model.SparkCallSite;
import fr.an.spark.gateway.eventlog.model.SparkContextConstants;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerJobEnd;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerJobStart;
import fr.an.spark.gateway.eventlog.model.StageInfo;
import fr.an.spark.gateway.utils.LsUtils;
import fr.an.spark.gateway.utils.MapUtils;
import fr.an.spark.gateway.utils.MutableInt;
import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.val;

import java.util.*;

public class JobTracker {

    private final SparkContextTracker sparkCtx;
    public final int jobId;

    public String name;
    public String description;

    public long submissionTime;
    // val stageIds: Seq[Int],
    public List<StageTracker> stages;
    public String jobGroup;
    public List<String> jobTags;
    @Getter
    public Map<String,String> startPropOverrides;

    public int numTasks;
    @Nullable
    private String rddScope;
    @Nullable
    private Boolean rddScopeNoOverride;

    @Nullable
    public Long sqlExecutionId;
    // public SqlExecutionTracker sqlExec;

    public int activeTasks = 0;
    public int completedTasks = 0;
    public int failedTasks = 0;

    // Holds both the stage ID and the task index, packed into a single long value.
    public Set<Long> completedIndices = new HashSet<>();

    public int killedTasks = 0;
    public Map<String, MutableInt> killedSummary = new HashMap<>();

    public int skippedTasks = 0;
    public List<Integer> skippedStages = new ArrayList<Integer>();

    public enum JobExecutionStatus {
        RUNNING,
        SUCCEEDED,
        FAILED
    }
    public JobExecutionStatus status = JobExecutionStatus.RUNNING;
    public long completionTime;

    public int duration() {
        return (int)(completionTime - submissionTime);
    }

    public List<Integer> completedStages = new ArrayList<Integer>();
    public int activeStages = 0;
    public int failedStages = 0;

    public SparkListenerJobStart startEvent;
    public SparkListenerJobEnd endEvent;

    // -----------------------------------------------------------------------------------------------------------------

    public JobTracker(SparkContextTracker sparkCtx, SparkListenerJobStart event) {
        this.sparkCtx = sparkCtx;
        this.jobId = event.jobId;

        List<StageInfo> stageInfos = LsUtils.sortBy(event.stageInfos, x -> x.stageId);
        val lastStageInfo = (stageInfos.isEmpty())? null : stageInfos.getLast();
        this.name = (lastStageInfo != null)? lastStageInfo.name : "";

        this.submissionTime = event.time;
        val eventProps = new LinkedHashMap<>(event.properties);
        this.description = SparkContextConstants.jobDescriptionOf(eventProps, true);
        this.jobGroup = SparkContextConstants.jobGroupIdOf(eventProps, true);
        this.jobTags = SparkContextConstants.jobTagsOf(eventProps, true);
        this.sqlExecutionId = SparkContextConstants.sqlExecutionIdOfOpt(eventProps, true);
        this.rddScope = SparkContextConstants.rddScopeOf(eventProps, true);
        this.rddScopeNoOverride = SparkContextConstants.rddScopeNoOverrideOf(eventProps, true);
        this.startPropOverrides = MapUtils.toOverridedMap(eventProps, sparkCtx.sparkProperties());

        // Compute (a potential over-estimate of) the number of tasks that will be run by this job.
        // This may be an over-estimate because the job start event references all of the result
        // stages' transitive stage dependencies, but some of these stages might be skipped if their
        // output is available from earlier runs.
        // See https://github.com/apache/spark/pull/3009 for a more extensive discussion.
        {
            val missingStages = LsUtils.filter(event.stageInfos, x -> x.completionTime == null);
            this.numTasks = LsUtils.mapSumInt(missingStages, x -> x.numTasks);
        }

        this.startEvent = event;
    }


    // -----------------------------------------------------------------------------------------------------------------

    public void onEndEvent(SparkListenerJobEnd event) {
        this.endEvent = event;

        if (event.jobResult.exception == null) {
            // JobSucceeded
            this.status = JobExecutionStatus.SUCCEEDED;
            // appStatusSource.SUCCEEDED_JOBS.inc();
        } else {
            // JobFailed
            this.status = JobExecutionStatus.FAILED;
            // appStatusSource.FAILED_JOBS.inc();
        }
        this.completionTime = event.time;

    }

    public boolean containsStageId(int stageId) {
        return null != LsUtils.findFirst(stages, stage -> stage.info.stageId == stageId);
    }

    public void addSkippedStage(int stageId) {
        skippedStages.add(stageId);
    }

    public void addCompletedStage(int stageId) {
        completedStages.add(stageId);
    }

    public void addCompletedIndex(long index) {
        this.completedIndices.add(index);
    }

    public MutableInt getOrCreateKilledSummaryCounter(String reason) {
        return killedSummary.computeIfAbsent(reason, kk ->new MutableInt());
    }

    public SparkCallSite callSiteFromStartStage() {
        if (startEvent == null) {
            return null;
        }
        String callSiteShort = null;
        String callSiteLong = null;
        if (! startEvent.stageInfos.isEmpty()) {
            val lastStageInfo = startEvent.stageInfos.getLast();
            callSiteLong = lastStageInfo.details;

            val rddInfos = lastStageInfo.rddInfos;
            if (!rddInfos.isEmpty()) {
                callSiteShort = rddInfos.getLast().callSite;
            }
        }
        return new SparkCallSite(callSiteShort, callSiteLong);
    }

}
