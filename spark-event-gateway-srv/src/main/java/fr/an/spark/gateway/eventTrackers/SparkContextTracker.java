package fr.an.spark.gateway.eventTrackers;

import fr.an.spark.gateway.dto.eventSummary.SparkAppMetricsDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkApplicationConfigDTO;
import fr.an.spark.gateway.eventTrackers.RDDTracker.RDDPartitionTracker;
import fr.an.spark.gateway.eventlog.model.*;
import fr.an.spark.gateway.eventlog.model.SparkEvent.*;
import fr.an.spark.gateway.eventlog.model.Sparkapi.*;
import fr.an.spark.gateway.eventlog.model.TaskEndReason.Resubmitted;
import fr.an.spark.gateway.eventlog.model.TaskEndReason.Success;
import fr.an.spark.gateway.eventlog.model.TaskEndReason.TaskCommitDenied;
import fr.an.spark.gateway.eventlog.model.TaskEndReason.TaskKilled;
import fr.an.spark.gateway.utils.LsUtils;
import fr.an.spark.gateway.utils.MutableInt;
import jakarta.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import java.util.*;
import java.util.function.Predicate;

/**
 * see <a href="https://github.com/apache/spark/blob/master/core/src/main/scala/org/apache/spark/status/AppStatusListener.scala">...</a>
 */
@Slf4j
public class SparkContextTracker extends SparkEventListener {

    @Nullable
    private final Predicate<SqlExecTracker> sqlExecutionRetainPredicate;
    @Nullable
    private final Predicate<JobTracker> topLevelJobRetainPredicate;

    @Nullable
    private final SparkEventTrackerCallback summaryCallback;

    private SparkApplicationConfigDTO sparkAppConfig = new SparkApplicationConfigDTO();

    private ApplicationInfoDTO appInfo;

    private SparkAppMetrics appMetrics = new SparkAppMetrics();

    private ApplicationEnvironmentInfoDTO envInfo;

    private SparkListenerApplicationStart applicationStartEvent;
    private SparkListenerEnvironmentUpdate environmentUpdateEvent;
    private SparkListenerApplicationEnd applicationEndEvent;



    private final Map<String, ExecutorTracker> liveExecutors = new HashMap<>();
    private final Map<String, ExecutorTracker> deadExecutors = new HashMap<>();
    private final Map<String, SchedulerPoolTracker> pools = new HashMap<>();
    private final Map<Integer,ResourceProfileTracker> liveResourceProfiles = new HashMap<>();
    private final Map<String, MiscellaneousProcessTracker> liveMiscellaneousProcess = new HashMap<>();

    private final Map<Long, SqlExecTracker> liveSqlExecs = new HashMap<>();
    private final Map<Integer, JobTracker> liveJobs = new HashMap<>();
    private final Map<StageKey, StageTracker> liveStages = new HashMap<>();
    private final Map<Long, TaskTracker> liveTasks = new HashMap<>();
    private final Set<StageKey> unschedulableTaskSets = new LinkedHashSet<>();

    private final Map<Integer, RDDTracker> liveRDDs = new HashMap<>();

    private int activeExecutorCount = 0;

    // once finished, may keep "retained" sqlExecs and jobs full Tracker, or summary only, else skip
    private final Map<Long, SqlExecTracker> retainSqlExecs = new LinkedHashMap<>();
    private final Map<Integer, JobTracker> retainTopLevelJobs = new LinkedHashMap<>();


    // -----------------------------------------------------------------------------------------------------------------

    public SparkContextTracker(@Nullable
                               Predicate<SqlExecTracker> sqlExecutionRetainPredicate,
                               @Nullable
                               Predicate<JobTracker> topLevelJobRetainPredicate,
                               @Nullable
                               SparkEventTrackerCallback summaryCallback) {
        this.sqlExecutionRetainPredicate = sqlExecutionRetainPredicate;
        this.topLevelJobRetainPredicate = topLevelJobRetainPredicate;
        this.summaryCallback = summaryCallback;
    }


    // -----------------------------------------------------------------------------------------------------------------

    public SparkAppMetricsDTO toAppMetricsDTO() { return appMetrics.toDTO(); }

    public SparkApplicationConfigDTO toSparkAppConfigDTO() {
        return sparkAppConfig;
    }

    public Map<String, String> sparkProperties() {
        return sparkAppConfig.sparkProperties;
    }

    private StageTracker getOrCreateStage(StageInfo info) {
        val stage = liveStages.computeIfAbsent(new StageKey(info.stageId, info.attemptId),
                k -> new StageTracker(info));
        stage.info = info;
        return stage;
    }

    private StageTracker liveStagesOpt(int stageId, int stageAttemptId) {
        return liveStages.get(new StageKey(stageId, stageAttemptId));
    }

    private TaskTracker liveTaskOpt(long taskId) {
        return liveTasks.get(taskId);
    }

    public SqlExecTracker sqlExecOpt(long sqlId) {
        return liveSqlExecs.get(sqlId);
    }


    private SchedulerPoolTracker schedulingPoolOpt(String name) {
        if (name == null) {
            return null; // name = "default"; // should not occur?
        }
        return pools.get(name);
    }

    private SchedulerPoolTracker getOrCreateSchedulingPool(String name) {
        if (name == null) {
            name = "default"; // should not occur?
        }
        return pools.computeIfAbsent(name, SchedulerPoolTracker::new);
    }

    private RDDTracker getOrUpdateRDD(RDDInfo rddInfo) {
        RDDTracker res = liveRDDs.get(rddInfo.rddId);
        if (res == null) {
            res = new RDDTracker(rddInfo, rddInfo.storageLevel);
            liveRDDs.put(rddInfo.rddId, res);
        } else {
            res.storageLevel = rddInfo.storageLevel;
        }
        return res;
    }

    private ExecutorTracker getOrCreateExecutor(String executorId, long addTime) {
        return liveExecutors.computeIfAbsent(executorId, id -> {
            activeExecutorCount += 1;
            return new ExecutorTracker(executorId, addTime);
        });
    }


    private MiscellaneousProcessTracker getOrCreateOtherProcess(String processId) {
        return liveMiscellaneousProcess.computeIfAbsent(processId, MiscellaneousProcessTracker::new);
    }

