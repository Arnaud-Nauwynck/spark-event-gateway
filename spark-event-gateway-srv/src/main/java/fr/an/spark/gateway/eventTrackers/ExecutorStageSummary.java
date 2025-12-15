package fr.an.spark.gateway.eventTrackers;

import fr.an.spark.gateway.eventlog.model.ExecutorMetrics;
import fr.an.spark.gateway.eventlog.model.TaskMetrics;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ExecutorStageSummary {

    public final int stageId;
    public final int attemptId;
    public final String executorId;

    public long taskTime = 0L;
    public int succeededTasks = 0;
    public int failedTasks = 0;
    public int killedTasks = 0;
    public boolean isExcluded = false;

    public TaskMetrics metrics = new TaskMetrics();

    public ExecutorMetrics peakExecutorMetrics = new ExecutorMetrics();

}
