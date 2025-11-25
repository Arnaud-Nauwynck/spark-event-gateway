import {MetricDescription} from './MetricDescription';
import {MetricDescriptionRegistry} from './MetricDescriptionRegistry';


export class ShuffleRecordsWrittenMetricDescription extends MetricDescription {
  constructor() {
    super('shuffle records written', 'sum', 'records');
  }
}

export class ShuffleWriteTimeMetricDescription extends MetricDescription {
  constructor() {
    super('shuffle write time', 'nsTiming', 'millis');
  }
}

export class RecordsReadMetricDescription extends MetricDescription {
  constructor() {
    super('records read', 'sum', 'records');
  }
}

export class LocalBytesReadMetricDescription extends MetricDescription {
  constructor() {
    super('local bytes read', 'size', 'bytes');
  }
}

export class RemoteBytesReadMetricDescription extends MetricDescription {
  constructor() {
    super('remote bytes read', 'size', 'bytes');
  }
}
export class RemoteBytesReadToDiskMetricDescription extends MetricDescription {
  constructor() {
    super('remote bytes read to disk', 'size', 'bytes');
  }
}

export class LocalBlocksReadMetricDescription extends MetricDescription {
  constructor() {
    super('local blocks read', 'sum', 'blocks');
  }
}
export class RemoteBlocksReadMetricDescription extends MetricDescription {
  constructor() {
    super('remote blocks read', 'sum', 'blocks');
  }
}


export class FetchWaitTimeMetricDescription extends MetricDescription {
  constructor() {
    super('fetch wait time', 'timing', 'millis');
  }
}


export class DataSizeMetricDescription extends MetricDescription {
  constructor() {
    super('data size', 'size', 'bytes');
  }
}

export class NumberOfPartitionsMetricDescription extends MetricDescription {
  constructor() {
    super('number of partitions', 'sum', 'partitions');
  }
}

export class ShuffleBytesWrittenMetricDescription extends MetricDescription {
  constructor() {
    super('shuffle bytes written', 'size', 'bytes');
  }
}

export class SortTimeMetricDescription extends MetricDescription {
  constructor() {
    super('sort time', 'timing', 'millis');
  }
}

export class PeakMemoryMetricDescription extends MetricDescription {
  constructor() {
    super('peak memory', 'size', 'bytes');
  }
}

export class SpillSizeMetricDescription extends MetricDescription {
  constructor() {
    super('spill size', 'size', 'bytes');
  }
}

export class TimeToBroadcastMetricDescription extends MetricDescription {
  constructor() {
    super('time to broadcast', 'timing', 'millis');
  }
}

export class TimeToBuildMetricDescription extends MetricDescription {
  constructor() {
    super('time to build', 'timing', 'millis');
  }
}

export class TimeToCollectMetricDescription extends MetricDescription {
  constructor() {
    super('time to collect', 'timing', 'millis');
  }
}

export class DurationMetricDescription extends MetricDescription {
  constructor() {
    super('duration', 'timing', 'millis');
  }
}

export class TaskCommitTimeMetricDescription extends MetricDescription {
  constructor() {
    super('task commit time', 'timing', 'millis');
  }
}

export class NumberOfWrittenFilesMetricDescription extends MetricDescription {
  constructor() {
    super('number of written files', 'sum', 'files');
  }
}

export class JobCommitTimeMetricDescription extends MetricDescription {
  constructor() {
    super('job commit time', 'timing', 'millis');
  }
}

export class NumberOfDynamicPartMetricDescription extends MetricDescription {
  constructor() {
    super('number of dynamic part', 'sum', 'partitions');
  }
}

export class WrittenOutputMetricDescription extends MetricDescription {
  constructor() {
    super('written output', 'size', 'bytes');
  }
}

export class NumberOfInputBatchesMetricDescription extends MetricDescription {
  constructor() {
    super('number of input batches', 'sum', 'batches');
  }
}

export class PartitionDataSizeMetricDescription extends MetricDescription {
  constructor() {
    super('partition data size', 'size', 'bytes');
  }
}

export class NumberOfFilesReadMetricDescription extends MetricDescription {
  constructor() {
    super('number of files read', 'sum', 'files');
  }
}

export class ScanTimeMetricDescription extends MetricDescription {
  constructor() {
    super('scan time', 'timing', 'millis');
  }
}

export class DynamicPartitionPruningTimeMetricDescription extends MetricDescription {
  constructor() {
    super('dynamic partition pruning time', 'timing', 'millis');
  }
}

export class MetadataTimeMetricDescription extends MetricDescription {
  constructor() {
    super('metadata time', 'timing', 'millis');
  }
}

export class SizeOfFilesReadMetricDescription extends MetricDescription {
  constructor() {
    super('size of files read', 'size', 'bytes');
  }
}

export class NumberOfOutputRowsMetricDescription extends MetricDescription {
  constructor() {
    super('number of output rows', 'sum', 'records');
  }
}

export class NumberOfPartitionsReadMetricDescription extends MetricDescription {
  constructor() {
    super('number of partitions read', 'sum', 'partitions');
  }
}

export class NumberOfCoalescedPartitionsMetricDescription extends MetricDescription {
  constructor() {
    super('number of coalesced partitions', 'sum', 'partitions');
  }
}
// -----------------------------------------------------------------------------------------------------------------

export function registerStdMetricDescriptions(registry: MetricDescriptionRegistry) {
  registry.registers([
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

  ]);
}


