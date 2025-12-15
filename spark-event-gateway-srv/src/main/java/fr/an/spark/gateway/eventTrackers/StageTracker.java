package fr.an.spark.gateway.eventTrackers;

import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerStageSubmitted;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerTaskStart;
import fr.an.spark.gateway.eventlog.model.Sparkapi.EnumStageStatus;
import fr.an.spark.gateway.eventlog.model.ExecutorMetrics;
import fr.an.spark.gateway.eventlog.model.SparkContextConstants;
import fr.an.spark.gateway.eventlog.model.StageInfo;
import fr.an.spark.gateway.eventlog.model.TaskMetrics;
import fr.an.spark.gateway.utils.MutableInt;
import fr.an.spark.gateway.utils.MutableLong;
import lombok.val;

import java.util.*;

/**
 *
 */
public class StageTracker {

    public final int stageId;
    public final int stageAttemptId;

    public StageInfo info;

    public List<JobTracker> jobs = new ArrayList<>(1);
    // var jobIds = Set[Int]()

    public EnumStageStatus status = EnumStageStatus.PENDING;

    public String description;
    public String schedulingPool = SparkContextConstants.DEFAULT_POOL_NAME;

    public int activeTasks = 0;
    public int completedTasks = 0;
    public int failedTasks = 0;

    protected Set<Integer> completedIndices = new LinkedHashSet<Integer>();

    public int killedTasks = 0;
    public Map<String, MutableInt> killedSummary = new HashMap<>();

    public long firstLaunchTime = Long.MAX_VALUE;

    protected Map<String, MutableLong> localitySummary = null; // = new HashMap<>();

    public TaskMetrics metrics = new TaskMetrics();

    public Map<String, ExecutorStageSummary> executorSummaries = new HashMap<>();

    public Map<String,MutableInt> activeTasksPerExecutor = new HashMap<>();

    public Set<String> excludedExecutors = null; // new HashSet<>();



    public ExecutorMetrics peakExecutorMetrics = new ExecutorMetrics();

    protected SpeculationStageSummary speculationStageSummary = null;
    public SpeculationStageSummary getOrCreateSpeculationStageSummary() {
        if (null == speculationStageSummary) {
            speculationStageSummary = new SpeculationStageSummary(info.stageId, info.attemptId);
        }
        return speculationStageSummary;
    }

    // val savedTasks = new AtomicInteger(0)

    // -----------------------------------------------------------------------------------------------------------------

    public StageTracker(StageInfo info) {
        this.stageId = info.stageId;
        this.stageAttemptId = info.attemptId;
        this.info = info;
    }

    // -----------------------------------------------------------------------------------------------------------------

    public void onStageSubmitted(SparkListenerStageSubmitted event) {
        this.status = EnumStageStatus.ACTIVE;

        val eventProps = new LinkedHashMap<>(event.properties);
        this.description = SparkContextConstants.jobDescriptionOf(eventProps, true);
        this.schedulingPool = SparkContextConstants.sparkSchedulerPoolOfOpt(eventProps, true);
    }

    public void onTaskStartEvent(TaskTracker task, SparkListenerTaskStart event) {
        val taskInfo = event.taskInfo;
        if (taskInfo.speculative) {
            val speculationStageSummary = getOrCreateSpeculationStageSummary();
            speculationStageSummary.numActiveTasks += 1;
            speculationStageSummary.numTasks += 1;
        }

        this.activeTasks += 1;
        this.firstLaunchTime = Math.min(firstLaunchTime, taskInfo.launchTime);

        val locality = taskInfo.locality; // toString() ??
        this.incrLocalitySummary(locality);
        this.incrActiveTasksPerExecutor(taskInfo.executorId);

        for(val job : jobs) {
            job.activeTasks += 1;
        }

        // if (savedTasks.incrementAndGet() > maxTasksPerStage && !cleaning) {
        //    this.cleaning = true
        //}
    }


    // -----------------------------------------------------------------------------------------------------------------

    public ExecutorStageSummary executorSummary(String executorId) {
        return executorSummaries.computeIfAbsent(executorId, id -> new ExecutorStageSummary(info.stageId, info.attemptId, id));
    }

    public void addExcludedExecutorIds(Collection<String> executorIds) {
        if (excludedExecutors == null) {
            excludedExecutors = new HashSet<>();
        }
        excludedExecutors.addAll(executorIds);
    }

    protected MutableLong getLocalitySummaryCounter(String locality) {
        if (localitySummary == null) {
            localitySummary = new HashMap<>();
        }
        return localitySummary.computeIfAbsent(locality, loc -> new MutableLong(0L));
    }

    public void incrLocalitySummary(String locality) {
        getLocalitySummaryCounter(locality).incr();
    }
    public void decrLocalitySummary(String locality) {
        getLocalitySummaryCounter(locality).decr();
    }

    protected MutableInt getActiveTasksPerExecutorCounter(String execId) {
        return activeTasksPerExecutor.computeIfAbsent(execId, id -> new MutableInt(0));
    }
    public void incrActiveTasksPerExecutor(String execId) {
        getActiveTasksPerExecutorCounter(execId).incr();
    }
    public void decrActiveTasksPerExecutor(String execId) {
        getActiveTasksPerExecutorCounter(execId).decr();
    }
    public void addActiveTasksPerExecutor(String execId, int incr) {
        getActiveTasksPerExecutorCounter(execId).addValue(incr);
    }

    public MutableInt getOrCreateKilledSummaryCounter(String reason) {
        return killedSummary.computeIfAbsent(reason, k -> new MutableInt());
    }

    public void addCompletedIndex(int index) {
        this.completedIndices.add(index);
    }


}
