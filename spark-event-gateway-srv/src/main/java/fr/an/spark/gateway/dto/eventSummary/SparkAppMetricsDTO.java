package fr.an.spark.gateway.dto.eventSummary;

import fr.an.spark.gateway.eventlog.model.TaskMetrics;

public class SparkAppMetricsDTO {

    public int invalidEvent;

    public int logStart;
    public int applicationStart;
    public int applicationEnd;
    public int resourceProfileAdded;
    public int environmentUpdate;

    public int blockManagerRemoved;
    public int blockManagerAdded;
    public int executorAdded;
    public int executorRemoved;
    public int executorExcluded;
    public int executorExcludedForStage;
    public int nodeExcludedForStage;
    public int executorUnexcluded;
    public int nodeExcluded;
    public int nodeUnexcluded;
    public int executorMetricsUpdate;

    public int sqlJobStart;
    public int topLevelJobStart;
    public int sqlJobEndSucceed;
    public int sqlJobEndFailed;
    public int topLevelJobEndSucceed;
    public int topLevelJobEndFailed;

    public int stageSubmitted;
    public int stageCompleted;
    public int stageCompletedSkip;
    public int stageCompletedFailed;
    public int stageCompletedPending;
    public int stageExecutorMetrics;

    public int taskStart;
    public int speculativeTaskSubmitted;
    public int taskGettingResult;
    public int unschedulableTaskSetAdded;
    public int unschedulableTaskSetRemoved;
    public int taskEnd;

    public int unpersistRDD;
    public int blockUpdated;

    public int sqlExecutionStart;
    public int sqlExecutionEnd;
    public int sqlAdaptiveExecutionUpdate;
    public int sqlAdaptiveMetricUpdates;
    public int sqlDriverAccumUpdates;

    public int miscellaneousProcessAdded;
    public int otherEvent;


    public TaskMetrics totalTaskMetrics = new TaskMetrics();
    public int spillMemoryTaskCount;
    public int spillDiskTaskCount;

}
