package fr.an.spark.gateway.eventTrackers;

import fr.an.spark.gateway.dto.eventSummary.SparkAppMetricsDTO;
import fr.an.spark.gateway.eventTrackers.JobTracker.JobExecutionStatus;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerTaskEnd;
import fr.an.spark.gateway.eventlog.model.TaskMetrics;
import lombok.val;

/**
 * global counters & metrics for SparkApp,
 * see corresponding DTO class:  SparkAppMetricsDTO
 */
public class SparkAppMetrics {

    public int sparkListenerInvalidEventCount;

    public int sparkListenerLogStartCount;
    public int sparkListenerApplicationStartCount;
    public int sparkListenerApplicationEndCount;
    public int sparkListenerOtherEventCount;
    public int sparkListenerResourceProfileAddedCount;
    public int sparkListenerEnvironmentUpdateCount;

    public int sparkListenerBlockManagerRemovedCount;
    public int sparkListenerBlockManagerAddedCount;

    public int sparkListenerExecutorAddedCount;
    public int sparkListenerExecutorRemovedCount;
    public int sparkListenerExecutorExcludedCount;
    public int sparkListenerExecutorExcludedForStageCount;
    public int sparkListenerNodeExcludedForStageCount;
    public int sparkListenerExecutorUnexcludedCount;
    public int sparkListenerNodeExcludedCount;
    public int sparkListenerNodeUnexcludedCount;

    public int sparkListenerSQLJobStartCount;
    public int sparkListenerTopLevelJobStartCount;

    public int sparkListenerSQLJobEndSucceedCount;
    public int sparkListenerSQLJobEndFailedCount;
    public int sparkListenerTopLevelJobEndSucceedCount;
    public int sparkListenerTopLevelJobEndFailedCount;

    public int sparkListenerStageSubmittedCount;
    public int sparkListenerStageCompletedCount;
    public int sparkListenerStageCompletedSkipCount;
    public int sparkListenerStageCompletedFailedCount;
    public int sparkListenerStageCompletedPendingCount;

    public int sparkListenerTaskStartCount;
    public int sparkListenerSpeculativeTaskSubmittedCount;
    public int sparkListenerTaskGettingResultCount;
    public int sparkListenerUnschedulableTaskSetAdded;
    public int sparkListenerUnschedulableTaskSetRemoved;
    public int sparkListenerTaskEndCount;
    public int sparkListenerUnpersistRDDCount;
    public int sparkListenerExecutorMetricsUpdateCount;
    public int sparkListenerStageExecutorMetricsCount;
    public int sparkListenerBlockUpdatedCount;
    public int sparkListenerMiscellaneousProcessAddedCount;
    public int sparkListenerSQLExecutionStartCount;
    public int sparkListenerSQLExecutionEndCount;
    public int sparkListenerSQLAdaptiveExecutionUpdateCount;
    public int sparkListenerSQLAdaptiveMetricUpdatesCount;
    public int sparkListenerSQLDriverAccumUpdatesCount;

    public TaskMetrics totalTaskMetrics = new TaskMetrics();
    public int spillMemoryTaskCount;
    public int spillDiskTaskCount;

    // -----------------------------------------------------------------------------------------------------------------

