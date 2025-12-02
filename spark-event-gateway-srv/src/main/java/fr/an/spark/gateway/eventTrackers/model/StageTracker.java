package fr.an.spark.gateway.eventTrackers.model;

import fr.an.spark.gateway.dto.Sparkapi.EnumStageStatus;
import fr.an.spark.gateway.eventlog.model.ExecutorMetrics;
import fr.an.spark.gateway.eventlog.model.SparkContextConstants;
import fr.an.spark.gateway.eventlog.model.StageInfo;
import fr.an.spark.gateway.eventlog.model.TaskMetrics;
import fr.an.spark.gateway.utils.MutableInt;
import fr.an.spark.gateway.utils.MutableLong;

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