    public SqlExecTracker getRetainSqlExec(long id) {
        return retainSqlExecs.get(id);
    }
    public JobTracker getRetainTopLevelJob(int id) {
        return retainTopLevelJobs.get(id);
    }

    // -----------------------------------------------------------------------------------------------------------------

    @Override
    public void onOtherEvent(SparkEvent event) {
        log.warn("Unhandled event: " + event.getClass().getSimpleName());
        //  SparkListenerMiscellaneousProcessAdded =>
        //        onMiscellaneousProcessAdded(processInfoEvent)

        appMetrics.sparkListenerOtherEventCount++;
    }

    @Override
    public void onApplicationStart(SparkListenerApplicationStart event) {
        this.applicationStartEvent = event;
        val attempt = new ApplicationAttemptInfoDTO(
                event.appAttemptId,
                event.time,
                -1,
                event.time,
                -1L,
                event.sparkUser,
                false,
                sparkAppConfig.sparkVersion);

        this.appInfo = new ApplicationInfoDTO(
                event.appId,
                event.appName,
                List.of(attempt));

        // Update the driver block manager with logs from this event. The SparkContext initialization
        // code registers the driver before this event is sent.
        val d = liveExecutors.get("driver"); // SparkContext.DRIVER_IDENTIFIER)
        if (d != null) {
            if (event.driverLogs != null) {
                d.executorLogs.putAll(event.driverLogs);
            }
            // d.attributes = event.driverAttributes.getOrElse(Map.empty).toMap
        }
        appMetrics.sparkListenerApplicationStartCount++;

        if (summaryCallback != null) {
            summaryCallback.onApplicationStart(event);
        }
    }

    @Override
    public void onLogStart(SparkListenerLogStart event) {
        this.sparkAppConfig.fillFromOnLogStart(event);
        appMetrics.sparkListenerLogStartCount++;
        if (summaryCallback != null) {
            summaryCallback.onLogStart(event);
        }
    }

    @Override
    public void onResourceProfileAdded(SparkListenerResourceProfileAdded event) {
        this.sparkAppConfig.fillFromOnResourceProfileAdded(event);
//        val maxTasks = (event.resourceProfile.isCoresLimitKnown)? {
//            Some(event.resourceProfile.maxTasksPerExecutor(conf))
//        } else {
//            None
//        }
//        val liveRP = new ResourceProfileTracker(event.resourceProfile.id,
//                event.resourceProfile.executorResources, event.resourceProfile.taskResources, maxTasks)
//        liveResourceProfiles(event.resourceProfile.id) = liveRP
//        val rpInfo = new v1.ResourceProfileInfo(liveRP.resourceProfileId, liveRP.executorResources, liveRP.taskResources)
        appMetrics.sparkListenerResourceProfileAddedCount++;
        if (summaryCallback != null) {
            summaryCallback.onResourceProfileAdded(event);
        }
    }

    @Override
    public void onEnvironmentUpdate(SparkListenerEnvironmentUpdate event) {
        this.sparkAppConfig.fillFromOnEnvironmentUpdate(event);
        appMetrics.sparkListenerEnvironmentUpdateCount++;
        if (summaryCallback != null) {
            summaryCallback.onEnvironmentUpdate(event);
        }
    }

    @Override
    public void onApplicationEnd(SparkListenerApplicationEnd event) {
        this.applicationEndEvent = event;
        val old = appInfo.attempts.getLast();
        val attempt = new ApplicationAttemptInfoDTO(old.attemptId, //
                old.startTime, event.time, event.time, event.time - old.startTime, old.sparkUser,
                true, old.appSparkVersion);
        this.appInfo = new ApplicationInfoDTO(appInfo.id, appInfo.name, List.of(attempt));
        appMetrics.sparkListenerApplicationEndCount++;
        if (summaryCallback != null) {
            summaryCallback.onApplicationEnd(event);
        }
    }


    @Override
    public void onExecutorAdded(SparkListenerExecutorAdded event) {
        // This needs to be an update in case an executor re-registers after the driver has marked it as "dead".
        val exec = getOrCreateExecutor(event.executorId, event.time);
        exec.host = event.executorInfo.host;
        exec.isActive = true;
        exec.totalCores = event.executorInfo.totalCores;
        val rpId = event.executorInfo.resourceProfileId;
        ResourceProfileTracker liveRP = liveResourceProfiles.get(rpId);
        if (liveRP != null) {
//        val cpusPerTask = liveRP.flatMap(_.taskResources.get(CPUS))
//                .map(_.amount.toInt).getOrElse(defaultCpusPerTask);
//        val maxTasksPerExec = liveRP.flatMap(_.maxTasksPerExecutor)
//        exec.maxTasks = maxTasksPerExec.getOrElse(event.executorInfo.totalCores / cpusPerTask);
        }
        exec.executorLogs = event.executorInfo.logUrls;
        exec.resources = event.executorInfo.resourcesInfo;
        exec.attributes = event.executorInfo.attributes;
        exec.resourceProfileId = rpId;
        appMetrics.sparkListenerExecutorAddedCount++;
        if (summaryCallback != null) {
            summaryCallback.onExecutorAdded(event, exec);
        }
    }

