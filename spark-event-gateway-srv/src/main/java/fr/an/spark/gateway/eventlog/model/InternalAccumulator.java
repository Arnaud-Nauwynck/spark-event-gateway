package fr.an.spark.gateway.eventlog.model;

/**
 * A collection of fields and methods concerned with internal accumulators that represent
 * task level metrics.
 */
public class InternalAccumulator {

    // Prefixes used in names of internal task level metrics
    public static final String METRICS_PREFIX = "internal.metrics.";
    public static final String SHUFFLE_READ_METRICS_PREFIX = METRICS_PREFIX + "shuffle.read.";
    public static final String SHUFFLE_WRITE_METRICS_PREFIX = METRICS_PREFIX + "shuffle.write.";
    public static final String OUTPUT_METRICS_PREFIX = METRICS_PREFIX + "output.";
    public static final String INPUT_METRICS_PREFIX = METRICS_PREFIX + "input.";
    public static final String SHUFFLE_PUSH_READ_METRICS_PREFIX = METRICS_PREFIX + "shuffle.push.read.";

    // Names of internal task level metrics
    public static final String EXECUTOR_DESERIALIZE_TIME = METRICS_PREFIX + "executorDeserializeTime";
    public static final String EXECUTOR_DESERIALIZE_CPU_TIME = METRICS_PREFIX + "executorDeserializeCpuTime";
    public static final String EXECUTOR_RUN_TIME = METRICS_PREFIX + "executorRunTime";
    public static final String EXECUTOR_CPU_TIME = METRICS_PREFIX + "executorCpuTime";
    public static final String RESULT_SIZE = METRICS_PREFIX + "resultSize";
    public static final String JVM_GC_TIME = METRICS_PREFIX + "jvmGCTime";
    public static final String RESULT_SERIALIZATION_TIME = METRICS_PREFIX + "resultSerializationTime";
    public static final String MEMORY_BYTES_SPILLED = METRICS_PREFIX + "memoryBytesSpilled";
    public static final String DISK_BYTES_SPILLED = METRICS_PREFIX + "diskBytesSpilled";
    public static final String PEAK_EXECUTION_MEMORY = METRICS_PREFIX + "peakExecutionMemory";
    public static final String UPDATED_BLOCK_STATUSES = METRICS_PREFIX + "updatedBlockStatuses";
    public static final String TEST_ACCUM = METRICS_PREFIX + "testAccumulator";

    // Names of shuffle read metrics
    public static class ShuffleRead {
        public static final String REMOTE_BLOCKS_FETCHED = SHUFFLE_READ_METRICS_PREFIX + "remoteBlocksFetched";
        public static final String LOCAL_BLOCKS_FETCHED = SHUFFLE_READ_METRICS_PREFIX + "localBlocksFetched";
        public static final String REMOTE_BYTES_READ = SHUFFLE_READ_METRICS_PREFIX + "remoteBytesRead";
        public static final String REMOTE_BYTES_READ_TO_DISK = SHUFFLE_READ_METRICS_PREFIX + "remoteBytesReadToDisk";
        public static final String LOCAL_BYTES_READ = SHUFFLE_READ_METRICS_PREFIX + "localBytesRead";
        public static final String FETCH_WAIT_TIME = SHUFFLE_READ_METRICS_PREFIX + "fetchWaitTime";
        public static final String RECORDS_READ = SHUFFLE_READ_METRICS_PREFIX + "recordsRead";
        public static final String REMOTE_REQS_DURATION = SHUFFLE_READ_METRICS_PREFIX + "remoteReqsDuration";
        public static final String CORRUPT_MERGED_BLOCK_CHUNKS = SHUFFLE_PUSH_READ_METRICS_PREFIX + "corruptMergedBlockChunks";
        public static final String MERGED_FETCH_FALLBACK_COUNT = SHUFFLE_PUSH_READ_METRICS_PREFIX + "mergedFetchFallbackCount";
        public static final String REMOTE_MERGED_BLOCKS_FETCHED = SHUFFLE_PUSH_READ_METRICS_PREFIX + "remoteMergedBlocksFetched";
        public static final String LOCAL_MERGED_BLOCKS_FETCHED = SHUFFLE_PUSH_READ_METRICS_PREFIX + "localMergedBlocksFetched";
        public static final String REMOTE_MERGED_CHUNKS_FETCHED = SHUFFLE_PUSH_READ_METRICS_PREFIX + "remoteMergedChunksFetched";
        public static final String LOCAL_MERGED_CHUNKS_FETCHED = SHUFFLE_PUSH_READ_METRICS_PREFIX + "localMergedChunksFetched";
        public static final String REMOTE_MERGED_BYTES_READ = SHUFFLE_PUSH_READ_METRICS_PREFIX + "remoteMergedBytesRead";
        public static final String LOCAL_MERGED_BYTES_READ = SHUFFLE_PUSH_READ_METRICS_PREFIX + "localMergedBytesRead";
        public static final String REMOTE_MERGED_REQS_DURATION = SHUFFLE_PUSH_READ_METRICS_PREFIX + "remoteMergedReqsDuration";
    }

    // Names of shuffle write metrics
    public static class ShuffleWrite {
        public static final String BYTES_WRITTEN = SHUFFLE_WRITE_METRICS_PREFIX + "bytesWritten";
        public static final String RECORDS_WRITTEN = SHUFFLE_WRITE_METRICS_PREFIX + "recordsWritten";
        public static final String WRITE_TIME = SHUFFLE_WRITE_METRICS_PREFIX + "writeTime";
    }

    // Names of output metrics
    public static class Output {
        public static final String BYTES_WRITTEN = OUTPUT_METRICS_PREFIX + "bytesWritten";
        public static final String RECORDS_WRITTEN = OUTPUT_METRICS_PREFIX + "recordsWritten";
    }

    // Names of input metrics
    public static class Input {
        public static final String BYTES_READ = INPUT_METRICS_PREFIX + "bytesRead";
        public static final String RECORDS_READ = INPUT_METRICS_PREFIX + "recordsRead";
    }

}
