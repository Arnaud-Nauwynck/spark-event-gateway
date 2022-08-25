import { StageInfo } from './StageInfo';
import { TaskInfo } from './TaskInfo';
import { TaskEndReason } from './TaskEndReason';
import { ExecutorMetrics } from './ExecutorMetrics';
import { TaskMetrics } from './TaskMetrics';
import { JobResult } from './JobResult';
import { BlockUpdatedInfo } from './BlockUpdatedInfo';
import { BlockManagerId } from './BlockManagerId';
import { ExecutorInfo } from './ExecutorInfo';
import { AccumulableInfo } from './AccumulableInfo';
import { SparkPlanInfo } from './SparkPlanInfo';
import { SQLPlanMetric } from './SQLPlanMetric';

/**
 * 
 */
export abstract class SparkEvent {

  get Event(): string {
    return this.getEvent();
  }
  get eventShortname(): string {
    return this.getEventShortName();
  }
  get displaySummary(): string {
    return this.getDisplaySummary();
  }

  get timeOpt(): Date|undefined { return this.getTime(); }
  get jobIdOpt(): number|undefined { return this.getJobId(); }
  get stageIdOpt(): number|undefined { return this.getStageId(); }
  get stageAttemptIdOpt(): number|undefined { return this.getStageAttemptId(); }
  get taskIdOpt(): number|undefined { return this.getTaskId(); }
  get taskAttemptIdOpt(): number|undefined { return this.getTaskAttemptId(); }
  get executorIdOpt(): number|undefined { return this.getExecutorId(); }
  get sqlExecIdOpt(): number|undefined { return this.getSQLExecId(); }
  
  constructor() {
  }

  static fromAnyJson( src: any ): SparkEvent {
    let eventType = src["Event"];
    switch ( eventType ) {
      case 'SparkListenerStageSubmitted': return SparkListenerStageSubmitted.fromJson( src );
      case 'SparkListenerStageCompleted': return SparkListenerStageCompleted.fromJson( src );
      case 'SparkListenerTaskStart': return SparkListenerTaskStart.fromJson( src );
      case 'SparkListenerTaskGettingResult': return SparkListenerTaskGettingResult.fromJson( src );
      case 'SparkListenerSpeculativeTaskSubmitted': return SparkListenerSpeculativeTaskSubmitted.fromJson( src );
      case 'SparkListenerTaskEnd': return SparkListenerTaskEnd.fromJson( src );
      case 'SparkListenerJobStart': return SparkListenerJobStart.fromJson( src );
      case 'SparkListenerJobEnd': return SparkListenerJobEnd.fromJson( src );
      case 'SparkListenerEnvironmentUpdate': return SparkListenerEnvironmentUpdate.fromJson( src );
      case 'SparkListenerBlockManagerAdded': return SparkListenerBlockManagerAdded.fromJson( src );
      case 'SparkListenerBlockManagerRemoved': return SparkListenerBlockManagerRemoved.fromJson( src );
      case 'SparkListenerUnpersistRDD': return SparkListenerUnpersistRDD.fromJson( src );
      case 'SparkListenerExecutorAdded': return SparkListenerExecutorAdded.fromJson( src );
      case 'SparkListenerExecutorRemoved': return SparkListenerExecutorRemoved.fromJson( src );
      case 'SparkListenerExecutorBlacklisted': return SparkListenerExecutorBlacklisted.fromJson( src );
      case 'SparkListenerExecutorExcluded': return SparkListenerExecutorExcluded.fromJson( src );
      case 'SparkListenerExecutorBlacklistedForStage': return SparkListenerExecutorBlacklistedForStage.fromJson( src );
      case 'SparkListenerExecutorExcludedForStage': return SparkListenerExecutorExcludedForStage.fromJson( src );
      case 'SparkListenerNodeBlacklistedForStage': return SparkListenerNodeBlacklistedForStage.fromJson( src );
      case 'SparkListenerNodeExcludedForStage': return SparkListenerNodeExcludedForStage.fromJson( src );
      case 'SparkListenerExecutorUnblacklisted': return SparkListenerExecutorUnblacklisted.fromJson( src );
      case 'SparkListenerExecutorUnexcluded': return SparkListenerExecutorUnexcluded.fromJson( src );
      case 'SparkListenerNodeBlacklisted': return SparkListenerNodeBlacklisted.fromJson( src );
      case 'SparkListenerNodeExcluded': return SparkListenerNodeExcluded.fromJson( src );
      case 'SparkListenerNodeUnblacklisted': return SparkListenerNodeUnblacklisted.fromJson( src );
      case 'SparkListenerNodeUnexcluded': return SparkListenerNodeUnexcluded.fromJson( src );
      case 'SparkListenerUnschedulableTaskSetAdded': return SparkListenerUnschedulableTaskSetAdded.fromJson( src );
      case 'SparkListenerUnschedulableTaskSetRemoved': return SparkListenerUnschedulableTaskSetRemoved.fromJson( src );
      case 'SparkListenerBlockUpdated': return SparkListenerBlockUpdated.fromJson( src );
      case 'SparkListenerExecutorMetricsUpdate': return SparkListenerExecutorMetricsUpdate.fromJson( src );
      case 'SparkListenerStageExecutorMetrics': return SparkListenerStageExecutorMetrics.fromJson( src );
      case 'SparkListenerApplicationStart': return SparkListenerApplicationStart.fromJson( src );
      case 'SparkListenerApplicationEnd': return SparkListenerApplicationEnd.fromJson( src );
      case 'SparkListenerLogStart': return SparkListenerLogStart.fromJson( src );
      case 'SparkListenerResourceProfileAdded': return SparkListenerResourceProfileAdded.fromJson( src );
      // --------------------------------------------------------------------------------------------
      case 'org.apache.spark.sql.execution.ui.SparkListenerSQLAdaptiveExecutionUpdate': return SparkListenerSQLAdaptiveExecutionUpdate.fromJson( src );
      case 'org.apache.spark.sql.execution.ui.SparkListenerSQLAdaptiveSQLMetricUpdates': return SparkListenerSQLAdaptiveSQLMetricUpdates.fromJson( src );
      case 'org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionStart': return SparkListenerSQLExecutionStart.fromJson( src );
      case 'org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionEnd': return SparkListenerSQLExecutionEnd.fromJson( src );
      case 'org.apache.spark.sql.execution.ui.SparkListenerDriverAccumUpdates': return SparkListenerDriverAccumUpdates.fromJson( src );
      default: throw ( 'unrecognized Event type:' + eventType );
    }
  }

  static fromAnyJsonArray(src: any[]): SparkEvent[] {
      return src.map(x => SparkEvent.fromAnyJson(x));
  }


  abstract getEvent(): string;
  abstract getEventShortName(): string;

