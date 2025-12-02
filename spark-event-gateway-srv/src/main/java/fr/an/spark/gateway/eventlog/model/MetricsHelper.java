package fr.an.spark.gateway.eventlog.model;

import fr.an.spark.gateway.eventlog.model.TaskMetrics.*;

import java.util.List;

public class MetricsHelper {

    public static String accuValuetoString(Object value) {
        if (value instanceof java.util.List<?>) {
            List<?> list = (java.util.List<?>) value;
            if (list.size() > 5) {
                StringBuilder sb = new StringBuilder();
                sb.append("[");
                for (int i = 0; i < 5; i++) {
                    if (i > 0) sb.append(",");
                    sb.append(String.valueOf(list.get(i)));
                }
                sb.append(",... ").append(list.size() - 5).append(" more items]");
                return sb.toString();
            } else {
                return list.toString();
            }
        } else {
            return String.valueOf(value);
        }
    }

//    public static List<AccumulableInfo> newAccumulatorInfos(Iterable<AccumulableInfo> accums) {
//        List<AccumulableInfo> result = new ArrayList<>();
//        for (AccumulableInfo acc : accums) {
//            // Filter out internal and SQL accumulators
//            if (!acc.internal && (acc.metadata == null || !acc.metadata.equals(AccumulatorContext.SQL_ACCUM_IDENTIFIER))) {
//                String name = acc.name; // != null ? weakIntern(acc.name) : null;
//                String update = acc.update != null ? accuValuetoString(acc.update) : null;
//                String value = acc.value != null ? accuValuetoString(acc.value) : null;
//                result.add(new AccumulableInfo(acc.id, name, update, value));
//            }
//        }
//        return result;
//    }

    public static TaskMetrics createMetrics(
            long executorDeserializeTime,
            long executorDeserializeCpuTime,
            long executorRunTime,
            long executorCpuTime,
            long resultSize,
            long jvmGcTime,
            long resultSerializationTime,
            long memoryBytesSpilled,
            long diskBytesSpilled,
            long peakExecutionMemory,
            long inputBytesRead,
            long inputRecordsRead,
            long outputBytesWritten,
            long outputRecordsWritten,
            long shuffleRemoteBlocksFetched,
            long shuffleLocalBlocksFetched,
            long shuffleFetchWaitTime,
            long shuffleRemoteBytesRead,
            long shuffleRemoteBytesReadToDisk,
            long shuffleLocalBytesRead,
            long shuffleRecordsRead,
            long shuffleCorruptMergedBlockChunks,
            long shuffleMergedFetchFallbackCount,
            long shuffleMergedRemoteBlocksFetched,
            long shuffleMergedLocalBlocksFetched,
            long shuffleMergedRemoteChunksFetched,
            long shuffleMergedLocalChunksFetched,
            long shuffleMergedRemoteBytesRead,
            long shuffleMergedLocalBytesRead,
            long shuffleRemoteReqsDuration,
            long shuffleMergedRemoteReqsDuration,
            long shuffleBytesWritten,
            long shuffleWriteTime,
            long shuffleRecordsWritten
    ) {
        return new TaskMetrics(
                executorDeserializeTime,
                executorDeserializeCpuTime,
                executorRunTime,
                executorCpuTime,
                resultSize,
                jvmGcTime,
                resultSerializationTime,
                memoryBytesSpilled,
                diskBytesSpilled,
                peakExecutionMemory,
                new InputMetrics(inputBytesRead, inputRecordsRead),
                new OutputMetrics(outputBytesWritten, outputRecordsWritten),
                new ShuffleReadMetrics(
                        shuffleRemoteBlocksFetched,
                        shuffleLocalBlocksFetched,
                        shuffleFetchWaitTime,
                        shuffleRemoteBytesRead,
                        shuffleRemoteBytesReadToDisk,
                        shuffleLocalBytesRead,
                        shuffleRecordsRead,
                        shuffleRemoteReqsDuration,
                        new ShufflePushReadMetrics(
                                shuffleCorruptMergedBlockChunks,
                                shuffleMergedFetchFallbackCount,
                                shuffleMergedRemoteBlocksFetched,
                                shuffleMergedLocalBlocksFetched,
                                shuffleMergedRemoteChunksFetched,
                                shuffleMergedLocalChunksFetched,
                                shuffleMergedRemoteBytesRead,
                                shuffleMergedLocalBytesRead,
                                shuffleMergedRemoteReqsDuration
                        )
                ),
                new ShuffleWriteMetrics(
                        shuffleBytesWritten,
                        shuffleWriteTime,
                        shuffleRecordsWritten
                ),
                null // updatedBlockStatus ???
        );
    }


