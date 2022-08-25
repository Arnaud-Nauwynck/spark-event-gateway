
/**
 * 
 */
export class InputMetrics {
  // @JsonProperty("Bytes Read")
  bytesRead: number;

  // @JsonProperty("Records Read")
  recordsRead: number;

  constructor( bytesRead: number, recordsRead: number ) {
    this.bytesRead = bytesRead;
    this.recordsRead = recordsRead;
  }

  static fromJson( src: any ): InputMetrics {
    let bytesRead = <number>src['Bytes read'];
    let recordsRead = <number>src['Records Read'];
    return new InputMetrics( bytesRead, recordsRead );
  }

  static createDefault(): InputMetrics {
    return new InputMetrics(0, 0);
  }

}

/**
 * 
 */
export class OutputMetrics {
  // @JsonProperty("Bytes Written")
  bytesWritten: number;

  // @JsonProperty("Records Written")
  recordsWritten: number;

  constructor( bytesWritten: number, recordsWritten: number ) {
    this.bytesWritten = bytesWritten;
    this.recordsWritten = recordsWritten;
  }

  static fromJson( src: any ): OutputMetrics {
    let bytesWritten = <number>src['Bytes Written'];
    let recordsWritten = <number>src['Records Written'];
    return new OutputMetrics( bytesWritten, recordsWritten );
  }

  static createDefault(): OutputMetrics {
    return new OutputMetrics(0, 0);
  }

}



/* 
 *
 */
export class ShuffleReadMetrics {
  // "Remote Blocks Fetched"
  remoteBlocksFetched: number;
  // "Local Blocks Fetched"
  localBlocksFetched: number;
  // "Fetch Wait Time"
  fetchWaitTime: number;
  // "Remote Bytes Read"
  remoteBytesRead: number;
  // "Remote Bytes Read To Disk"
  remoteBytesReadToDisk: number;
  // "Local Bytes Read"
  localBytesRead: number;
  // "Total Records Read"
  totalRecordsRead: number;

  constructor( remoteBlocksFetched: number, localBlocksFetched: number, fetchWaitTime: number,
    remoteBytesRead: number, remoteBytesReadToDisk: number, localBytesRead: number, totalRecordsRead: number ) {
    this.remoteBlocksFetched = remoteBlocksFetched;
    this.localBlocksFetched = localBlocksFetched;
    this.fetchWaitTime = fetchWaitTime;
    this.remoteBytesRead = remoteBytesRead;
    this.remoteBytesReadToDisk = remoteBytesReadToDisk;
    this.localBytesRead = localBytesRead;
    this.totalRecordsRead = totalRecordsRead;
  }

  static fromJson( src: any ): ShuffleReadMetrics {
    let remoteBlocksFetched = <number>src['Remote Blocks Fetched'];
    let localBlocksFetched = <number>src['Local Blocks Fetched'];
    let fetchWaitTime = <number>src['Fetch Wait Time'];
    let remoteBytesRead = <number>src['Remote Bytes Read'];
    let remoteBytesReadToDisk = <number>src['Remote Bytes Read To Disk'];
    let localBytesRead = <number>src['Local Bytes Read'];
    let totalRecordsRead = <number>src['Total Records Read'];
    return new ShuffleReadMetrics( remoteBlocksFetched, localBlocksFetched, fetchWaitTime, remoteBytesRead,
      remoteBytesReadToDisk, localBytesRead, totalRecordsRead );
  }

  static createDefault(): ShuffleReadMetrics {
    return new ShuffleReadMetrics(0, 0, 0, 0, 0, 0, 0);
  }
}


/**
 * 
 */
export class ShuffleWriteMetrics {

  //@JsonProperty("Shuffle Bytes Written")
  shuffleBytesWritten: number;

  //@JsonProperty("Shuffle Write Time")
  shuffleWriteTime: number;

  // @JsonProperty("Shuffle Records Written")
  shuffleRecordsWritten: number;

  constructor( shuffleBytesWritten: number, shuffleWriteTime: number, shuffleRecordsWritten: number ) {
    this.shuffleBytesWritten = shuffleBytesWritten;
    this.shuffleWriteTime = shuffleWriteTime;
    this.shuffleRecordsWritten = shuffleRecordsWritten;
  }

  static fromJson( src: any ): ShuffleWriteMetrics {
    let shuffleBytesWritten = <number>src['Shuffle Bytes Written'];
    let shuffleWriteTime = <number>src['Shuffle Write Time'];
    let shuffleRecordsWritten = <number>src['Shuffle Records Written'];
    return new ShuffleWriteMetrics( shuffleBytesWritten, shuffleWriteTime, shuffleRecordsWritten );
  }

  static createDefault(): ShuffleWriteMetrics {
    return new ShuffleWriteMetrics(0, 0, 0);
  }

}

/**
 * 
 */
export class UpdatedBlock extends Map<String, String> {
  // TODO
  static fromJson( src: any ): UpdatedBlock {
    return new UpdatedBlock( Object.entries( src ) );
  }

  static fromJsonArray( src: any[] ): UpdatedBlock[] {
    return src.map( x => UpdatedBlock.fromJson( x ) );
  }

  static createDefault(): UpdatedBlock {
    return new UpdatedBlock();
  }

}


/**
 * 
 */
export class TaskMetrics {

  // @JsonProperty("Executor Deserialize Time")
  executorDeseralizeTime: number;

  // @JsonProperty("Executor Deserialize CPU Time")
  executorDeseralizeCpuTime: number;

  // @JsonProperty("Executor Run Time")
  executorRunTime: number;

  // @JsonProperty("Executor CPU Time")
  executorCpuTime: number;

  // @JsonProperty("Peak Execution Memory")
  peakExecutionMemory: number;

