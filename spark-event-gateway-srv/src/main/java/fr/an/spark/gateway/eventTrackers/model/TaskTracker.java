package fr.an.spark.gateway.eventTrackers.model;

import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerTaskGettingResult;
import fr.an.spark.gateway.eventlog.model.TaskInfo;
import fr.an.spark.gateway.eventlog.model.TaskMetrics;

import java.util.ArrayList;
import java.util.List;

/**
 * cf <a href="https://github.com/apache/spark/blob/master/core/src/main/scala/org/apache/spark/status/LiveEntity.scala#L121">...</a>
 */
public class TaskTracker {

    public TaskInfo info;
    public int stageId;
    public int stageAttemptId;

    // The task metrics use a special value when no metrics have been reported. The special value is
    // checked when calculating indexed values when writing to the store (see [[TaskDataWrapper]]).
//    private var metrics: v1.TaskMetrics = createMetrics(default = -1L)

    public TaskMetrics metrics;

    public record TimedTaskMetrics(long time, TaskMetrics metrics) {}
    public List<TimedTaskMetrics> metricTimeSeries = new ArrayList<>();

    public String errorMessage = null;

    // -----------------------------------------------------------------------------------------------------------------

    public TaskTracker(TaskInfo info, int stageId, int stageAttemptId) {
        this.info = info;
        this.stageId = stageId;
        this.stageAttemptId = stageAttemptId;
    }

    public void updateMetrics(long time, TaskMetrics metrics) {
        metricTimeSeries.add(new TimedTaskMetrics(time, metrics));
//            val newMetrics = createMetrics(
//                    metrics.executorDeserializeTime,
//                    metrics.executorDeserializeCpuTime,
//                    metrics.executorRunTime,
//                    metrics.executorCpuTime,
//                    metrics.resultSize,
//                    metrics.jvmGCTime,
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
//                    metrics.shuffleWriteMetrics.recordsWritten)
        this.metrics = metrics;
    }

    public void onTaskGettingResultEvent(SparkListenerTaskGettingResult event) {
        this.info.gettingResultTime = event.taskInfo.gettingResultTime;
    }


}


