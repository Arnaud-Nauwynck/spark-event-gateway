package fr.an.spark.gateway.eventTrackers.model;

import fr.an.spark.gateway.utils.LsUtils;
import fr.an.spark.gateway.utils.MutableInt;

import java.util.*;

public class JobTracker {

    public final int jobId;

    public String name;
    public String description;
    public long submissionTime;
    // val stageIds: Seq[Int],
    public List<StageTracker> stages;
    public String jobGroup;
    public List<String> jobTags;
    public int numTasks;
    // @Nullable
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

    public List<Integer> completedStages = new ArrayList<Integer>();
    public int activeStages = 0;
    public int failedStages = 0;

    // -----------------------------------------------------------------------------------------------------------------

    public JobTracker(int jobId) {
        this.jobId = jobId;
    }

    public JobTracker(int jobId, String name, String description, long submissionTime,
                      String jobGroup, List<String> jobTags, int numTasks,
                      Long sqlExecutionId
    ) {
        this.jobId = jobId;
        this.name = name;
        this.description = description;
        this.submissionTime = submissionTime;
        this.jobGroup = jobGroup;
        this.jobTags = jobTags;
        this.numTasks = numTasks;
        this.sqlExecutionId = sqlExecutionId;
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
}