  getDisplaySummary(): string { return ''; }

  getTime(): Date|undefined { return undefined; }

  getJobId(): number|undefined { return undefined; }
  getStageId(): number|undefined { return undefined; }
  getStageAttemptId(): number|undefined { return undefined; }
  getTaskId(): number|undefined { return undefined; }
  getTaskAttemptId(): number|undefined { return undefined; }
  getExecutorId(): number|undefined { return undefined; }
  getSQLExecId(): number|undefined { return undefined; }

}

// --------------------------------------------------------------------------

export type Properties = Map<string, any>;

export class SparkListenerStageSubmitted extends SparkEvent {
  
  // @JsonProperty("Stage Info")
  readonly stageInfo: StageInfo;

  // @JsonProperty("Properties")
  readonly properties: Properties | null;

  constructor( stageInfo: StageInfo, properties: Properties | null ) {
    super();
    this.stageInfo = stageInfo;
    this.properties = properties;
  }

  static fromJson( src: any ): SparkListenerStageSubmitted {
    let stageInfo = StageInfo.fromJson( src['Stage Info'] );
    let propertiesObj = src['Properties'];
    let properties = ( propertiesObj ) ? new Map( Object.entries( propertiesObj ) ) : null;
    return new SparkListenerStageSubmitted( stageInfo, properties );
  }

  getEvent(): string { return 'SparkListenerStageSubmitted'; }
  getEventShortName(): string { return 'Stage Submitted'; }

  override getDisplaySummary(): string {
    return 'stageInfo:{ ' + this.stageInfo.getDisplaySummary() + ' }'; 
  }

  override getStageId(): number|undefined { return this.stageInfo.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageInfo.attemptId; }
}

/**
 * 
 */
export class SparkListenerStageCompleted extends SparkEvent {
  // @JsonProperty("Stage Info")
  readonly stageInfo: StageInfo;

  getEvent(): string { return 'SparkListenerStageCompleted'; }
  getEventShortName(): string { return 'Stage Completed'; }

  constructor( stageInfo: StageInfo ) {
    super();
    this.stageInfo = stageInfo;
  }

  static fromJson( src: any ): SparkListenerStageCompleted {
    let stageInfo = StageInfo.fromJson( src['Stage Info'] );
    return new SparkListenerStageCompleted( stageInfo );
  }

  override getDisplaySummary(): string {
    return 'stageInfo:{ ' + this.stageInfo.getDisplaySummary() + ' }'; 
  }

  override getStageId(): number|undefined { return this.stageInfo.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageInfo.attemptId; }

}

/**
 * 
 */
export class SparkListenerTaskStart extends SparkEvent {
  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;

  // @JsonProperty("Task Info")
  readonly taskInfo: TaskInfo;

  constructor( stageId: number, stageAttemptId: number, taskInfo: TaskInfo ) {
    super();
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
    this.taskInfo = taskInfo;
  }

  static fromJson( src: any ): SparkListenerTaskStart {
    let stageId = <number>src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID'];
    let taskInfo = TaskInfo.fromJson( src['Task Info'] );
    return new SparkListenerTaskStart( stageId, stageAttemptId, taskInfo );
  }

  getEvent(): string { return 'SparkListenerTaskStart'; }
  getEventShortName(): string { return 'Task Start'; }

  override getDisplaySummary(): string {
    return 'stageId: ' + this.stageId 
      + ((this.stageAttemptId !== 0)? ' stageAttemptId:' + this.stageAttemptId : '')
      + ((this.taskInfo)? ' taskInfo:{ ' + this.taskInfo.getDisplaySummary() + ' }': ''); 
  }

  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }
  override getTaskId(): number|undefined { return this.taskInfo.taskId; }
  override getTaskAttemptId(): number|undefined { return this.taskInfo.attempt; }
  override getExecutorId(): number|undefined { return this.taskInfo.executorId; }

}

/**
 * 
 */
export class SparkListenerTaskGettingResult extends SparkEvent {
  // @JsonProperty("Task Info")
  taskInfo: TaskInfo;

  getEvent(): string { return 'SparkListenerTaskGettingResult'; }
  getEventShortName(): string { return 'TaskGettingResult'; }

  constructor( taskInfo: TaskInfo ) {
    super();
    this.taskInfo = taskInfo;
  }

  static fromJson( src: any ): SparkListenerTaskGettingResult {
    let taskInfo = TaskInfo.fromJson( src['Task Info'] );
    return new SparkListenerTaskGettingResult( taskInfo );
  }

  override getDisplaySummary(): string {
    return ((this.taskInfo)? ' taskInfo:{ ' + this.taskInfo.getDisplaySummary() + ' }': ''); 
  }

//  override getStageId(): number|undefined { return this.taskInfo.; }
//  override getStageAttemptId(): number|undefined { return this.taskInfo.; }
  override getTaskId(): number|undefined { return this.taskInfo.taskId; }
  override getTaskAttemptId(): number|undefined { return this.taskInfo.attempt; }
  override getExecutorId(): number|undefined { return this.taskInfo.executorId; }

}

/**
 * 
 */
export class SparkListenerSpeculativeTaskSubmitted extends SparkEvent {
  
  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;

  getEvent(): string { return 'SparkListenerSpeculativeTaskSubmitted'; }
  getEventShortName(): string { return 'SpeculativeTaskSubmitted'; }

  constructor( stageId: number, stageAttemptId: number ) {
    super();
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( src: any ): SparkListenerSpeculativeTaskSubmitted {
    let stageId = <number>src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID'];
    return new SparkListenerSpeculativeTaskSubmitted( stageId, stageAttemptId );
  }

  override getDisplaySummary(): string {
    return ' stageId: ' + this.stageId 
      + ((this.stageAttemptId !== 0)? ' stageAttemptId:' + this.stageAttemptId : '')
      ;
  }

  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }

}

/**
 * 
 */
export class SparkListenerTaskEnd extends SparkEvent {
  // @JsonProperty("Stage ID")
  stageId: number;

  // @JsonProperty("Stage Attempt ID")
  stageAttemptId: number;

  // @JsonProperty("Task Type")
  taskType: string;

  // @JsonProperty("Task End Reason")
  reason: TaskEndReason;

  // @JsonProperty("Task Info")
  taskInfo: TaskInfo;

  // @JsonProperty("Task Executor Metrics")
  taskExecutorMetrics: ExecutorMetrics;

  // may be null if the task has failed
  // @JsonProperty("Task Metrics")
  taskMetrics: TaskMetrics | null;

  // @JsonProperty("Metadata")
  metadata: Map<string, any> | null;

