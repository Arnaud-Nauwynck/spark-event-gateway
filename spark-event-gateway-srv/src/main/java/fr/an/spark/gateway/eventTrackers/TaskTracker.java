package fr.an.spark.gateway.eventTrackers;

import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerTaskGettingResult;
import fr.an.spark.gateway.eventlog.model.TaskInfo;
import fr.an.spark.gateway.eventlog.model.TaskMetrics;

import java.util.ArrayList;
import java.util.List;

/**
 * cf <a href="https://github.com/apache/spark/blob/master/core/src/main/scala/org/apache/spark/status/LiveEntity.scala#L121">...</a>
 */
public class TaskTracker {

    public final StageTracker stage;
    public final int stageId;
    public final int stageAttemptId;

    public TaskInfo info;

    // The task metrics use a special value when no metrics have been reported. The special value is
    // checked when calculating indexed values when writing to the store (see [[TaskDataWrapper]]).

    public TaskMetrics metrics = new TaskMetrics(); // TODO createMetrics(-1L)

    public List<TaskMetrics> metricTimeSeries = new ArrayList<>();

    public String errorMessage = null;

    // -----------------------------------------------------------------------------------------------------------------

    public TaskTracker(StageTracker stage, TaskInfo info) {
        this.stage = stage;
        this.info = info;
        this.stageId = stage.stageId;
        this.stageAttemptId = stage.stageAttemptId;
    }

    public void updateMetrics(TaskMetrics metrics) {
        metricTimeSeries.add(metrics);
//            val newMetrics = createMetrics(
//                    metrics.executorDeserializeTime,
//                    metrics.executorDeserializeCpuTime,
//                    metrics.executorRunTime,
//                    metrics.executorCpuTime,
//                    metrics.resultSize,
//                    metrics.jvmGcTime,
//                    metrics.resultSerializationTime,
//                    metrics.memoryBytesSpilled,
//                    metrics.diskBytesSpilled,
//                    metrics.peakExecutionMemory,
//                    metrics.inputMetrics.bytesRead,
//                    metrics.inputMetrics.recordsRead,
//                    metrics.outputMetrics.bytesWritten,
//                    metrics.outputMetrics.recordsWritten,
//                    metrics.shuffleReadMetrics.remoteBlocksFetched,
//                    metrics.shuffleReadMetrics.localBlocksFetched,
//                    metrics.shuffleReadMetrics.fetchWaitTime,
//                    metrics.shuffleReadMetrics.remoteBytesRead,
//                    metrics.shuffleReadMetrics.remoteBytesReadToDisk,
//                    metrics.shuffleReadMetrics.localBytesRead,
//                    metrics.shuffleReadMetrics.recordsRead,
//                    metrics.shuffleReadMetrics.corruptMergedBlockChunks,
//                    metrics.shuffleReadMetrics.mergedFetchFallbackCount,
//                    metrics.shuffleReadMetrics.remoteMergedBlocksFetched,
//                    metrics.shuffleReadMetrics.localMergedBlocksFetched,
//                    metrics.shuffleReadMetrics.remoteMergedChunksFetched,
//                    metrics.shuffleReadMetrics.localMergedChunksFetched,
//                    metrics.shuffleReadMetrics.remoteMergedBytesRead,
//                    metrics.shuffleReadMetrics.localMergedBytesRead,
//                    metrics.shuffleReadMetrics.remoteReqsDuration,
//                    metrics.shuffleReadMetrics.remoteMergedReqsDuration,
//                    metrics.shuffleWriteMetrics.bytesWritten,
//                    metrics.shuffleWriteMetrics.writeTime,
//                    metrics.shuffleWriteMetrics.recordsWritten);
        this.metrics = metrics;
    }

    public void onTaskGettingResultEvent(SparkListenerTaskGettingResult event) {
        this.info.gettingResultTime = event.taskInfo.gettingResultTime;
    }


}