    public static TaskMetrics createMetrics(long v) {
        return createMetrics(v, v, v, v, v, v, v, v,
            v, v, v, v, v, v, v, v, v,
            v, v, v, v, v, v, v, v, v,
            v, v, v, v, v, v, v, v);
    }

    /** Add m2 values to m1. */
    public static TaskMetrics addMetrics(TaskMetrics m1, TaskMetrics m2) {
        addMetrics(m1, m2, 1);
        return m1;
    }

    /** Subtract m2 values from m1. */
    public static TaskMetrics subtractMetrics(TaskMetrics m1, TaskMetrics m2) {
        addMetrics(m1, m2, -1);
        return m1;
    }

    private static long updateMetricValue(long metric) {
        return (metric * -1L) - 1L;
    }

    /**
     * Convert all the metric values to negative as well as handle zero values.
     * This method assumes that all the metric values are greater than or equal to zero
     */
    public static TaskMetrics makeNegative(TaskMetrics m) {
        // To handle 0 metric value, add  1 and make the metric negative.
        // To recover actual value do `math.abs(metric + 1)`
        // Eg: if the metric values are (5, 3, 0, 1) => Updated metric values will be (-6, -4, -1, -2)
        // To get actual metric value, do math.abs(metric + 1) => (5, 3, 0, 1)
        return createMetrics(
                updateMetricValue(m.executorDeserializeTime),
                updateMetricValue(m.executorDeserializeCpuTime),
                updateMetricValue(m.executorRunTime),
                updateMetricValue(m.executorCpuTime),
                updateMetricValue(m.resultSize),
                updateMetricValue(m.jvmGcTime),
                updateMetricValue(m.resultSerializationTime),
                updateMetricValue(m.memoryBytesSpilled),
                updateMetricValue(m.diskBytesSpilled),
                updateMetricValue(m.peakExecutionMemory),
                updateMetricValue(m.inputMetrics.bytesRead),
                updateMetricValue(m.inputMetrics.recordsRead),
                updateMetricValue(m.shuffleReadMetrics.shufflePushReadMetrics.corruptMergedBlockChunks),
                updateMetricValue(m.shuffleReadMetrics.shufflePushReadMetrics.mergedFetchFallbackCount),
                updateMetricValue(m.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedBlocksFetched),
                updateMetricValue(m.shuffleReadMetrics.shufflePushReadMetrics.localMergedBlocksFetched),
                updateMetricValue(m.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedChunksFetched),
                updateMetricValue(m.shuffleReadMetrics.shufflePushReadMetrics.localMergedChunksFetched),
                updateMetricValue(m.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedBytesRead),
                updateMetricValue(m.shuffleReadMetrics.shufflePushReadMetrics.localMergedBytesRead),
                updateMetricValue(m.shuffleReadMetrics.remoteReqsDuration),
                updateMetricValue(m.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedReqsDuration),
                updateMetricValue(m.outputMetrics.bytesWritten),
                updateMetricValue(m.outputMetrics.recordsWritten),
                updateMetricValue(m.shuffleReadMetrics.remoteBlocksFetched),
                updateMetricValue(m.shuffleReadMetrics.localBlocksFetched),
                updateMetricValue(m.shuffleReadMetrics.fetchWaitTime),
                updateMetricValue(m.shuffleReadMetrics.remoteBytesRead),
                updateMetricValue(m.shuffleReadMetrics.remoteBytesReadToDisk),
                updateMetricValue(m.shuffleReadMetrics.localBytesRead),
                updateMetricValue(m.shuffleReadMetrics.recordsRead),
                updateMetricValue(m.shuffleWriteMetrics.bytesWritten),
                updateMetricValue(m.shuffleWriteMetrics.writeTime),
                updateMetricValue(m.shuffleWriteMetrics.recordsWritten));
    }

