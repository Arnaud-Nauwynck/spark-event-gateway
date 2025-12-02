package fr.an.spark.gateway.eventlog.model;

import fr.an.spark.gateway.eventlog.model.SparkEvent.*;

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
    /** cf onExecutorExcluded */
    @Deprecated
    public abstract void onExecutorBlacklisted(SparkListenerExecutorBlacklisted event);
    public abstract void onExecutorExcluded(SparkListenerExecutorExcluded event);
    /** cf onExecutorExcludedForStage */
    @Deprecated
    public abstract void onExecutorBlacklistedForStage(SparkListenerExecutorBlacklistedForStage event);
    public abstract void onExecutorExcludedForStage(SparkListenerExecutorExcludedForStage event);
    @Deprecated
    public abstract void onNodeBlacklistedForStage(SparkListenerNodeBlacklistedForStage event);
    public abstract void onNodeExcludedForStage(SparkListenerNodeExcludedForStage event);
    @Deprecated
    public abstract void onExecutorUnblacklisted(SparkListenerExecutorUnblacklisted event);
    public abstract void onExecutorUnexcluded(SparkListenerExecutorUnexcluded event);
    @Deprecated
    public abstract void onNodeBlacklisted(SparkListenerNodeBlacklisted event);
    public abstract void onNodeExcluded(SparkListenerNodeExcluded event);
    @Deprecated
    public abstract void onNodeUnblacklisted(SparkListenerNodeUnblacklisted event);
    public abstract void onNodeUnexcluded(SparkListenerNodeUnexcluded event);

    public abstract void onUnschedulableTaskSetAdded(SparkListenerUnschedulableTaskSetAdded event);
    public abstract void onUnschedulableTaskSetRemoved(SparkListenerUnschedulableTaskSetRemoved event);
    public abstract void onBlockUpdated(SparkListenerBlockUpdated event);
    public abstract void onExecutorMetricsUpdate(SparkListenerExecutorMetricsUpdate event);
    public abstract void onStageExecutorMetrics(SparkListenerStageExecutorMetrics event);

    // SQL events
    public abstract void onSQLAdaptiveExecutionUpdate(SparkListenerSQLAdaptiveExecutionUpdate event);
    public abstract void onSQLAdaptiveSQLMetricUpdates(SparkListenerSQLAdaptiveSQLMetricUpdates event);
    public abstract void onSQLExecutionStart(SparkListenerSQLExecutionStart event);
    public abstract void onSQLExecutionEnd(SparkListenerSQLExecutionEnd event);
    public abstract void onDriverAccumUpdates(SparkListenerDriverAccumUpdates event);

    // Others
    public abstract void onOtherEvent(SparkEvent event);
}
