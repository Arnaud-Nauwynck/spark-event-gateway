package fr.an.spark.gateway.eventTrackers.model;

import fr.an.spark.gateway.eventTrackers.sql.SparkPlanInfoTree;
import fr.an.spark.gateway.eventlog.model.SparkEvent.*;
import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 */
@Getter
@Slf4j
public class SqlExecTracker {

    private final long sqlId;

    private SparkListenerEnvironmentUpdate environmentUpdateEvent;
    private int executorCores = 1;

    private SparkListenerSQLExecutionStart startEvent;

    private final List<SparkListenerSQLAdaptiveExecutionUpdate> sqlAdaptiveExecUpdates = new ArrayList<>();
    private final List<SparkListenerSQLAdaptiveSQLMetricUpdates> sqlAdaptiveMetricUpdates = new ArrayList<>();
    private final List<SparkListenerDriverAccumUpdates> driverAccumUpdates = new ArrayList<>();

    private final List<JobTracker> jobs = new ArrayList<>();
    private final Map<Integer, JobTracker> activeJobs = new HashMap<>();

    private SparkListenerSQLExecutionEnd endEvent;

    private SparkPlanInfo currPlanInfo; // TODO remove
    private SparkPlanInfoTree currPlanInfoTree;

    //-----------------------------------------------------------------------------------------------

    public SqlExecTracker(long sqlId) {
        this.sqlId = sqlId;
    }

    //---------------------------------------------------------------------------------------------

    public void onSetContextEnvironment(SparkListenerEnvironmentUpdate event, int executorCore) {
        this.environmentUpdateEvent = event;
        this.executorCores = executorCore;
        // log.info("SqlExecTracker.onSetContextEnvironment, executorCore: " + this.executorCores);
    }

    public void onStartEvent(SparkListenerSQLExecutionStart event) {
        this.startEvent = event;
        this.setCurrPlanInfo(event.getSparkPlanInfo());
    }

    public void onSQLAdaptiveExecutionUpdateEvent(SparkListenerSQLAdaptiveExecutionUpdate event) {
        this.sqlAdaptiveExecUpdates.add(event);
        this.setCurrPlanInfo(event.getSparkPlanInfo());
    }

    private void setCurrPlanInfo(SparkPlanInfo planInfo) {
        this.currPlanInfo = planInfo;
        if (planInfo != null) {
            SparkPlanInfoTree previousTree = this.currPlanInfoTree;
            this.currPlanInfoTree = new SparkPlanInfoTree(planInfo, previousTree);
        }
    }

    public void onSQLAdaptiveMetricUpdatesEvent(SparkListenerSQLAdaptiveSQLMetricUpdates event) {
        this.sqlAdaptiveMetricUpdates.add(event);
        Object planMetrics = event.getSqlPlanMetrics();
        // TODO
        log.info("onSQLAdaptiveMetricUpdatesEvent, sqlPlanMetrics: " + planMetrics);
    }

    public void onSQLDriverAccumUpdatesEvent(SparkListenerDriverAccumUpdates event) {
        this.driverAccumUpdates.add(event);
        val accumUpdates = event.toAccumUpdateValues();
        // log.info("onSQLDriverAccumUpdatesEvent, accumUpdates: " + accumUpdates);
        if (this.currPlanInfoTree != null) {
            this.currPlanInfoTree.onDriverAccumUpdatesEvent(event, accumUpdates);
        }
    }

    public void onEndEvent(SparkListenerSQLExecutionEnd event) {
        this.endEvent = event;
    }

    public void onChildJobStart(JobTracker job, SparkListenerJobStart event) {
        this.activeJobs.put(job.jobId, job);
        this.jobs.add(job);
    }

    public void onChildJobEnd(JobTracker job, SparkListenerJobEnd event) {
        this.activeJobs.remove(job.jobId);
        if (job == null) {
            // log.info("should not occur: unknown job end");
            return;
        }
    }

    public void onChildStageSubmitted(StageTracker stage, SparkListenerStageSubmitted event) {
        // ignore?
    }

    public void onChildStageCompleted(StageTracker stage, SparkListenerStageCompleted event) {
        // ignore?
    }

    public void onChildTaskStart(TaskTracker task, SparkListenerTaskStart event) {
        // ignore?
    }

    public void onChildTaskEnd(TaskTracker task, SparkListenerTaskEnd event) {
        // ignore?
        val accumulables = event.taskInfo.accumulables;
        val taskMetrics = event.taskMetrics;
        if (taskMetrics != null) {
            // log.info("SqlExecTracker.onChildTaskEnd, taskMetrics: " + taskMetrics);
        }
        if (accumulables != null) {
            if (this.currPlanInfoTree != null) {
                this.currPlanInfoTree.onChildTaskEndMetricValueUpdates(task, event, accumulables);
            }
        }
    }

    public void onChildTaskGettingResult(TaskTracker task, SparkListenerTaskGettingResult event) {
        // ignore?
    }
}