    private static TaskMetrics addMetrics(TaskMetrics m1, TaskMetrics m2, int mult) {
        return createMetrics(
                m1.executorDeserializeTime + m2.executorDeserializeTime * mult,
                m1.executorDeserializeCpuTime + m2.executorDeserializeCpuTime * mult,
                m1.executorRunTime + m2.executorRunTime * mult,
                m1.executorCpuTime + m2.executorCpuTime * mult,
                m1.resultSize + m2.resultSize * mult,
                m1.jvmGcTime + m2.jvmGcTime * mult,
                m1.resultSerializationTime + m2.resultSerializationTime * mult,
                m1.memoryBytesSpilled + m2.memoryBytesSpilled * mult,
                m1.diskBytesSpilled + m2.diskBytesSpilled * mult,
                m1.peakExecutionMemory + m2.peakExecutionMemory * mult,
                m1.inputMetrics.bytesRead + m2.inputMetrics.bytesRead * mult,
                m1.inputMetrics.recordsRead + m2.inputMetrics.recordsRead * mult,
                m1.outputMetrics.bytesWritten + m2.outputMetrics.bytesWritten * mult,
                m1.outputMetrics.recordsWritten + m2.outputMetrics.recordsWritten * mult,
                m1.shuffleReadMetrics.remoteBlocksFetched + m2.shuffleReadMetrics.remoteBlocksFetched * mult,
                m1.shuffleReadMetrics.localBlocksFetched + m2.shuffleReadMetrics.localBlocksFetched * mult,
                m1.shuffleReadMetrics.fetchWaitTime + m2.shuffleReadMetrics.fetchWaitTime * mult,
                m1.shuffleReadMetrics.remoteBytesRead + m2.shuffleReadMetrics.remoteBytesRead * mult,
                m1.shuffleReadMetrics.remoteBytesReadToDisk +
                        m2.shuffleReadMetrics.remoteBytesReadToDisk * mult,
                m1.shuffleReadMetrics.localBytesRead + m2.shuffleReadMetrics.localBytesRead * mult,
                m1.shuffleReadMetrics.recordsRead + m2.shuffleReadMetrics.recordsRead * mult,
                m1.shuffleReadMetrics.shufflePushReadMetrics.corruptMergedBlockChunks +
                        m2.shuffleReadMetrics.shufflePushReadMetrics.corruptMergedBlockChunks * mult,
                m1.shuffleReadMetrics.shufflePushReadMetrics.mergedFetchFallbackCount +
                        m2.shuffleReadMetrics.shufflePushReadMetrics.mergedFetchFallbackCount * mult,
                m1.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedBlocksFetched +
                        m2.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedBlocksFetched * mult,
                m1.shuffleReadMetrics.shufflePushReadMetrics.localMergedBlocksFetched +
                        m2.shuffleReadMetrics.shufflePushReadMetrics.localMergedBlocksFetched * mult,
                m1.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedChunksFetched +
                        m2.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedChunksFetched * mult,
                m1.shuffleReadMetrics.shufflePushReadMetrics.localMergedChunksFetched +
                        m2.shuffleReadMetrics.shufflePushReadMetrics.localMergedChunksFetched * mult,
                m1.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedBytesRead +
                        m2.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedBytesRead * mult,
                m1.shuffleReadMetrics.shufflePushReadMetrics.localMergedBytesRead +
                        m2.shuffleReadMetrics.shufflePushReadMetrics.localMergedBytesRead * mult,
                m1.shuffleReadMetrics.remoteReqsDuration + m2.shuffleReadMetrics.remoteReqsDuration * mult,
                m1.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedReqsDuration +
                        m2.shuffleReadMetrics.shufflePushReadMetrics.remoteMergedReqsDuration * mult,
                m1.shuffleWriteMetrics.bytesWritten + m2.shuffleWriteMetrics.bytesWritten * mult,
                m1.shuffleWriteMetrics.writeTime + m2.shuffleWriteMetrics.writeTime * mult,
                m1.shuffleWriteMetrics.recordsWritten + m2.shuffleWriteMetrics.recordsWritten * mult);
    }

}