  constructor( stageId: number, stageAttemptId: number,
    taskType: string,
    reason: TaskEndReason,
    taskInfo: TaskInfo,
    taskExecutorMetrics: ExecutorMetrics,
    taskMetrics: TaskMetrics | null,
    metadata: Map<string, any> | null
  ) {
    super();
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
    this.taskType = taskType;
    this.reason = reason;
    this.taskInfo = taskInfo;
    this.taskExecutorMetrics = taskExecutorMetrics;
    this.taskMetrics = taskMetrics;
    this.metadata = metadata;
  }

  static fromJson( src: any ): SparkListenerTaskEnd {
    let stageId = <number>src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID'];
    let taskType = <string>src['Task Type'];
    let tmpReason = src['Task End Reason'];
    let reason = ( tmpReason ) ? TaskEndReason.fromJson( tmpReason ) : TaskEndReason.createDefault();
    let taskInfo = TaskInfo.fromJson( src['Task Info'] );
    let taskExecutorMetrics = ExecutorMetrics.fromJson( src['Task Executor Metrics'] );
    let taskMetricsObj = src['Task Metrics'];
    let taskMetrics = ( taskMetricsObj ) ? TaskMetrics.fromJson( taskMetricsObj ) : null;
    let metadataObj = src['Metadata'];
    let metadata: Map<string, any> | null = ( metadataObj ) ? new Map( Object.entries( metadataObj ) ) : null;
    return new SparkListenerTaskEnd( stageId, stageAttemptId, taskType, reason, taskInfo, taskExecutorMetrics, taskMetrics, metadata );
  }

  getEvent(): string { return 'SparkListenerTaskEnd'; }
  getEventShortName(): string { return 'TaskEnd'; }

  override getDisplaySummary(): string {
    return ' stageId: ' + this.stageId
      + ((this.stageAttemptId !== 0)? ' stageAttemptId:' + this.stageAttemptId : '')
      + ' taskType:' + this.taskType
      + ((this.reason)? ' endReason:' + this.reason : '')
      + ((this.taskInfo)? ' taskInfo:{ ' + this.taskInfo.getDisplaySummary() + ' }': '')
      // TOADD
//    taskExecutorMetrics: ExecutorMetrics;
//    taskMetrics: TaskMetrics | null;
//    metadata: Map<string, any> | null;  
    ;
  }

  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }
  override getTaskId(): number|undefined { return this.taskInfo.taskId; }
  override getTaskAttemptId(): number|undefined { return this.taskInfo.attempt; }
  override getExecutorId(): number|undefined { return this.taskInfo.executorId; }

}

/**
 *
 */
export class SparkListenerJobStart extends SparkEvent {

  // @JsonProperty("Job ID")
  readonly jobId: number;

  // @JsonProperty("Submission Time")
  readonly time: Date;

  // @JsonProperty("Stage Infos")
  stageInfos: StageInfo[];

  // @JsonProperty("Stage IDs")
  stageIds: number[]; // redundant with stageInfos

  // @JsonProperty("Properties")
  properties: Properties;

  constructor( jobId: number, time: Date, stageInfos: StageInfo[], stageIds: number[], properties: Properties ) {
    super();
    this.jobId = jobId;
    this.time = time;
    this.stageInfos = stageInfos;
    this.stageIds = stageIds;
    this.properties = properties;
  }

  static fromJson( src: any ): SparkListenerJobStart {
    let jobId = <number>src['Job ID'];
    let timeObj = <number>src['Submission Time'];
    let time = ( timeObj ) ? new Date( timeObj ) : new Date();
    let stageInfosObj = src['Stage Infos'];
    let stageInfos = ( stageInfosObj ) ? StageInfo.fromJsonArray( stageInfosObj ) : [];
    let stageIds = <number[]>src['Stage IDs'];
    let propertiesObj = src['Properties'];
    let properties = ( propertiesObj ) ? new Map( Object.entries( propertiesObj ) ) : new Map();
    return new SparkListenerJobStart( jobId, time, stageInfos, stageIds, properties );
  }

  getEvent(): string { return 'SparkListenerJobStart'; }
  getEventShortName(): string { return 'JobStart'; }

  override getDisplaySummary(): string {
    var res = 'jobId:' + this.jobId;
      ' time:' + this.time;
      // TOADD
//    stageIds: number[]; // redundant with stageInfos
//    stageInfos: StageInfo[];
//    properties: Properties;';
    return res;
  }
  
  override getTime(): Date|undefined { return this.time; }

  override getJobId(): number|undefined { return this.jobId; }
  
}

/**
 *
 */
export class SparkListenerJobEnd extends SparkEvent {
  // @JsonProperty("Job ID")
  jobId: number;

  // @JsonProperty("Completion Time")
  time: Date;

  // @JsonProperty("Job Result")
  jobResult: JobResult;

  constructor( jobId: number, time: Date, jobResult: JobResult ) {
    super();
    this.jobId = jobId;
    this.time = time;
    this.jobResult = jobResult;
  }

  static fromJson( src: any ): SparkListenerJobEnd {
    let jobId = <number>src['Job ID'];
    let timeObj = <number>src['Submission Time'];
    let time = ( timeObj ) ? new Date( timeObj ) : new Date();
    let jobResultObj = src['Job Result'];
    let jobResult = ( jobResultObj ) ? JobResult.fromJson( jobResultObj ) : JobResult.createDefault();
    return new SparkListenerJobEnd( jobId, time, jobResult );
  }

  getEvent(): string { return 'SparkListenerJobEnd'; }
  getEventShortName(): string { return 'JobEnd'; }
  
  override getDisplaySummary(): string {
    var res = 'jobId:' + this.jobId;
      ' time:' + this.time
      ' jobResult:' + this.jobResult.getDisplaySummary()
      ;
    return res;
  }

  override getTime(): Date|undefined { return this.time; }
  override getJobId(): number|undefined { return this.jobId; }

}

/**
*
*/
export class SparkListenerEnvironmentUpdate extends SparkEvent {

  // @JsonProperty("JVM Information")
  readonly jvmInformation: Map<string, string>;

  // @JsonProperty("Spark Properties")
  readonly sparkProperties: Map<string, string>;

  // @JsonProperty("Hadoop Properties")
  readonly hadoopProperties: Map<string, string>;

  // @JsonProperty("System Properties")
  readonly systemProperties: Map<string, string>;

  // @JsonProperty("Classpath Entries")
  readonly classpathEntries: Map<string, string>;

  constructor(
    jvmInformation: Map<string, string>,
    sparkProperties: Map<string, string>,
    hadoopProperties: Map<string, string>,
    systemProperties: Map<string, string>,
    classpathEntries: Map<string, string>
  ) {
    super();
    this.jvmInformation = jvmInformation;
    this.sparkProperties = sparkProperties;
    this.hadoopProperties = hadoopProperties;
    this.systemProperties = systemProperties;
    this.classpathEntries = classpathEntries;
  }