    public SparkAppMetricsDTO toDTO() {
        val res = new SparkAppMetricsDTO();
        res.invalidEvent = sparkListenerInvalidEventCount;
        res.logStart = sparkListenerLogStartCount;
        res.applicationStart = sparkListenerApplicationStartCount;
        res.applicationEnd = sparkListenerApplicationEndCount;
        res.otherEvent = sparkListenerOtherEventCount;
        res.resourceProfileAdded = sparkListenerResourceProfileAddedCount;
        res.environmentUpdate = sparkListenerEnvironmentUpdateCount;
        res.blockManagerRemoved = sparkListenerBlockManagerRemovedCount;
        res.blockManagerAdded = sparkListenerBlockManagerAddedCount;
        res.executorAdded = sparkListenerExecutorAddedCount;
        res.executorRemoved = sparkListenerExecutorRemovedCount;
        res.executorExcluded = sparkListenerExecutorExcludedCount;
        res.executorExcludedForStage = sparkListenerExecutorExcludedForStageCount;
        res.nodeExcludedForStage = sparkListenerNodeExcludedForStageCount;
        res.executorUnexcluded = sparkListenerExecutorUnexcludedCount;
        res.nodeExcluded = sparkListenerNodeExcludedCount;
        res.nodeUnexcluded = sparkListenerNodeUnexcludedCount;
        res.sqlJobStart = sparkListenerSQLJobStartCount;
        res.topLevelJobStart = sparkListenerTopLevelJobStartCount;
        res.sqlJobEndSucceed = sparkListenerSQLJobEndSucceedCount;
        res.sqlJobEndFailed = sparkListenerSQLJobEndFailedCount;
        res.topLevelJobEndSucceed = sparkListenerTopLevelJobEndSucceedCount;
        res.topLevelJobEndFailed = sparkListenerTopLevelJobEndFailedCount;
        res.stageSubmitted = sparkListenerStageSubmittedCount;
        res.stageCompleted = sparkListenerStageCompletedCount;
        res.stageCompletedSkip = sparkListenerStageCompletedSkipCount;
        res.stageCompletedFailed = sparkListenerStageCompletedFailedCount;
        res.stageCompletedPending = sparkListenerStageCompletedPendingCount;
        res.taskStart = sparkListenerTaskStartCount;
        res.speculativeTaskSubmitted = sparkListenerSpeculativeTaskSubmittedCount;
        res.taskGettingResult = sparkListenerTaskGettingResultCount;
        res.unschedulableTaskSetAdded = sparkListenerUnschedulableTaskSetAdded;
        res.unschedulableTaskSetRemoved = sparkListenerUnschedulableTaskSetRemoved;
        res.taskEnd = sparkListenerTaskEndCount;
        res.unpersistRDD = sparkListenerUnpersistRDDCount;
        res.executorMetricsUpdate = sparkListenerExecutorMetricsUpdateCount;
        res.stageExecutorMetrics = sparkListenerStageExecutorMetricsCount;
        res.blockUpdated = sparkListenerBlockUpdatedCount;
        res.miscellaneousProcessAdded = sparkListenerMiscellaneousProcessAddedCount;
        res.sqlExecutionStart = sparkListenerSQLExecutionStartCount;
        res.sqlExecutionEnd = sparkListenerSQLExecutionEndCount;
        res.sqlAdaptiveExecutionUpdate = sparkListenerSQLAdaptiveExecutionUpdateCount;
        res.sqlAdaptiveMetricUpdates = sparkListenerSQLAdaptiveMetricUpdatesCount;
        res.sqlDriverAccumUpdates = sparkListenerSQLDriverAccumUpdatesCount;

        res.totalTaskMetrics = totalTaskMetrics; // TODO toDTO()
        res.spillMemoryTaskCount = spillMemoryTaskCount;
        res.spillDiskTaskCount = spillDiskTaskCount;

        return res;
    }

    public void incrMetricsOnJobEnd(JobTracker job) {
        boolean jobSucceeded = job.status == JobExecutionStatus.SUCCEEDED;
        if (job.sqlExecutionId != null) {
            if (jobSucceeded) {
                sparkListenerSQLJobEndSucceedCount++;
            } else {
                sparkListenerSQLJobEndFailedCount++;
            }
        } else {
            if (jobSucceeded) {
                sparkListenerTopLevelJobEndSucceedCount++;
            } else {
                sparkListenerTopLevelJobEndFailedCount++;
            }
        }
    }

    public void incrMetricsOnTaskStart(TaskTracker task) {
        sparkListenerTaskStartCount++;
    }

    public void incrMetricsOnTaskEnd(TaskTracker task, SparkListenerTaskEnd event) {
        sparkListenerTaskEndCount++;
        val eventTaskMetrics = event.taskMetrics;
        if (eventTaskMetrics != null) {
            this.totalTaskMetrics.incrMetrics(eventTaskMetrics);
            if (eventTaskMetrics.memoryBytesSpilled > 0) {
                spillMemoryTaskCount++;
            }
            if (eventTaskMetrics.diskBytesSpilled > 0) {
                spillDiskTaskCount++;
            }
        }
    }

    public void incrMetricsOnStageCompleted(StageTracker stage) {
        switch(stage.status) {
            case COMPLETE:
                sparkListenerStageCompletedCount++;
                break;
            case SKIPPED:
                sparkListenerStageCompletedSkipCount++;
                break;
            case FAILED:
                sparkListenerStageCompletedFailedCount++;
                break;
            case PENDING:
                sparkListenerStageCompletedPendingCount++;
                break;
            case ACTIVE:
            default: // should not occur
                sparkListenerInvalidEventCount++;
                break;
        }
    }

    public void incrMetricsOnSQLExecutionEnd(SqlExecTracker sqlExec) {
        sparkListenerSQLExecutionEndCount++;
    }
}