  // @JsonProperty("Result Size")
  resultSize: number;

  // @JsonProperty("JVM GC Time")
  jvmGCTime: number;

  // @JsonProperty("Result Serialization Time")
  resultSerializationTime: number;

  // @JsonProperty("Memory Bytes Spilled")
  memoryBytesSpilled: number;

  // @JsonProperty("Disk Bytes Spilled")
  diskBytesSpilled: number;

  // @JsonProperty("Shuffle Read Metrics")
  shuffleReadMetrics: ShuffleReadMetrics;

  // @JsonProperty("Shuffle Write Metrics")
  shuffleWriteMetrics: ShuffleWriteMetrics;

  // @JsonProperty("Input Metrics")
  inputMetrics: InputMetrics;

  // @JsonProperty("Output Metrics")
  outputMetrics: OutputMetrics;

  // @JsonProperty("Updated Blocks")
  updatedBlocks: UpdatedBlock[];

  constructor(
    executorDeseralizeTime: number,
    executorDeseralizeCpuTime: number,
    executorRunTime: number,
    executorCpuTime: number,
    peakExecutionMemory: number,
    resultSize: number,
    jvmGCTime: number,
    resultSerializationTime: number,
    memoryBytesSpilled: number,
    diskBytesSpilled: number,
    shuffleReadMetrics: ShuffleReadMetrics,
    shuffleWriteMetrics: ShuffleWriteMetrics,
    inputMetrics: InputMetrics,
    outputMetrics: OutputMetrics,
    updatedBlocks: UpdatedBlock[]
  ) {
    this.executorDeseralizeTime = executorDeseralizeTime;
    this.executorDeseralizeCpuTime = executorDeseralizeCpuTime;
    this.executorRunTime = executorRunTime;
    this.executorCpuTime = executorCpuTime;
    this.peakExecutionMemory = peakExecutionMemory;
    this.resultSize = resultSize;
    this.jvmGCTime = jvmGCTime;
    this.resultSerializationTime = resultSerializationTime;
    this.memoryBytesSpilled = memoryBytesSpilled;
    this.diskBytesSpilled = diskBytesSpilled;
    this.shuffleReadMetrics = shuffleReadMetrics;
    this.shuffleWriteMetrics = shuffleWriteMetrics;
    this.inputMetrics = inputMetrics;
    this.outputMetrics = outputMetrics;
    this.updatedBlocks = updatedBlocks;
  }

  static fromJson( src: any ): TaskMetrics {
    let executorDeseralizeTime = <number>src['Executor Deserialize Time'];
    let executorDeseralizeCpuTime = <number>src['Executor Deserialize CPU Time'];
    let executorRunTime = <number>src['Executor Run Time'];
    let executorCpuTime = <number>src['Executor CPU Time'];
    let peakExecutionMemory = <number>src['Peak Execution Memory'];
    let resultSize = <number>src['Result Size'];
    let jvmGCTime = <number>src['JVM GC Time'];
    let resultSerializationTime = <number>src['Result Serialization Time'];
    let memoryBytesSpilled = <number>src['Memory Bytes Spilled'];
    let diskBytesSpilled = <number>src['Disk Bytes Spilled'];
    let shuffleReadMetricsObj = src['Shuffle Read Metrics'];
    let shuffleReadMetrics = ( shuffleReadMetricsObj ) ? ShuffleReadMetrics.fromJson( shuffleReadMetricsObj ) : ShuffleReadMetrics.createDefault();
    let shuffleWriteMetricsObj = src['Shuffle Write Metrics'];
    let shuffleWriteMetrics = ( shuffleWriteMetricsObj ) ? ShuffleWriteMetrics.fromJson( shuffleWriteMetricsObj ) : ShuffleWriteMetrics.createDefault();
    let inputMetrics = InputMetrics.fromJson( src['Input Metrics'] );
    let outputMetrics = OutputMetrics.fromJson( src['Output Metrics'] );
    let updatedBlocks = UpdatedBlock.fromJsonArray( <any[]>src['Updated Blocks'] );

    return new TaskMetrics(executorDeseralizeTime,
      executorDeseralizeCpuTime,
      executorRunTime,
      executorCpuTime,
      peakExecutionMemory,
      resultSize,
      jvmGCTime,
      resultSerializationTime,
      memoryBytesSpilled,
      diskBytesSpilled,
      shuffleReadMetrics!!,
      shuffleWriteMetrics!!,
      inputMetrics,
      outputMetrics,
      updatedBlocks);
  }

  static createDefault(): TaskMetrics {
    let executorDeseralizeTime = 0;
    let executorDeseralizeCpuTime = 0;
    let executorRunTime = 0;
    let executorCpuTime = 0;
    let peakExecutionMemory = 0;
    let resultSize = 0;
    let jvmGCTime = 0;
    let resultSerializationTime = 0;
    let memoryBytesSpilled = 0;
    let diskBytesSpilled = 0;
    let shuffleReadMetrics = ShuffleReadMetrics.createDefault();
    let shuffleWriteMetrics = ShuffleWriteMetrics.createDefault();
    let inputMetrics = InputMetrics.createDefault();
    let outputMetrics = OutputMetrics.createDefault();
    let updatedBlocks: UpdatedBlock[] = [];
    return new TaskMetrics(executorDeseralizeTime,
        executorDeseralizeCpuTime,
        executorRunTime,
        executorCpuTime,
        peakExecutionMemory,
        resultSize,
        jvmGCTime,
        resultSerializationTime,
        memoryBytesSpilled,
        diskBytesSpilled,
        shuffleReadMetrics,
        shuffleWriteMetrics,
        inputMetrics,
        outputMetrics,
        updatedBlocks);
  }
}