    @Override
    public void onExecutorRemoved(SparkListenerExecutorRemoved event) {
        ExecutorTracker exec = liveExecutors.remove(event.executorId);
        if (exec == null) {
            // should not occur
            return;
        }
        activeExecutorCount = Math.max(0, activeExecutorCount - 1);
        exec.isActive = false;
        exec.removeTime = event.time;
        exec.removeReason = event.reason;

        // Remove all RDD distributions that reference the removed executor, in case there wasn't a corresponding event.
        for (val rdd : liveRDDs.values()) {
            rdd.removeDistribution(exec);
        }
        // Remove all RDD partitions that reference the removed executor
        for (RDDTracker rdd : liveRDDs.values()) {
            for (RDDPartitionTracker partition : rdd.getPartitions().values()) {
                if (partition.value == null || !partition.executors().contains(event.executorId)) {
                    continue;
                }
                int partExecutorsCount = partition.executors().size();
                long partMemoryUsed = partition.memoryUsed();
                long partDiskUsed = partition.diskUsed();
                if (partExecutorsCount == 1) {
                    rdd.removePartition(partition.blockName);
                    rdd.memoryUsed = addDeltaToValue(rdd.memoryUsed, partMemoryUsed * -1);
                    rdd.diskUsed = addDeltaToValue(rdd.diskUsed, partDiskUsed * -1);
                } else {
                    rdd.memoryUsed = addDeltaToValue(rdd.memoryUsed, (partMemoryUsed / partExecutorsCount) * -1);
                    rdd.diskUsed = addDeltaToValue(rdd.diskUsed, (partDiskUsed / partExecutorsCount) * -1);
                    partition.update(
                            LsUtils.filter(partition.executors(), e -> !e.equals(event.executorId)),
                            addDeltaToValue(partMemoryUsed, (partMemoryUsed / partExecutorsCount) * -1),
                            addDeltaToValue(partDiskUsed, (partDiskUsed / partExecutorsCount) * -1));
                }
            }
            if (isExecutorActiveForLiveStages(exec)) {
                // the executor was running for a currently active stage, so save it for now in
                // deadExecutors, and remove when there are no active stages overlapping with the
                // executor.
                deadExecutors.put(event.executorId, exec);
            }
        }
        appMetrics.sparkListenerExecutorRemovedCount++;
        if (summaryCallback != null) {
            summaryCallback.onExecutorRemoved(event, exec);
        }
    }

    /**
     * Apply a delta to a value, but ensure that it doesn't go negative.
     */
    private static long addDeltaToValue(long old, long delta){ return Math.max(0, old + delta); }


