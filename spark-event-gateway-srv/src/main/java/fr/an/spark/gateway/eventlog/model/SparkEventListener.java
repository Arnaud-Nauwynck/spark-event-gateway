package fr.an.spark.gateway.eventlog.model;

import fr.an.spark.gateway.eventlog.model.SparkEvent.*;

/**
 * Listener (=Visitor design pattern) of Spark events
 */
public abstract class SparkEventListener {

    public abstract void onApplicationStart(SparkListenerApplicationStart event);
    public abstract void onApplicationEnd(SparkListenerApplicationEnd event);
    public abstract void onLogStart(SparkListenerLogStart event);
    public abstract void onEnvironmentUpdate(SparkListenerEnvironmentUpdate event);
    public abstract void onResourceProfileAdded(SparkListenerResourceProfileAdded event);

    public abstract void onJobStart(SparkListenerJobStart event);
    public abstract void onJobEnd(SparkListenerJobEnd event);
    public abstract void onStageSubmitted(SparkListenerStageSubmitted event);
    public abstract void onStageCompleted(SparkListenerStageCompleted event);
    public abstract void onTaskStart(SparkListenerTaskStart event);
    public abstract void onTaskGettingResult(SparkListenerTaskGettingResult event);
    public abstract void onSpeculativeTaskSubmitted(SparkListenerSpeculativeTaskSubmitted event);
    public abstract void onTaskEnd(SparkListenerTaskEnd event);

    public abstract void onBlockManagerAdded(SparkListenerBlockManagerAdded event);
    public abstract void onBlockManagerRemoved(SparkListenerBlockManagerRemoved event);
    public abstract void onUnpersistRDD(SparkListenerUnpersistRDD event);

    public abstract void onExecutorAdded(SparkListenerExecutorAdded event);
    public abstract void onExecutorRemoved(SparkListenerExecutorRemoved event);
    public abstract void onExecutorExcluded(SparkListenerExecutorExcluded event);
    public abstract void onExecutorExcludedForStage(SparkListenerExecutorExcludedForStage event);
    public abstract void onExecutorUnexcluded(SparkListenerExecutorUnexcluded event);

    public abstract void onNodeExcluded(SparkListenerNodeExcluded event);
    public abstract void onNodeExcludedForStage(SparkListenerNodeExcludedForStage event);
    public abstract void onNodeUnexcluded(SparkListenerNodeUnexcluded event);

    public abstract void onUnschedulableTaskSetAdded(SparkListenerUnschedulableTaskSetAdded event);
    public abstract void onUnschedulableTaskSetRemoved(SparkListenerUnschedulableTaskSetRemoved event);
    public abstract void onBlockUpdated(SparkListenerBlockUpdated event);
    public abstract void onExecutorMetricsUpdate(SparkListenerExecutorMetricsUpdate event);
    public abstract void onStageExecutorMetrics(SparkListenerStageExecutorMetrics event);

    public abstract void onMiscellaneousProcessAdded(SparkListenerMiscellaneousProcessAdded event);

    // SQL events
    public abstract void onSQLAdaptiveExecutionUpdate(SparkListenerSQLAdaptiveExecutionUpdate event);
    public abstract void onSQLAdaptiveSQLMetricUpdates(SparkListenerSQLAdaptiveSQLMetricUpdates event);
    public abstract void onSQLExecutionStart(SparkListenerSQLExecutionStart event);
    public abstract void onSQLExecutionEnd(SparkListenerSQLExecutionEnd event);
    public abstract void onSQLDriverAccumUpdates(SparkListenerDriverAccumUpdates event);

    // Others
    public abstract void onOtherEvent(SparkEvent event);


    // Deprecated events, with replacements
    // -----------------------------------------------------------------------------------------------------------------

    /** cf onExecutorExcluded */
    @Deprecated
    public void onExecutorBlacklisted(SparkListenerExecutorBlacklisted event) {
        onExecutorExcluded(event.replaceByEvent());
    }

    @Deprecated
    public void onExecutorUnblacklisted(SparkListenerExecutorUnblacklisted event) {
        onExecutorUnexcluded(event.replaceByEvent());
    }

    /** cf onExecutorExcludedForStage */
    @Deprecated
    public void onExecutorBlacklistedForStage(SparkListenerExecutorBlacklistedForStage event) {
        onExecutorExcludedForStage(event.replaceByEvent());
    }

    @Deprecated
    public void onNodeBlacklisted(SparkListenerNodeBlacklisted event) {
        onNodeExcluded(event.replaceByEvent());
    }

    @Deprecated
    public void onNodeUnblacklisted(SparkListenerNodeUnblacklisted event) {
        onNodeUnexcluded(event.replaceByEvent());
    }

    @Deprecated
    public void onNodeBlacklistedForStage(SparkListenerNodeBlacklistedForStage event) {
        onNodeExcludedForStage(event.replaceByEvent());
    }

}