  static fromJson( src: any ): SparkListenerEnvironmentUpdate {
    let jvmInformationObj = src['JVM Information'];
    let jvmInformation = ( jvmInformationObj ) ? new Map( Object.entries( jvmInformationObj ) ) : new Map();
    let sparkPropertiesObj = src['Spark Properties'];
    let sparkProperties = ( sparkPropertiesObj ) ? new Map( Object.entries( sparkPropertiesObj ) ) : new Map();
    let hadoopPropertiesObj = src['Hadoop Properties'];
    let hadoopProperties = ( hadoopPropertiesObj ) ? new Map( Object.entries( hadoopPropertiesObj ) ) : new Map();
    let systemPropertiesObj = src['System Properties'];
    let systemProperties = ( systemPropertiesObj ) ? new Map( Object.entries( systemPropertiesObj ) ) : new Map();
    let classpathEntriesObj = src['Classpath Entries'];
    let classpathEntries = ( classpathEntriesObj ) ? new Map( Object.entries( classpathEntriesObj ) ) : new Map();
    return new SparkListenerEnvironmentUpdate( jvmInformation, sparkProperties, hadoopProperties, systemProperties, classpathEntries );
  }

  getEvent(): string { return 'SparkListenerEnvironmentUpdate'; }
  getEventShortName(): string { return 'EnvironmentUpdate'; }
}

/**
*
*/

export class SparkListenerBlockManagerAdded extends SparkEvent {
  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Block Manager ID")
  readonly blockManagerId: BlockManagerId;

  // @JsonProperty("Maximum Memory")
  readonly maxMem: number;

  // @JsonProperty("Maximum Onheap Memory")
  readonly maxOnHeapMem: number|null;

  // @JsonProperty("Maximum Offheap Memory")
  readonly maxOffHeapMem: number|null;

  constructor(time: Date,
    blockManagerId: BlockManagerId,
    maxMem: number,
    maxOnHeapMem: number|null,
    maxOffHeapMem: number|null
    ) {
    super();
    this.time = time;
    this.blockManagerId = blockManagerId;
    this.maxMem = maxMem;
    this.maxOnHeapMem = maxOnHeapMem;
    this.maxOffHeapMem = maxOffHeapMem;
  }

