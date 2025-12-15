package fr.an.spark.gateway.sql.metrics;

import java.util.Arrays;
import java.util.List;

/**
 *
 */
public class MetricDescriptions {

    public static class ShuffleRecordsWrittenMetricDescription extends MetricDescription {
        public ShuffleRecordsWrittenMetricDescription() {
            super("shuffle records written", EnumMetricType.SUM, EnumMetricUnit.RECORDS);
        }
    }

    public static class ShuffleWriteTimeMetricDescription extends MetricDescription {
        public ShuffleWriteTimeMetricDescription() {
            super("shuffle write time", EnumMetricType.NS_TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class RecordsReadMetricDescription extends MetricDescription {
        public RecordsReadMetricDescription() {
            super("records read", EnumMetricType.SUM, EnumMetricUnit.RECORDS);
        }
    }

    public static class LocalBytesReadMetricDescription extends MetricDescription {
        public LocalBytesReadMetricDescription() {
            super("local bytes read", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class RemoteBytesReadMetricDescription extends MetricDescription {
        public RemoteBytesReadMetricDescription() {
            super("remote bytes read", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class RemoteBytesReadToDiskMetricDescription extends MetricDescription {
        public RemoteBytesReadToDiskMetricDescription() {
            super("remote bytes read to disk", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class LocalBlocksReadMetricDescription extends MetricDescription {
        public LocalBlocksReadMetricDescription() {
            super("local blocks read", EnumMetricType.SUM, EnumMetricUnit.BLOCKS);
        }
    }

    public static class RemoteBlocksReadMetricDescription extends MetricDescription {
        public RemoteBlocksReadMetricDescription() {
            super("remote blocks read", EnumMetricType.SUM, EnumMetricUnit.BLOCKS);
        }
    }

    public static class FetchWaitTimeMetricDescription extends MetricDescription {
        public FetchWaitTimeMetricDescription() {
            super("fetch wait time", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class DataSizeMetricDescription extends MetricDescription {
        public DataSizeMetricDescription() {
            super("data size", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class NumberOfPartitionsMetricDescription extends MetricDescription {
        public NumberOfPartitionsMetricDescription() {
            super("number of partitions", EnumMetricType.SUM, EnumMetricUnit.PARTITIONS);
        }
    }

    public static class ShuffleBytesWrittenMetricDescription extends MetricDescription {
        public ShuffleBytesWrittenMetricDescription() {
            super("shuffle bytes written", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class SortTimeMetricDescription extends MetricDescription {
        public SortTimeMetricDescription() {
            super("sort time", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class PeakMemoryMetricDescription extends MetricDescription {
        public PeakMemoryMetricDescription() {
            super("peak memory", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class SpillSizeMetricDescription extends MetricDescription {
        public SpillSizeMetricDescription() {
            super("spill size", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class TimeToBroadcastMetricDescription extends MetricDescription {
        public TimeToBroadcastMetricDescription() {
            super("time to broadcast", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class TimeToBuildMetricDescription extends MetricDescription {
        public TimeToBuildMetricDescription() {
            super("time to build", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class TimeToCollectMetricDescription extends MetricDescription {
        public TimeToCollectMetricDescription() {
            super("time to collect", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class DurationMetricDescription extends MetricDescription {
        public DurationMetricDescription() {
            super("duration", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class TaskCommitTimeMetricDescription extends MetricDescription {
        public TaskCommitTimeMetricDescription() {
            super("task commit time", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class NumberOfWrittenFilesMetricDescription extends MetricDescription {
        public NumberOfWrittenFilesMetricDescription() {
            super("number of written files", EnumMetricType.SUM, EnumMetricUnit.FILES);
        }
    }

    public static class JobCommitTimeMetricDescription extends MetricDescription {
        public JobCommitTimeMetricDescription() {
            super("job commit time", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class NumberOfDynamicPartMetricDescription extends MetricDescription {
        public NumberOfDynamicPartMetricDescription() {
            super("number of dynamic part", EnumMetricType.SUM, EnumMetricUnit.PARTITIONS);
        }
    }

    public static class WrittenOutputMetricDescription extends MetricDescription {
        public WrittenOutputMetricDescription() {
            super("written output", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class NumberOfInputBatchesMetricDescription extends MetricDescription {
        public NumberOfInputBatchesMetricDescription() {
            super("number of input batches", EnumMetricType.SUM, EnumMetricUnit.BATCHES);
        }
    }

    public static class PartitionDataSizeMetricDescription extends MetricDescription {
        public PartitionDataSizeMetricDescription() {
            super("partition data size", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class NumberOfFilesReadMetricDescription extends MetricDescription {
        public NumberOfFilesReadMetricDescription() {
            super("number of files read", EnumMetricType.SUM, EnumMetricUnit.FILES);
        }
    }

    public static class ScanTimeMetricDescription extends MetricDescription {
        public ScanTimeMetricDescription() {
            super("scan time", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class DynamicPartitionPruningTimeMetricDescription extends MetricDescription {
        public DynamicPartitionPruningTimeMetricDescription() {
            super("dynamic partition pruning time", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class MetadataTimeMetricDescription extends MetricDescription {
        public MetadataTimeMetricDescription() {
            super("metadata time", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class SizeOfFilesReadMetricDescription extends MetricDescription {
        public SizeOfFilesReadMetricDescription() {
            super("size of files read", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class NumberOfOutputRowsMetricDescription extends MetricDescription {
        public NumberOfOutputRowsMetricDescription() {
            super("number of output rows", EnumMetricType.SUM, EnumMetricUnit.RECORDS);
        }
    }

    public static class NumberOfPartitionsReadMetricDescription extends MetricDescription {
        public NumberOfPartitionsReadMetricDescription() {
            super("number of partitions read", EnumMetricType.SUM, EnumMetricUnit.PARTITIONS);
        }
    }

    public static class NumberOfCoalescedPartitionsMetricDescription extends MetricDescription {
        public NumberOfCoalescedPartitionsMetricDescription() {
            super("number of coalesced partitions", EnumMetricType.SUM, EnumMetricUnit.PARTITIONS);
        }
    }

    public static class TimeInAggregationBuildMetricDescription extends MetricDescription {
        public TimeInAggregationBuildMetricDescription() {
            super("time in aggregation build", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class NumberOfSortFallbackTasksMetricDescription extends MetricDescription {
        public NumberOfSortFallbackTasksMetricDescription() {
            super("number of sort fallback tasks", EnumMetricType.SUM, EnumMetricUnit.TASKS);
        }
    }

    public static class AvgHashProbeBucketListItersMetricDescription extends MetricDescription {
        public AvgHashProbeBucketListItersMetricDescription() {
            super("avg hash probe bucket list iters", EnumMetricType.AVERAGE, EnumMetricUnit.COUNT);
        }
    }

    public static class LocalMergedChunksFetchedMetricDescription extends MetricDescription {
        public LocalMergedChunksFetchedMetricDescription() {
            super("local merged chunks fetched", EnumMetricType.SUM, EnumMetricUnit.CHUNKS);
        }
    }

    public static class RemoteMergedBytesReadMetricDescription extends MetricDescription {
        public RemoteMergedBytesReadMetricDescription() {
            super("remote merged bytes read", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    public static class CorruptMergedBlockChunksMetricDescription extends MetricDescription {
        public CorruptMergedBlockChunksMetricDescription() {
            super("corrupt merged block chunks", EnumMetricType.SUM, EnumMetricUnit.CHUNKS);
        }
    }

    public static class RemoteMergedReqsDurationMetricDescription extends MetricDescription {
        public RemoteMergedReqsDurationMetricDescription() {
            super("remote merged reqs duration", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class LocalMergedBlocksFetchedMetricDescription extends MetricDescription {
        public LocalMergedBlocksFetchedMetricDescription() {
            super("local merged blocks fetched", EnumMetricType.SUM, EnumMetricUnit.BLOCKS);
        }
    }

    public static class RemoteMergedBlocksFetchedMetricDescription extends MetricDescription {
        public RemoteMergedBlocksFetchedMetricDescription() {
            super("remote merged blocks fetched", EnumMetricType.SUM, EnumMetricUnit.BLOCKS);
        }
    }

    public static class MergedFetchFallbackCountMetricDescription extends MetricDescription {
        public MergedFetchFallbackCountMetricDescription() {
            super("merged fetch fallback count", EnumMetricType.SUM, EnumMetricUnit.COUNT);
        }
    }

    public static class RemoteReqsDurationMetricDescription extends MetricDescription {
        public RemoteReqsDurationMetricDescription() {
            super("remote reqs duration", EnumMetricType.TIMING, EnumMetricUnit.MILLIS);
        }
    }

    public static class RemoteMergedChunksFetchedMetricDescription extends MetricDescription {
        public RemoteMergedChunksFetchedMetricDescription() {
            super("remote merged chunks fetched", EnumMetricType.SUM, EnumMetricUnit.CHUNKS);
        }
    }

    public static class LocalMergedBytesReadMetricDescription extends MetricDescription {
        public LocalMergedBytesReadMetricDescription() {
            super("local merged bytes read", EnumMetricType.SIZE, EnumMetricUnit.BYTES);
        }
    }

    // Registration method
    public static void registerStdMetricDescriptions(MetricDescriptionRegistry registry) {
        List<MetricDescription> descriptions = Arrays.asList(
                new ShuffleRecordsWrittenMetricDescription(),
                new ShuffleWriteTimeMetricDescription(),
                new RecordsReadMetricDescription(),
                new LocalBytesReadMetricDescription(),
                new RemoteBytesReadMetricDescription(),
                new RemoteBytesReadToDiskMetricDescription(),
                new LocalBlocksReadMetricDescription(),
                new RemoteBlocksReadMetricDescription(),
                new FetchWaitTimeMetricDescription(),
                new DataSizeMetricDescription(),
                new NumberOfPartitionsMetricDescription(),
                new ShuffleBytesWrittenMetricDescription(),
                new SortTimeMetricDescription(),
                new PeakMemoryMetricDescription(),
                new SpillSizeMetricDescription(),
                new TimeToBroadcastMetricDescription(),
                new TimeToBuildMetricDescription(),
                new TimeToCollectMetricDescription(),
                new DurationMetricDescription(),
                new TaskCommitTimeMetricDescription(),
                new TimeToBroadcastMetricDescription(),
                new TimeToBuildMetricDescription(),
                new TimeToCollectMetricDescription(),
                new DurationMetricDescription(),
                new TaskCommitTimeMetricDescription(),
                new NumberOfWrittenFilesMetricDescription(),
                new JobCommitTimeMetricDescription(),
                new NumberOfDynamicPartMetricDescription(),
                new WrittenOutputMetricDescription(),
                new NumberOfInputBatchesMetricDescription(),
                new PartitionDataSizeMetricDescription(),
                new NumberOfFilesReadMetricDescription(),
                new ScanTimeMetricDescription(),
                new DynamicPartitionPruningTimeMetricDescription(),
                new MetadataTimeMetricDescription(),
                new SizeOfFilesReadMetricDescription(),
                new NumberOfOutputRowsMetricDescription(),
                new NumberOfPartitionsReadMetricDescription(),
                new NumberOfCoalescedPartitionsMetricDescription(),
                new TimeInAggregationBuildMetricDescription(),
                new NumberOfSortFallbackTasksMetricDescription(),
                new AvgHashProbeBucketListItersMetricDescription(),
                new LocalMergedChunksFetchedMetricDescription(),
                new RemoteMergedBytesReadMetricDescription(),
                new CorruptMergedBlockChunksMetricDescription(),
                new RemoteMergedReqsDurationMetricDescription(),
                new LocalMergedBlocksFetchedMetricDescription(),
                new RemoteMergedBlocksFetchedMetricDescription(),
                new MergedFetchFallbackCountMetricDescription(),
                new RemoteReqsDurationMetricDescription(),
                new RemoteMergedChunksFetchedMetricDescription(),
                new LocalMergedBytesReadMetricDescription()
        );
        registry.registers(descriptions);
    }
}