        /** Was the specified executor active for any currently live stages? */
    private boolean isExecutorActiveForLiveStages(ExecutorTracker exec) {
        for(val stage : liveStages.values()) {
            if (stage.info.submissionTime == null || stage.info.submissionTime < exec.removeTime) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void onExecutorExcluded(SparkListenerExecutorExcluded event) {
        ExecutorTracker exec = liveExecutors.get(event.executorId);
        if (exec == null) {
            // should not occur
            return;
        }
        updateExecExclusionStatus(exec, true);
        appMetrics.sparkListenerExecutorExcludedCount++;
        if (summaryCallback != null) {
            summaryCallback.onExecutorExcluded(event, exec);
        }
    }

    @Override
    public void onExecutorExcludedForStage(SparkListenerExecutorExcludedForStage event) {
        ExecutorTracker exec = liveExecutors.get(event.executorId);
        if (exec == null) {
            // should not occur
            return;
        }
        val stage = liveStagesOpt(event.stageId, event.stageAttemptId);
        if (null == stage) {
            // should not occur
            return;
        }
        setStageExcludedStatus(stage, List.of(event.executorId));
        exec.excludedInStages.add(event.stageId);
        appMetrics.sparkListenerExecutorExcludedForStageCount++;
        if (summaryCallback != null) {
            summaryCallback.onExecutorExcludedForStage(event, exec);
        }
    }

    @Override
    public void onNodeExcludedForStage(SparkListenerNodeExcludedForStage event) {
        // Implicitly exclude every available executor for the stage associated with this node
        val nodeExecs = LsUtils.filter(liveExecutors.values(), exec -> exec.host.equals(event.hostId) && exec.isNotDriver());
        val stage = liveStagesOpt(event.stageId, event.stageAttemptId);
        if (null == stage) {
            // should not occur
            return;
        }
        val executorIds = LsUtils.map(nodeExecs, exec -> exec.executorId);
        setStageExcludedStatus(stage, executorIds);
        for(val exec : nodeExecs) {
            exec.excludedInStages.add(event.stageId);
        }
        appMetrics.sparkListenerNodeExcludedForStageCount++;
        if (summaryCallback != null) {
            summaryCallback.onNodeExcludedForStage(event);
        }
    }

    private void setStageExcludedStatus(StageTracker stage, Collection<String> executorIds) {
        for(val executorId : executorIds) {
            val executorStageSummary = stage.executorSummary(executorId);
            executorStageSummary.isExcluded = true;
        }
        stage.addExcludedExecutorIds(executorIds);
    }

    @Override
    public void onExecutorUnexcluded(SparkListenerExecutorUnexcluded event) {
        ExecutorTracker exec = liveExecutors.get(event.executorId);
        if (exec == null) {
            // should not occur
            return;
        }
        updateExecExclusionStatus(exec, false);
        appMetrics.sparkListenerExecutorUnexcludedCount++;
        if (summaryCallback != null) {
            summaryCallback.onExecutorUnexcluded(event, exec);
        }
    }

    @Override
    public void onNodeExcluded(SparkListenerNodeExcluded event) {
        updateNodeExcluded(event.hostId, true);
        appMetrics.sparkListenerNodeExcludedCount++;
        if (summaryCallback != null) {
            summaryCallback.onNodeExcluded(event);
        }
    }

    @Override
    public void onNodeUnexcluded(SparkListenerNodeUnexcluded event) {
        updateNodeExcluded(event.hostId, false);
        appMetrics.sparkListenerNodeUnexcludedCount++;
        if (summaryCallback != null) {
            summaryCallback.onNodeUnexcluded(event);
        }
    }

    private void updateExecExclusionStatus(ExecutorTracker exec, boolean excluded) {
        // Since we are sending both blacklisted and excluded events for backwards compatibility
        // we need to protect against double counting so don't increment if already in
        // that state. Also protects against executor being excluded and then node being
        // separately excluded which could result in this being called twice for same
        // executor.
        if (exec.isExcluded != excluded) {
//            if (excluded) {
//                appStatusSource.foreach(_.BLACKLISTED_EXECUTORS.inc())
//                appStatusSource.foreach(_.EXCLUDED_EXECUTORS.inc())
//            } else {
//                appStatusSource.foreach(_.UNBLACKLISTED_EXECUTORS.inc())
//                appStatusSource.foreach(_.UNEXCLUDED_EXECUTORS.inc())
//            }
            exec.isExcluded = excluded;
        }
    }

    private void updateNodeExcluded(String host, boolean excluded) {
        // Implicitly (un)exclude every executor associated with the node.
        for (val exec : liveExecutors.values()) {
            if (exec.host.equals(host) && ! exec.executorId.equals("driver")) {
                updateExecExclusionStatus(exec, excluded);
            }
        }
    }

    @Override
    public void onJobStart(SparkListenerJobStart event) {
        val job = new JobTracker(this, event);
        liveJobs.put(event.jobId, job);

        job.stages = LsUtils.map(event.stageInfos, stageInfo -> {
            // A new job submission may re-use an existing stage, so this code needs to do an update instead of new
            StageTracker stage = getOrCreateStage(stageInfo);
            stage.jobs.add(job);
            // stage.jobIds += event.jobId;
            return stage;
        });

        if (job.sqlExecutionId != null) {
            appMetrics.sparkListenerSQLJobStartCount++;
        } else {
            appMetrics.sparkListenerTopLevelJobStartCount++;
        }

        if (job.sqlExecutionId != null) {
            if (summaryCallback != null) {
                summaryCallback.onTopLevelJobExecStart(event, job);
            }
        }
    }

    @Override
    public void onJobEnd(SparkListenerJobEnd event) {
        JobTracker job = liveJobs.remove(event.jobId);
        if (null == job) {
            return; // should not occur
        }
        // Check if there are any pending stages that match this job; mark those as skipped.
        val it = liveStages.entrySet().iterator();
        while (it.hasNext()) {
            val e = it.next();
            StageKey stageKey = e.getKey();
            if (job.containsStageId(stageKey.stageId())) {
                StageTracker stage = e.getValue();
                if (EnumStageStatus.PENDING.equals(stage.status)) {
                    stage.status = EnumStageStatus.SKIPPED;
                    job.skippedStages.add(stage.info.stageId);
                    job.skippedTasks += stage.info.numTasks;

                    SchedulerPoolTracker pool = pools.get(stage.schedulingPool);
                    if (null != pool) {
                        pool.removeStageId(stage.info.stageId);
                    }

                    it.remove();
                }
            }
        }

        job.onEndEvent(event);

        boolean jobSucceeded = event.jobResult.exception == null;

        // appStatusSource.JOB_DURATION.value.set(job.completionTime - job.submissionTime);

        // update global app status counters
        // appStatusSource.COMPLETED_STAGES.inc(job.completedStages.size)
        // appStatusSource.FAILED_STAGES.inc(job.failedStages)
        // appStatusSource.COMPLETED_TASKS.inc(job.completedTasks)
        // appStatusSource.FAILED_TASKS.inc(job.failedTasks)
        // appStatusSource.KILLED_TASKS.inc(job.killedTasks)
        // appStatusSource.SKIPPED_TASKS.inc(job.skippedTasks)
        // appStatusSource.SKIPPED_STAGES.inc(job.skippedStages.size)

        appMetrics.incrMetricsOnJobEnd(job);
        if (job.sqlExecutionId != null) {
            if (topLevelJobRetainPredicate == null || topLevelJobRetainPredicate.test(job)) {
                // ok, retain copy
                retainTopLevelJobs.put(job.jobId, job);
            }
            if (summaryCallback != null) {
                summaryCallback.onTopLevelJobExecEnd(event, job);
            }
        }
    }

    @Override
    public void onStageSubmitted(SparkListenerStageSubmitted event) {
        val stage = getOrCreateStage(event.stageInfo);
        stage.onStageSubmitted(event);

        // Look at all active jobs to find the ones that mention this stage.
        stage.jobs = LsUtils.filter(liveJobs.values(), job -> job.containsStageId(event.stageInfo.stageId));
        for(val job : stage.jobs) {
            // TODO
            // job.completedStages.remove(event.stageInfo.stageId);
            job.activeStages += 1;
        }

        val pool = getOrCreateSchedulingPool(stage.schedulingPool);
        pool.addStageId(event.stageInfo.stageId);

        for(val rddInfo : event.stageInfo.rddInfos) {
            if (rddInfo.storageLevel.isValid()) {
                getOrUpdateRDD(rddInfo);
            }
        }
        appMetrics.sparkListenerStageSubmittedCount++;
    }


    @Override
    public void onTaskStart(SparkListenerTaskStart event) {
        StageTracker stage = liveStagesOpt(event.stageId, event.stageAttemptId);
        if (null == stage) {
            log.warn("should not occur: stage not found for TaskStartEvent");
            return;
        }
        TaskInfo taskInfo = event.taskInfo;
        val task = new TaskTracker(stage, taskInfo);
        liveTasks.put(taskInfo.taskId, task);
        stage.onTaskStartEvent(task, event);

        val exec = getOrCreateExecutor(taskInfo.executorId, taskInfo.launchTime);
        exec.onTaskStartEvent(task, event);

        appMetrics.incrMetricsOnTaskStart(task);
    }

    @Override
    public void onSpeculativeTaskSubmitted(SparkListenerSpeculativeTaskSubmitted event) {
        // Nothing to do; speculative tasks are handled in onTaskStart.
        appMetrics.sparkListenerSpeculativeTaskSubmittedCount++;
    }

    @Override
    public void onTaskGettingResult(SparkListenerTaskGettingResult event) {
        // Call update on the task so that the "getting result" time is written to the store; the
        // value is part of the mutable TaskInfo state that the live entity already references.
        val task = liveTaskOpt(event.taskInfo.taskId);
        if (task != null) {
            task.onTaskGettingResultEvent(event);
        }
        appMetrics.sparkListenerTaskGettingResultCount++;
    }

    @Override
    public void onTaskEnd(SparkListenerTaskEnd event) {
        if (event.taskInfo == null) {
            appMetrics.sparkListenerInvalidEventCount++;
            return; // should not occur
        }

        TaskTracker task = liveTasks.remove(event.taskInfo.taskId);
        TaskMetrics metricsDelta = null;
        if (task != null) {
            task.info = event.taskInfo;

            // TODO
//            String errorMessage;
//            = event.reason match {
//                case Success =>
//                             None
//                case k: TaskKilled =>
//                        Some(k.reason)
//                case e: ExceptionFailure => // Handle ExceptionFailure because we might have accumUpdates
//                        Some(e.toErrorString)
//                case e: TaskFailedReason => // All other failure cases
//                        Some(e.toErrorString)
//                case other =>
//                             logInfo(log"Unhandled task end reason: ${MDC(LogKeys.REASON, other)}")
//                    None
//            }
//            task.errorMessage = errorMessage;
            // metricsDelta = task.updateMetrics(event.taskInfo.finishTime, event.taskMetrics);
        } // else should not occur

        // SPARK-41187: For `SparkListenerTaskEnd` with `Resubmitted` reason, which is raised by
        // executor lost, it can lead to negative `LiveStage.activeTasks` since there's no
        // corresponding `SparkListenerTaskStart` event for each of them. The negative activeTasks
        // will make the stage always remains in the live stage list as it can never meet the
        // condition activeTasks == 0. This in turn causes the dead executor to never be retained
        // if that live stage's submissionTime is less than the dead executor's removeTime.
        int completedDelta = 0, failedDelta = 0, killedDelta = 0, activeDelta = 0;
        val endReason = event.reason;
        if (endReason instanceof Success) {
            completedDelta = activeDelta = 1;
        } else if (endReason instanceof TaskKilled || endReason instanceof TaskCommitDenied) {
            killedDelta = activeDelta = 1;
        } else if (endReason instanceof Resubmitted) {
            failedDelta = 1;
        } else {
            failedDelta = activeDelta = 1;
        }

        val stage = liveStagesOpt(event.stageId, event.stageAttemptId);
        if (null != stage) {
            if (metricsDelta != null) {
                stage.metrics = MetricsHelper.addMetrics(stage.metrics, metricsDelta);
            }
            stage.activeTasks -= activeDelta;
            stage.completedTasks += completedDelta;
            if (completedDelta > 0) {
                stage.addCompletedIndex(event.taskInfo.index);
            }
            stage.failedTasks += failedDelta;
            stage.killedTasks += killedDelta;
            if (killedDelta > 0) {
                incrKilledTasksSummary(event.reason, stage.killedSummary);
            }
            stage.addActiveTasksPerExecutor(event.taskInfo.executorId, - activeDelta);

            stage.peakExecutorMetrics.compareAndUpdatePeakValues(event.taskExecutorMetrics);
            stage.executorSummary(event.taskInfo.executorId).peakExecutorMetrics
                    .compareAndUpdatePeakValues(event.taskExecutorMetrics);
            // [SPARK-24415] Wait for all tasks to finish before removing stage from live list
            val removeStage = stage.activeTasks == 0 && stage.status.isCompleteOrFailed();

            // Store both stage ID and task index in a single long variable for tracking at job level.
            val taskIndex = (((long)event.stageId) << Integer.SIZE) | event.taskInfo.index;
            for (JobTracker job : stage.jobs) {
                job.activeTasks -= activeDelta;
                job.completedTasks += completedDelta;
                if (completedDelta > 0) {
                    job.addCompletedIndex(taskIndex);
                }
                job.failedTasks += failedDelta;
                job.killedTasks += killedDelta;
                if (killedDelta > 0) {
                    incrKilledTasksSummary(event.reason, job.killedSummary);
                }
            }

            val esummary = stage.executorSummary(event.taskInfo.executorId);
            esummary.taskTime += event.taskInfo.duration();
            esummary.succeededTasks += completedDelta;
            esummary.failedTasks += failedDelta;
            esummary.killedTasks += killedDelta;
            if (metricsDelta != null) {
                esummary.metrics = MetricsHelper.addMetrics(esummary.metrics, metricsDelta);
            }

            // val isLastTask = stage.activeTasksPerExecutor(event.taskInfo.executorId) == 0;

            if (event.taskInfo.speculative) {
                val specStageSummary = stage.getOrCreateSpeculationStageSummary();
                specStageSummary.numActiveTasks -= 1;
                specStageSummary.numCompletedTasks += completedDelta;
                specStageSummary.numFailedTasks += failedDelta;
                specStageSummary.numKilledTasks += killedDelta;
            }

            if (removeStage) {
                liveStages.remove(new StageKey(event.stageId, event.stageAttemptId));
            }
        }

        val exec = liveExecutors.get(event.taskInfo.executorId);
        if (null != exec) {
            exec.activeTasks -= activeDelta;
            exec.completedTasks += completedDelta;
            exec.failedTasks += failedDelta;
            exec.totalDuration += event.taskInfo.duration();
            exec.peakExecutorMetrics.compareAndUpdatePeakValues(event.taskExecutorMetrics);

            // Note: For resubmitted tasks, we continue to use the metrics that belong to the
            // first attempt of this task. This may not be 100% accurate because the first attempt
            // could have failed half-way through. The correct fix would be to keep track of the
            // metrics added by each attempt, but this is much more complicated.
            if (! (event.reason instanceof Resubmitted)) {
                if (event.taskMetrics != null) {
                    val readMetrics = event.taskMetrics.shuffleReadMetrics;
                    exec.totalGcTime += event.taskMetrics.jvmGcTime;
                    exec.totalInputBytes += event.taskMetrics.inputMetrics.bytesRead;
                    exec.totalShuffleRead += readMetrics.localBytesRead + readMetrics.remoteBytesRead;
                    exec.totalShuffleWrite += event.taskMetrics.shuffleWriteMetrics.bytesWritten;
                }
            }

        }
        appMetrics.incrMetricsOnTaskEnd(task, event);
    }

    @Override
    public void onUnschedulableTaskSetAdded(SparkListenerUnschedulableTaskSetAdded event) {
        val stageKey = new StageKey(event.stageId, event.stageAttemptId);
        unschedulableTaskSets.add(stageKey);
        appMetrics.sparkListenerUnschedulableTaskSetAdded++;
        if (summaryCallback != null) {
            // TOADD summaryCallback.onUnschedulableTaskSetAdded(event);
        }
    }

    @Override
    public void onUnschedulableTaskSetRemoved(SparkListenerUnschedulableTaskSetRemoved event) {
        val stageKey = new StageKey(event.stageId, event.stageAttemptId);
        unschedulableTaskSets.remove(stageKey);
        appMetrics.sparkListenerUnschedulableTaskSetRemoved++;
        if (summaryCallback != null) {
            // TOADD summaryCallback.onUnschedulableTaskSetRemoved(event);
        }
    }

    @Override
    public void onStageCompleted(SparkListenerStageCompleted event) {
        val stage = liveStagesOpt(event.stageInfo.stageId, event.stageInfo.attemptId);
        if (null == stage) {
            appMetrics.sparkListenerInvalidEventCount++;
        }

        stage.info = event.stageInfo;

        // Because of SPARK-20205, old event logs may contain valid stages without a submission time
        // in their start event. In those cases, we can only detect whether a stage was skipped by
        // waiting until the completion event, at which point the field would have been set.
        EnumStageStatus stageStatus;
        if (event.stageInfo.failureReason != null) {
            stageStatus = EnumStageStatus.FAILED;
        } else if (event.stageInfo.submissionTime != null) {
            stageStatus = EnumStageStatus.COMPLETE;
        } else {
            stageStatus = EnumStageStatus.SKIPPED;
        }
        stage.status = stageStatus;

        for (val job : stage.jobs) {
            switch(stage.status) {
                case COMPLETE:
                    job.addCompletedStage(event.stageInfo.stageId);
                    break;
                case SKIPPED:
                    job.addSkippedStage(event.stageInfo.stageId);
                    job.skippedTasks += event.stageInfo.numTasks;
                    break;
                default:
                    job.failedStages += 1;
            }
            job.activeStages -= 1;
        }

        val pool = schedulingPoolOpt(stage.schedulingPool);
        if (null != pool) {
            pool.removeStageId(event.stageInfo.stageId);
        }

        val excludedExecutorIdsForStage = stage.excludedExecutors;
        if (excludedExecutorIdsForStage != null) {
            for(val executorId : excludedExecutorIdsForStage) {
                val exec = liveExecutors.get(executorId);
                if (exec != null) {
                    exec.removeExcludedInStage(event.stageInfo.stageId);
                }
            }
        }

        // Remove stage only if there are no active tasks remaining
        val removeStage = stage.activeTasks == 0;
        if (removeStage) {
            liveStages.remove(new StageKey(event.stageInfo.stageId, event.stageInfo.attemptId));
        }


        appMetrics.incrMetricsOnStageCompleted(stage);

        // remove any dead executors that were not running for any currently active stages
        // deadExecutors.filterInPlace((execId, exec) => isExecutorActiveForLiveStages(exec))


    }

    @Override
    public void onBlockManagerAdded(SparkListenerBlockManagerAdded event) {
        // This needs to set fields that are already set by onExecutorAdded because the driver is
        // considered an "executor" in the UI, but does not have a SparkListenerExecutorAdded event.
        ExecutorTracker exec = getOrCreateExecutor(event.blockManagerId.executorId, event.time);
        exec.onBlockManagerAdded(event);
        appMetrics.sparkListenerBlockManagerAddedCount++;
        if (summaryCallback != null) {
            summaryCallback.onBlockManagerAdded(event, exec);
        }
    }

    @Override
    public void onBlockManagerRemoved(SparkListenerBlockManagerRemoved event) {
        String executorId = event.blockManagerId.executorId;
        ExecutorTracker exec = liveExecutors.get(executorId);
        if (exec == null) {
            exec = deadExecutors.get(executorId);
        }
        if (exec == null) {
            // should not occur
            return;
        }
        exec.onBlockManagerRemoved(event);
        // cf onExecutorRemoved
        appMetrics.sparkListenerBlockManagerRemovedCount++;
        if (summaryCallback != null) {
            summaryCallback.onBlockManagerRemoved(event);
        }
    }

    @Override
    public void onUnpersistRDD(SparkListenerUnpersistRDD event) {
        RDDTracker rdd = liveRDDs.remove(event.rddId);
        if (null == rdd) {
            appMetrics.sparkListenerInvalidEventCount++;
            return;
        }
        val storageLevel = rdd.info.storageLevel;

        // Use RDD partition info to update executor block info.
        for(val part : rdd.getPartitions().values()) {
            val partExecutorIds = part.executors();
            if (partExecutorIds != null) {
                for (val executorId : partExecutorIds) {
                    val exec = liveExecutors.get(executorId);
                    if (exec != null) {
                        exec.rddBlocks = exec.rddBlocks - 1;
                    }
                }
            }
        }

        // Use RDD distribution to update executor memory and disk usage info.
        for (val rddDist : rdd.getDistributions()) {
            val exec = liveExecutors.get(rddDist.executorId);
            if (exec != null) {
                if (exec.hasMemoryInfo()) {
                    if (storageLevel.useOffHeap) {
                        exec.usedOffHeap = addDeltaToValue(exec.usedOffHeap, -rddDist.offHeapUsed);
                    } else {
                        exec.usedOnHeap = addDeltaToValue(exec.usedOnHeap, -rddDist.onHeapUsed);
                    }
                }
                exec.memoryUsed = addDeltaToValue(exec.memoryUsed, -rddDist.memoryUsed);
                exec.diskUsed = addDeltaToValue(exec.diskUsed, -rddDist.diskUsed);
            }
        }
        appMetrics.sparkListenerUnpersistRDDCount++;
        if (summaryCallback != null) {
            // TOADD summaryCallback.onUnpersisRDD(event, rdd);
        }
    }

    @Override
    public void onExecutorMetricsUpdate(SparkListenerExecutorMetricsUpdate event) {
        for (val accumUpdate : event.accumUpdates) {
            val taskId = accumUpdate.taskId;
            val stageId = accumUpdate.stageId;
            val stageAttemptId = accumUpdate.stageAttemptId;
            val accumUpdates = accumUpdate.accumUpdates;
            val task = liveTasks.get(taskId);
            if (null != task) {
                val metrics = TaskMetrics.fromAccumulatorInfos(accumUpdates);
                task.updateMetrics(metrics); // TODO delta = task.updateMetrics(metrics);

                val stage = liveStagesOpt(stageId, stageAttemptId);
                if (null != stage) {
                    // TODO stage.metrics = MetricsHelper.addMetrics(stage.metrics, delta);
                    // val esummary = stage.executorSummary(event.execId);
                    // esummary.metrics = MetricsHelper.addMetrics(esummary.metrics, delta);
                }
            }
        }

        // check if there is a new peak value for any of the executor level memory metrics
        // for the live UI. SparkListenerExecutorMetricsUpdate events are only processed
        // for the live UI.
        for(val e : event.executorUpdates.entrySet()) {
            val key = e.getKey();
            val peakUpdates = e.getValue();
            val exec = liveExecutors.get(event.execId);
            if (exec != null) {
                exec.peakExecutorMetrics.compareAndUpdatePeakValues(peakUpdates);
            }

            // Update stage level peak executor metrics.
            // updateStageLevelPeakExecutorMetrics(key._1, key._2, event.execId, peakUpdates);
        }

        appMetrics.sparkListenerExecutorMetricsUpdateCount++;
    }

    @Override
    public void onStageExecutorMetrics(SparkListenerStageExecutorMetrics event) {
        // check if there is a new peak value for any of the executor level memory metrics,
        // while reading from the log. SparkListenerStageExecutorMetrics are only processed
        // when reading logs.
        ExecutorTracker exec = liveExecutors.get(event.execId);
        if (exec == null) {
            exec = deadExecutors.get(event.execId);
        }
        if (exec != null) {
            exec.peakExecutorMetrics.compareAndUpdatePeakValues(event.executorMetrics);
        }

        // Update stage level peak executor metrics.
        updateStageLevelPeakExecutorMetrics(event.stageId, event.stageAttemptId, event.execId, event.executorMetrics);

        appMetrics.sparkListenerStageExecutorMetricsCount++;
    }

    private void updateStageLevelPeakExecutorMetrics(
            int stageId, int stageAttemptId, String executorId, ExecutorMetrics executorMetrics) {
        val stage = liveStagesOpt(stageId, stageAttemptId);
        if (null != stage) {
            stage.peakExecutorMetrics.compareAndUpdatePeakValues(executorMetrics);

            val esummary = stage.executorSummary(executorId);
            esummary.peakExecutorMetrics.compareAndUpdatePeakValues(executorMetrics);
        }
    }

    @Override
    public void onBlockUpdated(SparkListenerBlockUpdated event) {
        String blockIdText = event.blockUpdatedInfo.blockId;
        // TODO BlockId blockId = BlockId.fromText(blockIdText);
//        match {
//            case block: RDDBlockId => updateRDDBlock(event, block)
//            case stream: StreamBlockId => updateStreamBlock(event, stream)
//            case broadcast: BroadcastBlockId => updateBroadcastBlock(event, broadcast)
//            case _ =>
//        }
        appMetrics.sparkListenerBlockUpdatedCount++;
    }

//    private def updateRDDBlock(event: SparkListenerBlockUpdated, block: RDDBlockId) {
//        val now = System.nanoTime()
//        val executorId = event.blockUpdatedInfo.blockManagerId.executorId
//
//        // Whether values are being added to or removed from the existing accounting.
//        val storageLevel = event.blockUpdatedInfo.storageLevel
//        val diskDelta = event.blockUpdatedInfo.diskSize * (if (storageLevel.useDisk) 1 else -1)
//        val memoryDelta = event.blockUpdatedInfo.memSize * (if (storageLevel.useMemory) 1 else -1)
//
//        // We need information about the executor to update some memory accounting values in the
//        // RDD info, so read that beforehand.
//        val maybeExec = liveExecutors.get(executorId)
//        var rddBlocksDelta = 0
//
//        // Update the executor stats first, since they are used to calculate the free memory
//        // on tracked RDD distributions.
//        maybeExec.foreach { exec =>
//                updateExecutorMemoryDiskInfo(exec, storageLevel, memoryDelta, diskDelta)
//        }
//
//        // Update the block entry in the RDD info, keeping track of the deltas above so that we
//        // can update the executor information too.
//        liveRDDs.get(block.rddId).foreach { rdd =>
//                val partition = rdd.partition(block.name)
//
//            val executors = if (storageLevel.isValid) {
//                val current = partition.executors
//                if (current.contains(executorId)) {
//                    current
//                } else {
//                    rddBlocksDelta = 1
//                    current :+ executorId
//                }
//            } else {
//                rddBlocksDelta = -1
//                partition.executors.filter(_ != executorId)
//            }
//
//            // Only update the partition if it's still stored in some executor, otherwise get rid of it.
//            if (executors.nonEmpty) {
//                partition.update(executors,
//                        addDeltaToValue(partition.memoryUsed, memoryDelta),
//                        addDeltaToValue(partition.diskUsed, diskDelta))
//            } else {
//                rdd.removePartition(block.name)
//            }
//
//            maybeExec.foreach { exec =>
//                if (exec.rddBlocks + rddBlocksDelta > 0) {
//                    val dist = rdd.distribution(exec)
//                    dist.memoryUsed = addDeltaToValue(dist.memoryUsed, memoryDelta)
//                    dist.diskUsed = addDeltaToValue(dist.diskUsed, diskDelta)
//
//                    if (exec.hasMemoryInfo) {
//                        if (storageLevel.useOffHeap) {
//                            dist.offHeapUsed = addDeltaToValue(dist.offHeapUsed, memoryDelta)
//                        } else {
//                            dist.onHeapUsed = addDeltaToValue(dist.onHeapUsed, memoryDelta)
//                        }
//                    }
//                    dist.lastUpdate = null
//                } else {
//                    rdd.removeDistribution(exec)
//                }
//
//                // Trigger an update on other RDDs so that the free memory information is updated.
//                liveRDDs.values.foreach { otherRdd =>
//                    if (otherRdd.info.id != block.rddId) {
//                        otherRdd.distributionOpt(exec).foreach { dist =>
//                                dist.lastUpdate = null
//                            update(otherRdd, now)
//                        }
//                    }
//                }
//            }
//
//            rdd.memoryUsed = addDeltaToValue(rdd.memoryUsed, memoryDelta)
//            rdd.diskUsed = addDeltaToValue(rdd.diskUsed, diskDelta)
//            update(rdd, now)
//        }
//
//        // Finish updating the executor now that we know the delta in the number of blocks.
//        maybeExec.foreach { exec =>
//                exec.rddBlocks += rddBlocksDelta
//            maybeUpdate(exec, now)
//        }
//    }
//
//    private def updateStreamBlock(event: SparkListenerBlockUpdated, stream: StreamBlockId) {
//        val storageLevel = event.blockUpdatedInfo.storageLevel
//        if (storageLevel.isValid) {
//            val data = new StreamBlockData(
//                    stream.name,
//                    event.blockUpdatedInfo.blockManagerId.executorId,
//                    event.blockUpdatedInfo.blockManagerId.hostPort,
//                    storageLevel.description,
//                    storageLevel.useMemory,
//                    storageLevel.useDisk,
//                    storageLevel.deserialized,
//                    event.blockUpdatedInfo.memSize,
//                    event.blockUpdatedInfo.diskSize)
//            kvstore.write(data)
//        } else {
//            kvstore.delete(classOf[StreamBlockData],
//                    Array(stream.name, event.blockUpdatedInfo.blockManagerId.executorId))
//        }
//    }
//
//    private def updateBroadcastBlock(
//            event: SparkListenerBlockUpdated,
//            broadcast: BroadcastBlockId) {
//        val executorId = event.blockUpdatedInfo.blockManagerId.executorId
//        liveExecutors.get(executorId).foreach { exec =>
//                val now = System.nanoTime()
//            val storageLevel = event.blockUpdatedInfo.storageLevel
//
//            // Whether values are being added to or removed from the existing accounting.
//            val diskDelta = event.blockUpdatedInfo.diskSize * (if (storageLevel.useDisk) 1 else -1)
//            val memoryDelta = event.blockUpdatedInfo.memSize * (if (storageLevel.useMemory) 1 else -1)
//
//            updateExecutorMemoryDiskInfo(exec, storageLevel, memoryDelta, diskDelta)
//            maybeUpdate(exec, now)
//        }
//    }
//
//    private[spark] def updateExecutorMemoryDiskInfo(
//            exec: LiveExecutor,
//            storageLevel:StorageLevel,
//            memoryDelta: Long,
//            diskDelta: Long) {
//        if (exec.hasMemoryInfo) {
//            if (storageLevel.useOffHeap) {
//                exec.usedOffHeap = addDeltaToValue(exec.usedOffHeap, memoryDelta)
//            } else {
//                exec.usedOnHeap = addDeltaToValue(exec.usedOnHeap, memoryDelta)
//            }
//        }
//        exec.memoryUsed = addDeltaToValue(exec.memoryUsed, memoryDelta)
//        exec.diskUsed = addDeltaToValue(exec.diskUsed, diskDelta)
//    }

    private void incrKilledTasksSummary(TaskEndReason reason, Map<String, MutableInt> killSummary) {
        val key = reason.toKillSummaryKeyOpt();
        if (key != null) {
            killSummary.computeIfAbsent(key, k-> new MutableInt()).incr();
        }
    }

    @Override
    public void onMiscellaneousProcessAdded(SparkListenerMiscellaneousProcessAdded event) {
        val processInfo = event.info;
        val proc = getOrCreateOtherProcess(event.processId);
        proc.creationTime = event.time;
        proc.processLogs = processInfo.logUrlInfo;
        proc.hostPort = processInfo.hostPort;
        proc.isActive = true;
        proc.totalCores = processInfo.cores;

        appMetrics.sparkListenerMiscellaneousProcessAddedCount++;
        if (summaryCallback != null) {
            // TOADD summaryCallback.onMiscellaneousProcessAdded(event, processInfo);
        }
    }

    // SQL Listener
    // -----------------------------------------------------------------------------------------------------------------

    @Override
    public void onSQLExecutionStart(SparkListenerSQLExecutionStart event) {
        long sqlId = event.executionId;
        SqlExecTracker sqlExec = sqlExecOpt(sqlId);
        if (sqlExec != null) {
            // log.warn("should not occur, sqlExec already exists: " + sqlId);
            appMetrics.sparkListenerInvalidEventCount++;
            return;
        }
        sqlExec = new SqlExecTracker(this, sqlId);
        liveSqlExecs.put(sqlId, sqlExec);

        if (environmentUpdateEvent != null) {
            sqlExec.onSetContextEnvironment(environmentUpdateEvent, sparkAppConfig.executorCore);
        }

        sqlExec.onStartEvent(event);
        appMetrics.sparkListenerSQLExecutionStartCount++;
        if (summaryCallback != null) {
            summaryCallback.onSQLExecStart(event, sqlExec);
        }
    }

    @Override
    public void onSQLExecutionEnd(SparkListenerSQLExecutionEnd event) {
        val executionId = event.executionId;
        SqlExecTracker sqlExec = sqlExecOpt(executionId);
        if (null == sqlExec) {
            appMetrics.sparkListenerInvalidEventCount++;
            return; // should not occur
        }
        sqlExec.onEndEvent(event);
        liveSqlExecs.remove(executionId);

        appMetrics.incrMetricsOnSQLExecutionEnd(sqlExec);

        if (sqlExecutionRetainPredicate == null || sqlExecutionRetainPredicate.test(sqlExec)) {
            // ok, retain copy
            retainSqlExecs.put(executionId, sqlExec);
        }
        if (summaryCallback != null) {
            summaryCallback.onSQLExecEnd(event, sqlExec);
        }
    }

    @Override
    public void onSQLAdaptiveExecutionUpdate(SparkListenerSQLAdaptiveExecutionUpdate event) {
        SqlExecTracker sqlExec = sqlExecOpt(event.executionId);
        if (null == sqlExec) {
            appMetrics.sparkListenerInvalidEventCount++;
            return; // should not occur
        }
        sqlExec.onSQLAdaptiveExecutionUpdateEvent(event);
        appMetrics.sparkListenerSQLAdaptiveExecutionUpdateCount++;
    }

    @Override
    public void onSQLAdaptiveSQLMetricUpdates(SparkListenerSQLAdaptiveSQLMetricUpdates event) {
        SqlExecTracker sqlExec = sqlExecOpt(event.executionId);
        if (null == sqlExec) {
            appMetrics.sparkListenerInvalidEventCount++;
            return; // should not occur
        }
        sqlExec.onSQLAdaptiveMetricUpdatesEvent(event);
        appMetrics.sparkListenerSQLAdaptiveMetricUpdatesCount++;
    }

    @Override
    public void onSQLDriverAccumUpdates(SparkListenerDriverAccumUpdates event) {
        SqlExecTracker sqlExec = sqlExecOpt(event.executionId);
        if (null == sqlExec) {
            appMetrics.sparkListenerInvalidEventCount++;
            return; // should not occur
        }
        sqlExec.onSQLDriverAccumUpdatesEvent(event);
        appMetrics.sparkListenerSQLDriverAccumUpdatesCount++;
    }

}