  static fromJson( src: any ): SparkListenerBlockManagerAdded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let blockManagerIdObj = src['Block Manager ID']
    let blockManagerId = (blockManagerIdObj)? BlockManagerId.fromJson(blockManagerIdObj) : BlockManagerId.createDefault();
    let maxMem = <number> src['Maximum Memory'];
    let maxOnHeapMem = <number> src['Maximum Onheap Memory'];
    let maxOffHeapMem = <number> src['Maximum Offheap Memory'];
    return new SparkListenerBlockManagerAdded(time, blockManagerId, maxMem, maxOnHeapMem, maxOffHeapMem);
  }

  getEvent(): string { return 'SparkListenerBlockManagerAdded'; }
  getEventShortName(): string { return 'BlockManagerAdded'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
*
*/
export class SparkListenerBlockManagerRemoved extends SparkEvent {
  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Block Manager ID")
  readonly blockManagerId: BlockManagerId;

  // @JsonProperty("Maximum Memory")
  readonly maxMem: number

  constructor(time: Date,
      blockManagerId: BlockManagerId,
      maxMem: number) {
    super();
    this.time = time;
    this.blockManagerId = blockManagerId;
    this.maxMem = maxMem;
  }

  static fromJson( src: any ): SparkListenerBlockManagerRemoved {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let blockManagerIdObj = src['Block Manager ID']
    let blockManagerId = (blockManagerIdObj)? BlockManagerId.fromJson(blockManagerIdObj) : BlockManagerId.createDefault();
    let maxMem = <number> src['Maximum Memory'];
    return new SparkListenerBlockManagerRemoved(time, blockManagerId, maxMem);
  }

  getEvent(): string { return 'SparkListenerBlockManagerRemoved'; }
  getEventShortName(): string { return 'BlockManagerRemoved'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 *
 */
export class SparkListenerUnpersistRDD extends SparkEvent {
  // @JsonProperty("RDD ID")
  readonly rddId: number;

  constructor(rddId: number) {
    super();
    this.rddId = rddId;
  }

  static fromJson( src: any ): SparkListenerUnpersistRDD {
    let rddId = <number> src['RDD ID'];
    return new SparkListenerUnpersistRDD(rddId);
  }

  getEvent(): string { return 'SparkListenerUnpersistRDD'; }
  getEventShortName(): string { return 'Unpersist RDD'; }

}

/**
 *
 */
export class SparkListenerExecutorAdded extends SparkEvent {
  // @JsonProperty("Timestamp")
  time: Date;

  // @JsonProperty("Executor ID")
  executorId: number;

  // @JsonProperty("Executor Info")
  executorInfo: ExecutorInfo;

  constructor(time: Date, executorId: number, executorInfo: ExecutorInfo) {
    super();
    this.time = time;
    this.executorId = executorId;
    this.executorInfo = executorInfo;
  }

  static fromJson( src: any ): SparkListenerExecutorAdded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <number> src['Executor ID'];
    let executorInfoObj = src['Executor Info'];
    let executorInfo = (executorInfoObj)? ExecutorInfo.fromJson(executorInfoObj) : ExecutorInfo.createDefault();
    return new SparkListenerExecutorAdded(time, executorId, executorInfo);
  }

  getEvent(): string { return 'SparkListenerExecutorAdded'; }
  getEventShortName(): string { return 'ExecutorAdded'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 *
 */
export class SparkListenerExecutorRemoved extends SparkEvent {
  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: number;
        
  readonly reason: string;

  constructor(time: Date, executorId: number, reason: string) {
    super();
    this.time = time;
    this.executorId = executorId;
    this.reason = reason;
  }

  static fromJson( src: any ): SparkListenerExecutorRemoved {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <number> src['Executor ID'];
    let reason = <string> src['Reason'];
    return new SparkListenerExecutorRemoved(time, executorId, reason);
  }

  getEvent(): string { return 'SparkListenerExecutorRemoved'; }
  getEventShortName(): string { return 'ExecutorRemoved'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * @Deprecated("use SparkListenerExecutorExcluded instead", "3.1.0")
 */
export class SparkListenerExecutorBlacklisted extends SparkEvent {
  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: number;

  readonly taskFailures: number;

  constructor(time: Date, executorId: number, taskFailures: number) {
    super();
    this.time = time;
    this.executorId = executorId;
    this.taskFailures = taskFailures;
  }

  static fromJson( src: any ): SparkListenerExecutorBlacklisted {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <number> src['Executor ID'];
    let taskFailures = <number> src['Task Failures'];
    return new SparkListenerExecutorBlacklisted(time, executorId, taskFailures);
  }

  getEvent(): string { return 'SparkListenerExecutorBlacklisted'; }
  getEventShortName(): string { return 'ExecutorBlacklisted'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * @Since("3.1.0")
 */
export class SparkListenerExecutorExcluded extends SparkEvent {

  //@JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: number;

  readonly taskFailures: number;

  constructor(time: Date, executorId: number, taskFailures: number) {
    super();
    this.time = time;
    this.executorId = executorId;
    this.taskFailures = taskFailures;
  }

  static fromJson( src: any ): SparkListenerExecutorExcluded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <number> src['Executor ID'];
    let taskFailures = <number> src['Task Failures'];
    return new SparkListenerExecutorExcluded(time, executorId, taskFailures);
  }

  getEvent(): string { return 'SparkListenerExecutorExcluded'; }
  getEventShortName(): string { return 'ExecutorExcluded'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * @Deprecated("use SparkListenerExecutorExcludedForStage instead", "3.1.0")
 */
export class SparkListenerExecutorBlacklistedForStage extends SparkEvent {
  // @JsonProperty("Timestamp")
  time: Date;

  // @JsonProperty("Executor ID")
  executorId: number;

  taskFailures: number;

  // @JsonProperty("Stage ID")
  stageId: number;

  // @JsonProperty("Stage Attempt ID")
  stageAttemptId: number;

  constructor(time: Date, executorId: number, taskFailures: number, stageId: number, stageAttemptId: number) {
    super();
    this.time = time;
    this.executorId = executorId;
    this.taskFailures = taskFailures;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( src: any ): SparkListenerExecutorBlacklistedForStage {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <number> src['Executor ID'];
    let taskFailures = <number> src['Task Failures'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID'];
    return new SparkListenerExecutorBlacklistedForStage(time, executorId, taskFailures, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerExecutorBlacklistedForStage'; }
  getEventShortName(): string { return 'ExecutorBlacklistedForStage'; }

  override getTime(): Date|undefined { return this.time; }
  override getExecutorId(): number|undefined { return this.executorId; }
  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }

}

/**
 * @Since("3.1.0")
 */
export class SparkListenerExecutorExcludedForStage extends SparkEvent {
  // @JsonProperty("Timestamp")
  time: Date;

  // @JsonProperty("Executor ID")
  executorId: number

  taskFailures: number;

  // @JsonProperty("Stage ID")
  stageId: number;

  // @JsonProperty("Stage Attempt ID")
  stageAttemptId: number;

  constructor(time: Date, executorId: number, taskFailures: number, stageId: number, stageAttemptId: number) {
    super();
    this.time = time;
    this.executorId = executorId;
    this.taskFailures = taskFailures;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( src: any ): SparkListenerExecutorExcludedForStage {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <number> src['Executor ID'];
    let taskFailures = <number> src['Task Failures'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID'];
    return new SparkListenerExecutorExcludedForStage(time, executorId, taskFailures, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerExecutorExcludedForStage'; }
  getEventShortName(): string { return 'ExecutorExcludedForStage'; }

  override getTime(): Date|undefined { return this.time; }
  override getExecutorId(): number|undefined { return this.executorId; }
  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }

}

/**
* @Deprecated("use SparkListenerNodeExcludedForStage instead", "3.1.0")
*/
export class SparkListenerNodeBlacklistedForStage extends SparkEvent {
  
  // @JsonProperty("Timestamp")
  readonly time: Date;

  readonly hostId: string;

  readonly executorFailures: number;

  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;

  constructor(time: Date, hostId: string, executorFailures: number, stageId: number, stageAttemptId: number) {
    super();
    this.time = time;
    this.hostId = hostId;
    this.executorFailures = executorFailures;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( src: any ): SparkListenerNodeBlacklistedForStage {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    let executorFailures = <number> src['Executor Failures'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID'];
    return new SparkListenerNodeBlacklistedForStage(time, hostId, executorFailures, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerNodeBlacklistedForStage'; }
  getEventShortName(): string { return 'NodeBlacklistedForStage'; }

  override getTime(): Date|undefined { return this.time; }
  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }
}

/**
 * @Since("3.1.0")
 */
export class SparkListenerNodeExcludedForStage extends SparkEvent {

  //@JsonProperty("Timestamp")
  readonly time: Date;

  readonly hostId: string;

  readonly executorFailures: number;

  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;

  constructor(time: Date, hostId: string, executorFailures: number, stageId: number, stageAttemptId: number) {
    super();
    this.time = time;
    this.hostId = hostId;
    this.executorFailures = executorFailures;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( src: any ): SparkListenerNodeExcludedForStage {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    let executorFailures = <number> src['Executor Failures'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID'];
    return new SparkListenerNodeExcludedForStage(time, hostId, executorFailures, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerNodeExcludedForStage'; }
  getEventShortName(): string { return 'NodeExcludedForStage'; }

  override getTime(): Date|undefined { return this.time; }
  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }

}

/**
 * @deprecated("use SparkListenerExecutorUnexcluded instead", "3.1.0")
 */
export class SparkListenerExecutorUnblacklisted extends SparkEvent {

  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: number;

  constructor(time: Date, executorId: number) {
    super();
    this.time = time;
    this.executorId = executorId;
  }
  
  static fromJson( src: any ): SparkListenerExecutorUnblacklisted {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <number> src['Executor ID'];
    return new SparkListenerExecutorUnblacklisted(time, executorId);
  }

  getEvent(): string { return 'SparkListenerExecutorUnblacklisted'; }
  getEventShortName(): string { return 'ExecutorUnblacklisted'; }

  override getTime(): Date|undefined { return this.time; }
  override getExecutorId(): number|undefined { return this.executorId; }

}

/**
 *
 */
export class SparkListenerExecutorUnexcluded extends SparkEvent {

  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: number;

  constructor(time: Date, executorId: number) {
    super();
    this.time = time;
    this.executorId = executorId;
  }
  
  static fromJson( src: any ): SparkListenerExecutorUnexcluded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <number> src['Executor ID'];
    return new SparkListenerExecutorUnexcluded(time, executorId);
  }

  getEvent(): string { return 'SparkListenerExecutorUnexcluded'; }
  getEventShortName(): string { return 'ExecutorUnexcluded'; }

  override getTime(): Date|undefined { return this.time; }
  override getExecutorId(): number|undefined { return this.executorId; }

}

/**
 * @Deprecated("use SparkListenerNodeExcluded instead", "3.1.0")
 */
export class SparkListenerNodeBlacklisted extends SparkEvent {

  // @JsonProperty("Timestamp")
  time: Date;

  hostId: string;

  executorFailures: number;

  constructor(time: Date, hostId: string, executorFailures: number) {
    super();
    this.time = time;
    this.hostId = hostId;
    this.executorFailures = executorFailures;
  }
  
  static fromJson( src: any ): SparkListenerNodeBlacklisted {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    let executorFailures = <number> src['Executor Failures'];
    return new SparkListenerNodeBlacklisted(time, hostId, executorFailures);
  }

  getEvent(): string { return 'SparkListenerNodeBlacklisted'; }
  getEventShortName(): string { return 'NodeBlacklisted'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * 
 */
// @Since("3.1.0")
export class SparkListenerNodeExcluded extends SparkEvent {

  // @JsonProperty("Timestamp")
  readonly time: Date;
  
  readonly hostId: string;

  readonly executorFailures: number;

  constructor(time: Date, hostId: string, executorFailures: number) {
    super();
    this.time = time;
    this.hostId = hostId;
    this.executorFailures = executorFailures;
  }
  
  static fromJson( src: any ): SparkListenerNodeExcluded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    let executorFailures = <number> src['Executor Failures'];
    return new SparkListenerNodeExcluded(time, hostId, executorFailures);
  }

  getEvent(): string { return 'SparkListenerNodeExcluded'; }
  getEventShortName(): string { return 'NodeExcluded'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * @deprecated("use SparkListenerNodeUnexcluded instead", "3.1.0")
 */
export class SparkListenerNodeUnblacklisted extends SparkEvent {

  // @JsonProperty("Timestamp")
  readonly time: Date;
        
  readonly hostId: string;
  
  constructor(time: Date, hostId: string) {
    super();
    this.time = time;
    this.hostId = hostId;
  }
  
  static fromJson( src: any ): SparkListenerNodeUnblacklisted {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    return new SparkListenerNodeUnblacklisted(time, hostId);
  }

  getEvent(): string { return 'SparkListenerNodeUnblacklisted'; }
  getEventShortName(): string { return 'NodeUnblacklisted'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * @Since("3.1.0")
 */
export class SparkListenerNodeUnexcluded extends SparkEvent {

  // @JsonProperty("Timestamp")
  time: Date;

  hostId: string;

  constructor(time: Date, hostId: string) {
    super();
    this.time = time;
    this.hostId = hostId;
  }
  
  static fromJson( src: any ): SparkListenerNodeUnexcluded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    return new SparkListenerNodeUnexcluded(time, hostId);
  }

  getEvent(): string { return 'SparkListenerNodeUnexcluded'; }
  getEventShortName(): string { return 'NodeUnexcluded'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * @Since("3.1.0")
 */
export class SparkListenerUnschedulableTaskSetAdded extends SparkEvent {

  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;

  constructor( stageId: number, stageAttemptId: number) {
    super();
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( src: any ): SparkListenerUnschedulableTaskSetAdded {
    let stageId = <number>src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID']
    return new SparkListenerUnschedulableTaskSetAdded(stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerUnschedulableTaskSetAdded'; }
  getEventShortName(): string { return 'UnschedulableTaskSetAdded'; }

}

/**
 * @Since("3.1.0")
 */
export class SparkListenerUnschedulableTaskSetRemoved extends SparkEvent {
  // @JsonProperty("Stage ID")
  stageId: number;

  // @JsonProperty("Stage Attempt ID")
  stageAttemptId: number;

  constructor( stageId: number, stageAttemptId: number) {
    super();
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }
  
  static fromJson( src: any ): SparkListenerUnschedulableTaskSetRemoved {
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID']
    return new SparkListenerUnschedulableTaskSetRemoved(stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerUnschedulableTaskSetRemoved'; }
  getEventShortName(): string { return 'UnschedulableTaskSetRemoved'; }

}

/**
 *
 */
export class SparkListenerBlockUpdated extends SparkEvent {
  
  readonly blockUpdatedInfo: BlockUpdatedInfo;

  constructor(blockUpdatedInfo: BlockUpdatedInfo) {
    super();
    this.blockUpdatedInfo = blockUpdatedInfo;
  }

  static fromJson( src: any ): SparkListenerBlockUpdated {
    let blockUpdatedInfoObj = src['Block Updated Info'];
    let blockUpdatedInfo = (blockUpdatedInfoObj)? BlockUpdatedInfo.fromJson(blockUpdatedInfoObj) : BlockUpdatedInfo.createDefault();
    return new SparkListenerBlockUpdated(blockUpdatedInfo);
  }

  getEvent(): string { return 'SparkListenerBlockUpdated'; }
  getEventShortName(): string { return 'BlockUpdated'; }

}

/**
 * 
 */
export class AccumUpdate {

  taskId: number

  // @JsonProperty("Stage ID")
  stageId: number;

  // @JsonProperty("Stage Attempt ID")
  stageAttemptId: number;

  accumUpdates: AccumulableInfo[];

  constructor(taskId: number,
      stageId: number,
      stageAttemptId: number,
      accumUpdates: AccumulableInfo[]) {
    this.taskId = taskId;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
    this.accumUpdates = accumUpdates;
  }

  static fromJson(src: any): AccumUpdate {
    let taskId = <number> src['Task ID'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID'];
    let accumUpdatesObj = src['AccumUpdates'];
    let accumUpdates = (accumUpdatesObj)? AccumulableInfo.fromJsonArray(accumUpdatesObj) : [];
    return new AccumUpdate(taskId, stageId, stageAttemptId, accumUpdates);
  }
  
  static fromJsonArray(src: any[]): AccumUpdate[] {
    return src.map(x => AccumUpdate.fromJson(x));
  }

}

/**
 * 
 */
export class SparkListenerExecutorMetricsUpdate extends SparkEvent {

  readonly execId: number;
  
  readonly accumUpdates: AccumUpdate[];
  
  // TODO ??? Map<Object/* (Int, Int) */, ExecutorMetrics> executorUpdates;
  readonly executorUpdates: ExecutorMetrics[];

  constructor(execId: number, accumUpdates: AccumUpdate[], executorUpdates: ExecutorMetrics[]) {
    super();
    this.execId = execId;
    this.accumUpdates = accumUpdates;
    this.executorUpdates = executorUpdates;
  }

  static fromJson( src: any ): SparkListenerExecutorMetricsUpdate {
    let execId = <number> src['Exec ID'];
    let accumUpdatesObj = src['Accum Update'];
    let accumUpdates = (accumUpdatesObj)? AccumUpdate.fromJsonArray(accumUpdatesObj): [];
    let executorUpdatesObj = src['Executor Updates'];
    let executorUpdates = (executorUpdatesObj)? ExecutorMetrics.fromJsonArray(executorUpdatesObj) : [];
    return new SparkListenerExecutorMetricsUpdate(execId, accumUpdates, executorUpdates);
  }

  getEvent(): string { return 'SparkListenerExecutorMetricsUpdate'; }
  getEventShortName(): string { return 'ExecutorMetricsUpdate'; }

}

/**
 * Peak metric values for the executor for the stage, written to the history log
 * at stage completion.
 */
export class SparkListenerStageExecutorMetrics extends SparkEvent {

  readonly execId: number;

  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;
        
  readonly executorMetrics: ExecutorMetrics;

  constructor(execId: number, stageId: number, stageAttemptId: number, executorMetrics: ExecutorMetrics) {
    super();
    this.execId = execId;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
    this.executorMetrics = executorMetrics;
  }

  static fromJson( src: any ): SparkListenerStageExecutorMetrics {
    let execId = <number> src['Exec ID'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID'];
    let executorMetricsObj = src['Executor Metrics'];
    let executorMetrics = (executorMetricsObj)? ExecutorMetrics.fromJson(executorMetricsObj) : ExecutorMetrics.createDefault(); 
    return new SparkListenerStageExecutorMetrics(execId, stageId, stageAttemptId, executorMetrics);
  }

  getEvent(): string { return 'SparkListenerStageExecutorMetrics'; }
  getEventShortName(): string { return 'StageExecutorMetrics'; }

}

/**
 * 
 */
export class SparkListenerApplicationStart extends SparkEvent {

  // @JsonProperty("App Name")
  readonly appName: string;

  // @JsonProperty("App ID")
  readonly appId: string|null;

  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("User")
  readonly sparkUser: string;

  // @JsonProperty("App Attempt ID")
  readonly appAttemptId: string|null;

  // @JsonProperty("Driver Logs")
  readonly driverLogs: Map<string,string>|null;

  // @JsonProperty("Driver Attributes")
  readonly driverAttributes: Map<string,string>|null;
  
  constructor(appName: string,
    appId: string|null,
    time: Date,
    sparkUser: string,
    appAttemptId: string|null,
    driverLogs: Map<string,string>|null,
    driverAttributes: Map<string,string>|null
    ) {
    super();
    this.appName = appName;
    this.appId = appId;
    this.time = time;
    this.sparkUser = sparkUser;
    this.appAttemptId = appAttemptId;
    this.driverLogs = driverLogs;
    this.driverAttributes = driverAttributes;
  }

  static fromJson( src: any ): SparkListenerApplicationStart {
    let appName = <string> src['App Name'];
    let appId = <string|null> src['App ID'];
    let timeObj = src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let sparkUser = src['User'];
    let appAttemptId = <string|null> src['App Attempt ID'];
    let driverLogsObj = src['Driver Logs'];
    let driverLogs = (driverLogsObj)? new Map<string,string>(Object.entries(driverLogsObj)) : null;
    let driverAttributesObj = src['Driver Attributes'];
    let driverAttributes = (driverAttributesObj)? new Map<string,string>(Object.entries(driverAttributesObj)) : null;
    return new SparkListenerApplicationStart(appName, appId, time, sparkUser, appAttemptId, driverLogs, driverAttributes);
  }

  getEvent(): string { return 'SparkListenerApplicationStart'; }
  getEventShortName(): string { return 'ApplicationStart'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * 
 */
export class SparkListenerApplicationEnd extends SparkEvent {
  
  // @JsonProperty("Timestamp")
  readonly time: Date;

  constructor(time: Date) {
    super();
    this.time = time;
  }

  static fromJson( src: any ): SparkListenerApplicationEnd {
    let timeObj = src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    return new SparkListenerApplicationEnd(time);
  }

  getEvent(): string { return 'SparkListenerApplicationEnd'; }
  getEventShortName(): string { return 'SparkListenerApplicationEnd'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * An internal class that describes the metadata of an event log.
 * example: {"Event":"SparkListenerLogStart","Spark Version":"3.1.1"}
 */
export class SparkListenerLogStart extends SparkEvent {

  // @JsonProperty("Spark Version")
  readonly version: string;

  constructor(version: string) {
    super();
    this.version = version;
  }

  static fromJson( src: any ): SparkListenerLogStart {
    let version = <string> src['Spark Version'];
    return new SparkListenerLogStart(version);
  }

  getEvent(): string { return 'SparkListenerLogStart'; }
  getEventShortName(): string { return 'LogStart'; }

}

/**
 * 
 */
export class ExecutorResourceRequest {

  // @JsonProperty("Resource Name")
  readonly resourceName: string;

  // @JsonProperty("Amount")
  readonly amount: number;

  // @JsonProperty("Discovery Script")
  readonly discoveryScript: string;

  // @JsonProperty("Vendor")
  readonly vendor: string;

  constructor(resourceName: string,
    amount: number,
    discoveryScript: string,
    vendor: string
    ) {
    this.resourceName = resourceName;
    this.amount = amount;
    this.discoveryScript = discoveryScript;
    this.vendor = vendor;
  }

  static fromJson( src: any ): ExecutorResourceRequest {
    let resourceName = <string> src['Resource Name'];
    let amount = <number> src['Amount'];
    let discoveryScript = <string> src['Discovery Script'];
    let vendor = <string> src['Vendor'];
    return new ExecutorResourceRequest(resourceName, amount, discoveryScript, vendor);
  }

}

/**
 * 
 */
export class SparkListenerResourceProfileAdded extends SparkEvent {

  // @JsonProperty("Resource Profile Id")
  readonly resourceProfileId: number;

  // ?? ResourceProfile resourceProfile;

  // @JsonProperty("Executor Resource Requests")
  readonly executorResourceRequests: Map<string, ExecutorResourceRequest>;

  // @JsonProperty("Task Resource Requests") 
  readonly taskResourceRequests: Map<string, ExecutorResourceRequest>;

  constructor(resourceProfileId: number, executorResourceRequests: Map<string, ExecutorResourceRequest>,
      taskResourceRequests: Map<string, ExecutorResourceRequest>) {
    super();
    this.resourceProfileId = resourceProfileId;
    this.executorResourceRequests = executorResourceRequests;
    this.taskResourceRequests = taskResourceRequests;
  }

  static fromJson( src: any ): SparkListenerResourceProfileAdded {
    let resourceProfileId = <number> src['Resource Profile Id'];
    let executorResourceRequestsObj = src['Executor Resource Requests'];
    let executorResourceRequests = new Map(); // TOADD
    console.log('TODO SparkListenerResourceProfileAdded.executorResourceRequests', executorResourceRequestsObj);
    let taskResourceRequestsObj = src['Task Resource Requests'];
    let taskResourceRequests = new Map(); // TOADD
    // console.log('TODO SparkListenerResourceProfileAdded.taskResourceRequests', taskResourceRequestsObj);
    return new SparkListenerResourceProfileAdded(resourceProfileId, executorResourceRequests, taskResourceRequests);
  }

  getEvent(): string { return 'SparkListenerResourceProfileAdded'; }
  getEventShortName(): string { return 'ResourceProfileAdded'; }

}

// cf spark source: sql/core/src/main/scala/org/apache/spark/sql/execution/ui/SQLListener.scala
// --------------------------------------------------------------------------------------------

export class SparkListenerSQLAdaptiveExecutionUpdate extends SparkEvent {

  readonly executionId: number;
        
  readonly physicalPlanDescription: string;
  
  readonly sparkPlanInfo: SparkPlanInfo;

  constructor(executionId: number, physicalPlanDescription: string, sparkPlanInfo: SparkPlanInfo) {
    super();
    this.executionId = executionId;
    this.physicalPlanDescription = physicalPlanDescription;
    this.sparkPlanInfo = sparkPlanInfo;
  }

  static fromJson( src: any ): SparkListenerSQLAdaptiveExecutionUpdate {
    let executionId = <number> src['executionId'];
    let physicalPlanDescription = src['physicalPlanDescription'];
    let sparkPlanInfoObj = src['sparkPlanInfo'];
    let sparkPlanInfo = (sparkPlanInfoObj)? SparkPlanInfo.fromJson(sparkPlanInfoObj) : SparkPlanInfo.createDefault();
    return new SparkListenerSQLAdaptiveExecutionUpdate(executionId, physicalPlanDescription, sparkPlanInfo);
  }

  getEvent(): string { return 'SparkListenerSQLAdaptiveExecutionUpdate'; }
  getEventShortName(): string { return 'SQLAdaptiveExecutionUpdate'; }

}

/**
 * 
 */
export class SparkListenerSQLAdaptiveSQLMetricUpdates extends SparkEvent {

  readonly executionId: number;

  readonly sqlPlanMetrics: SQLPlanMetric[];

  constructor(executionId: number, sqlPlanMetrics: SQLPlanMetric[]) {
    super();
    this.executionId = executionId;
    this.sqlPlanMetrics = sqlPlanMetrics;
  }
  
  static fromJson( src: any ): SparkListenerSQLAdaptiveSQLMetricUpdates {
    let executionId = <number> src['executionId'];
    let sqlPlanMetricsObj = src['sqlPlanMetrics'];
    let sqlPlanMetrics = (sqlPlanMetricsObj)? SQLPlanMetric.fromJsonArray(sqlPlanMetricsObj) : [];
    return new SparkListenerSQLAdaptiveSQLMetricUpdates(executionId, sqlPlanMetrics);
  }

  getEvent(): string { return 'SparkListenerSQLAdaptiveSQLMetricUpdates'; }
  getEventShortName(): string { return 'SQLAdaptiveSQLMetricUpdates'; }

}

/**
 * 
 */
export class SparkListenerSQLExecutionStart extends SparkEvent {

  readonly executionId: number

  readonly description: string;

  readonly details: string;

  readonly physicalPlanDescription: string;

  readonly sparkPlanInfo: SparkPlanInfo;

  readonly time: Date;

  constructor(executionId: number, description: string, details: string, physicalPlanDescription: string, sparkPlanInfo: SparkPlanInfo, time: Date) {
    super();
    this.executionId = executionId;
    this.description = description;
    this.details = details;
    this.physicalPlanDescription = physicalPlanDescription;
    this.sparkPlanInfo = sparkPlanInfo;
    this.time = time;
  }

  static fromJson( src: any ): SparkListenerSQLExecutionStart{
    let executionId = <number> src['executionId'];
    let description = <string> src['description'];
    let details = <string> src['details'];
    let physicalPlanDescription = <string> src['physicalPlanDescription'];
    let sparkPlanInfoObj = src['sparkPlanInfo'];
    let sparkPlanInfo = (sparkPlanInfoObj)? SparkPlanInfo.fromJson(sparkPlanInfoObj) : SparkPlanInfo.createDefault();
    let timeObj = <number> src['time'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    return new SparkListenerSQLExecutionStart(executionId, description, details, physicalPlanDescription, sparkPlanInfo, time);
  }

  getEvent(): string { return 'SparkListenerSQLExecutionStart'; }
  getEventShortName(): string { return 'SQLExecutionStart'; }

  override getTime(): Date|undefined { return this.time; }

}

/**
 * 
 */
export class SparkListenerSQLExecutionEnd extends SparkEvent {

  executionId: number;

  time: Date;
  
  constructor(executionId: number, time: Date) {
    super();
    this.executionId = executionId;
    this.time = time;
  }

  static fromJson( src: any ): SparkListenerSQLExecutionEnd {
    let executionId = <number> src['executionId'];
    let timeObj = <number> src['time'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    return new SparkListenerSQLExecutionEnd(executionId, time);
  }
  
  getEvent(): string { return 'SparkListenerSQLExecutionEnd'; }
  getEventShortName(): string { return 'SQLExecutionEnd'; }

  override getDisplaySummary(): string {
    return 'executionId: ' + this.executionId;
  }

  override getTime(): Date|undefined { return this.time; }

}

export class AccumUpdateValue {
  readonly id: number;
  readonly value: number;

  constructor(id: number, value: number) {
    this.id = id;
    this.value = value;
  }

  static fromJson( src: any ): AccumUpdateValue {
    let id = <number> src[0];
    let value = <number> src[1];
    return new AccumUpdateValue(id, value);
  }

  static fromJsonArray(src: any[]): AccumUpdateValue[] {
      return src.map(x => AccumUpdateValue.fromJson(x));
  }

}

/**
 * A message used to update SQL metric value for driver-side updates (which doesn't get reflected
 * automatically).
 */
// example: {"Event":"org.apache.spark.sql.execution.ui.SparkListenerDriverAccumUpdates","executionId":1,"accumUpdates":[[144,13],[145,3],[146,169300366]]}
export class SparkListenerDriverAccumUpdates extends SparkEvent {

  readonly executionId: number

  // example json: [ [144,13],[145,3] ]
  readonly accumUpdates: AccumUpdateValue[];
  
  constructor(executionId: number, accumUpdates: AccumUpdateValue[]) {
    super();
    this.executionId = executionId;
    this.accumUpdates = accumUpdates;
  }
        
  static fromJson( src: any ): SparkListenerDriverAccumUpdates {
    let executionId = <number> src['executionId'];
    let accumUpdatesObj = src['accumUpdates'];
    let accumUpdates = (accumUpdatesObj)? AccumUpdateValue.fromJsonArray(accumUpdatesObj) : [];
    return new SparkListenerDriverAccumUpdates(executionId, accumUpdates);
  }

  getEvent(): string { return 'SparkListenerDriverAccumUpdates'; }
  getEventShortName(): string { return 'DriverAccumUpdates'; }

}
