package fr.an.spark.gateway.eventTrackers;

import fr.an.spark.gateway.eventlog.model.SparkEvent.*;

/**
 * internal callback to enrich SparkEvent with tracking info
 */
public abstract class SparkEventTrackerCallback {

    protected SparkContextTracker sparkContextTracker;

    public void init(SparkContextTracker sparkContextTracker) {
        this.sparkContextTracker = sparkContextTracker;
    }

    public abstract void onApplicationStart(SparkListenerApplicationStart event);
    public abstract void onApplicationEnd(SparkListenerApplicationEnd event);
    public abstract void onLogStart(SparkListenerLogStart event);
    public abstract void onResourceProfileAdded(SparkListenerResourceProfileAdded event);
    public abstract void onEnvironmentUpdate(SparkListenerEnvironmentUpdate event);

    public abstract void onBlockManagerAdded(SparkListenerBlockManagerAdded event, ExecutorTracker exec);
    public abstract void onBlockManagerRemoved(SparkListenerBlockManagerRemoved event);
    public abstract void onExecutorAdded(SparkListenerExecutorAdded event, ExecutorTracker exec);
    public abstract void onExecutorRemoved(SparkListenerExecutorRemoved event, ExecutorTracker exec);
    public abstract void onExecutorExcluded(SparkListenerExecutorExcluded event, ExecutorTracker exec);
    public abstract void onExecutorExcludedForStage(SparkListenerExecutorExcludedForStage event, ExecutorTracker exec);
    public abstract void onExecutorUnexcluded(SparkListenerExecutorUnexcluded event, ExecutorTracker exec);
    public abstract void onNodeExcluded(SparkListenerNodeExcluded event);
    public abstract void onNodeExcludedForStage(SparkListenerNodeExcludedForStage event);
    public abstract void onNodeUnexcluded(SparkListenerNodeUnexcluded event);

    public abstract void onTopLevelJobExecStart(SparkListenerJobStart event, JobTracker job);
    public abstract void onTopLevelJobExecEnd(SparkListenerJobEnd event, JobTracker job);

    public abstract void onSQLExecStart(SparkListenerSQLExecutionStart event, SqlExecTracker sqlExec);
    public abstract void onSQLExecEnd(SparkListenerSQLExecutionEnd event, SqlExecTracker sqlExec);

}
