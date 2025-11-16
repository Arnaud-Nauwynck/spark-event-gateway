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

  readonly eventNum: number;

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
  get executorIdOpt(): string|undefined { return this.getExecutorId(); }
  get sqlExecIdOpt(): number|undefined { return this.getSQLExecId(); }
  get hostIdOpt(): string|undefined { return this.getHostId(); }
  get sparkPlanInfoOpt(): SparkPlanInfo|undefined { return this.getSparkPlanInfoOpt(); }
  get callSiteDetailOpt(): string|undefined { return this.getCallSiteDetail(); }
  get propertiesOpt(): Map<string,any>|undefined|null { return this.getPropertiesOpt(); }

  constructor(eventNum: number) {
	  this.eventNum = eventNum;
  }

  static fromAnyJson(eventNum: number, src: any ): SparkEvent {
    let eventType = src['Event'];
    switch ( eventType ) {
      case 'SparkListenerStageSubmitted': return SparkListenerStageSubmitted.fromJson(eventNum, src );
      case 'SparkListenerStageCompleted': return SparkListenerStageCompleted.fromJson(eventNum, src );
      case 'SparkListenerTaskStart': return SparkListenerTaskStart.fromJson(eventNum, src );
      case 'SparkListenerTaskGettingResult': return SparkListenerTaskGettingResult.fromJson(eventNum, src );
      case 'SparkListenerSpeculativeTaskSubmitted': return SparkListenerSpeculativeTaskSubmitted.fromJson(eventNum, src );
      case 'SparkListenerTaskEnd': return SparkListenerTaskEnd.fromJson(eventNum, src );
      case 'SparkListenerJobStart': return SparkListenerJobStart.fromJson(eventNum, src );
      case 'SparkListenerJobEnd': return SparkListenerJobEnd.fromJson(eventNum, src );
      case 'SparkListenerEnvironmentUpdate': return SparkListenerEnvironmentUpdate.fromJson(eventNum, src );
      case 'SparkListenerBlockManagerAdded': return SparkListenerBlockManagerAdded.fromJson(eventNum, src );
      case 'SparkListenerBlockManagerRemoved': return SparkListenerBlockManagerRemoved.fromJson(eventNum, src );
      case 'SparkListenerUnpersistRDD': return SparkListenerUnpersistRDD.fromJson(eventNum, src );
      case 'SparkListenerExecutorAdded': return SparkListenerExecutorAdded.fromJson(eventNum, src );
      case 'SparkListenerExecutorRemoved': return SparkListenerExecutorRemoved.fromJson(eventNum, src );
      case 'SparkListenerExecutorBlacklisted': return SparkListenerExecutorBlacklisted.fromJson(eventNum, src );
      case 'SparkListenerExecutorExcluded': return SparkListenerExecutorExcluded.fromJson(eventNum, src );
      case 'SparkListenerExecutorBlacklistedForStage': return SparkListenerExecutorBlacklistedForStage.fromJson(eventNum, src );
      case 'SparkListenerExecutorExcludedForStage': return SparkListenerExecutorExcludedForStage.fromJson(eventNum, src );
      case 'SparkListenerNodeBlacklistedForStage': return SparkListenerNodeBlacklistedForStage.fromJson(eventNum, src );
      case 'SparkListenerNodeExcludedForStage': return SparkListenerNodeExcludedForStage.fromJson(eventNum, src );
      case 'SparkListenerExecutorUnblacklisted': return SparkListenerExecutorUnblacklisted.fromJson(eventNum, src );
      case 'SparkListenerExecutorUnexcluded': return SparkListenerExecutorUnexcluded.fromJson(eventNum, src );
      case 'SparkListenerNodeBlacklisted': return SparkListenerNodeBlacklisted.fromJson(eventNum, src );
      case 'SparkListenerNodeExcluded': return SparkListenerNodeExcluded.fromJson(eventNum, src );
      case 'SparkListenerNodeUnblacklisted': return SparkListenerNodeUnblacklisted.fromJson(eventNum, src );
      case 'SparkListenerNodeUnexcluded': return SparkListenerNodeUnexcluded.fromJson(eventNum, src );
      case 'SparkListenerUnschedulableTaskSetAdded': return SparkListenerUnschedulableTaskSetAdded.fromJson(eventNum, src );
      case 'SparkListenerUnschedulableTaskSetRemoved': return SparkListenerUnschedulableTaskSetRemoved.fromJson(eventNum, src );
      case 'SparkListenerBlockUpdated': return SparkListenerBlockUpdated.fromJson(eventNum, src );
      case 'SparkListenerExecutorMetricsUpdate': return SparkListenerExecutorMetricsUpdate.fromJson(eventNum, src );
      case 'SparkListenerStageExecutorMetrics': return SparkListenerStageExecutorMetrics.fromJson(eventNum, src );
      case 'SparkListenerApplicationStart': return SparkListenerApplicationStart.fromJson(eventNum, src );
      case 'SparkListenerApplicationEnd': return SparkListenerApplicationEnd.fromJson(eventNum, src );
      case 'SparkListenerLogStart': return SparkListenerLogStart.fromJson(eventNum, src );
      case 'SparkListenerResourceProfileAdded': return SparkListenerResourceProfileAdded.fromJson(eventNum, src );
      // --------------------------------------------------------------------------------------------
      case 'org.apache.spark.sql.execution.ui.SparkListenerSQLAdaptiveExecutionUpdate': return SparkListenerSQLAdaptiveExecutionUpdate.fromJson(eventNum, src );
      case 'org.apache.spark.sql.execution.ui.SparkListenerSQLAdaptiveSQLMetricUpdates': return SparkListenerSQLAdaptiveSQLMetricUpdates.fromJson(eventNum, src );
      case 'org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionStart': return SparkListenerSQLExecutionStart.fromJson(eventNum, src );
      case 'org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionEnd': return SparkListenerSQLExecutionEnd.fromJson(eventNum, src );
      case 'org.apache.spark.sql.execution.ui.SparkListenerDriverAccumUpdates': return SparkListenerDriverAccumUpdates.fromJson(eventNum, src );
      default: throw ( 'unrecognized Event type:' + eventType );
    }
  }

  static fromAnyJsonArray(firstEventNum: number, src: any[]): SparkEvent[] {
    let res : SparkEvent[] = [];
    for(var i = 0; i < src.length; i++) {
      const eventNum = firstEventNum + i;
      res[i] = SparkEvent.fromAnyJson(eventNum, src[i]);
    }
    return res;
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
  getExecutorId(): string|undefined { return undefined; }
  getSQLExecId(): number|undefined { return undefined; }
  getHostId(): string|undefined { return undefined; }
  getSparkPlanInfoOpt(): SparkPlanInfo|undefined { return undefined; }
  getPhysicalPlanDescription(): string|undefined { return undefined; }
  getStageInfo(): StageInfo|undefined { return undefined; }
  getTaskInfo(): TaskInfo|undefined { return undefined; }
  getCallSiteDetail(): string|undefined {
    const stageInfo = this.getStageInfo();
    if (stageInfo) {
      const res = stageInfo.details;
      if (!res) return res;
    }
    return undefined;
  }
  getDescription(): string|undefined { return undefined; }
  getPropertiesOpt(): Map<string,any>|undefined|null { return undefined; }

  isApplicationLifecycleEvents() { return false; }
  isExecutorLifecycleEvents() { return false; }

  isStageSubmittedEvent(): boolean { return false; }
  isSqlStartEvent(): boolean { return false; }
  isSqlEndEvent(): boolean { return false; }
  isSqlAdaptiveExecutionUpdateEvent(): boolean { return false; }

  toSparkJson(): any {
    return JSON.parse(JSON.stringify(this));
  }

}


// --------------------------------------------------------------------------

export type Properties = Map<string, any>;

function extractPropSqlId(props: Properties|undefined|null): number|undefined {
  const sqlExecIdOpt = props?.get('spark.sql.execution.id');
  return (sqlExecIdOpt)? +sqlExecIdOpt : undefined;
}


export class SparkListenerStageSubmitted extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'Stage Submitted';

  // @JsonProperty("Stage Info")
  readonly stageInfo: StageInfo;

  // @JsonProperty("Properties")
  readonly properties: Properties | undefined | null;

  readonly sqlExecId: number|undefined;

  constructor(eventNum: number, stageInfo: StageInfo, properties: Properties | undefined | null ) {
    super(eventNum);
    this.stageInfo = stageInfo;
    this.properties = properties;
    this.sqlExecId = extractPropSqlId(properties);
  }

  static fromJson(eventNum: number, src: any ): SparkListenerStageSubmitted {
    let stageInfo = StageInfo.fromJson(src['Stage Info'] );
    let propertiesObj = src['Properties'];
    let properties = ( propertiesObj ) ? new Map( Object.entries( propertiesObj ) ) : null;
    let event = new SparkListenerStageSubmitted(eventNum, stageInfo, properties );
  	// ctx.addStageInfoUpdate(stageInfo, event);
  	return event;
  }

  getEvent(): string { return 'SparkListenerStageSubmitted'; }
  getEventShortName(): string { return SparkListenerStageSubmitted.SHORT_EVENT_NAME; }

  override getDisplaySummary(): string {
    return 'stageInfo:{ ' + this.stageInfo.getDisplaySummary() + ' }';
  }

  override getStageId(): number|undefined { return this.stageInfo.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageInfo.attemptId; }
  override getCallSiteDetail(): string | undefined { return this.stageInfo.details; }

  override isStageSubmittedEvent(): boolean { return true; }
  override getStageInfo(): StageInfo { return this.stageInfo; }
  override getPropertiesOpt(): Map<string,any>|undefined|null { return this.properties; }

}

/**
 *
 */
export class SparkListenerStageCompleted extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'Stage Completed';

  // @JsonProperty("Stage Info")
  readonly stageInfo: StageInfo;
  // readonly correspSubmitStageInfo: StageUpdate;

  getEvent(): string { return 'SparkListenerStageCompleted'; }
  getEventShortName(): string { return SparkListenerStageCompleted.SHORT_EVENT_NAME; }

  constructor(eventNum: number, stageInfo: StageInfo ) {
    super(eventNum);
    this.stageInfo = stageInfo;
    // let stageUpdates = ctx.addStageInfoUpdate(stageInfo, this);
    // this.correspSubmitStageInfo = stageUpdates.eventUpdates[0];
  }

  static fromJson( eventNum: number, src: any ): SparkListenerStageCompleted {
    let stageInfo = StageInfo.fromJson(src['Stage Info'] );
    let event = new SparkListenerStageCompleted(eventNum, stageInfo );
  	// ctx.addStageInfoUpdate(stageInfo, event);
  	return event;
  }

  override getDisplaySummary(): string {
    return 'stageInfo:{ ' + this.stageInfo.getDisplaySummary() + ' }';
  }

  override getStageId(): number|undefined { return this.stageInfo.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageInfo.attemptId; }
  override getCallSiteDetail(): string | undefined { return this.stageInfo.details; }
  override getStageInfo(): StageInfo { return this.stageInfo; }

}

/**
 *
 */
export class SparkListenerTaskStart extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'Task Start';

  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;

  // @JsonProperty("Task Info")
  readonly taskInfo: TaskInfo;

  constructor(eventNum: number, stageId: number, stageAttemptId: number, taskInfo: TaskInfo ) {
    super(eventNum);
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
    this.taskInfo = taskInfo;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerTaskStart {
    let stageId = <number>src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID'];
    let taskInfo = TaskInfo.fromJson(src['Task Info'] );
    let event = new SparkListenerTaskStart(eventNum, stageId, stageAttemptId, taskInfo );
  	// ctx.addTaskInfoUpdate(taskInfo, event);
  	return event;
  }

  getEvent(): string { return 'SparkListenerTaskStart'; }
  getEventShortName(): string { return SparkListenerTaskStart.SHORT_EVENT_NAME; }

  override getDisplaySummary(): string {
    return 'stageId: ' + this.stageId
      + ((this.stageAttemptId !== 0)? ' stageAttemptId:' + this.stageAttemptId : '')
      + ((this.taskInfo)? ' taskInfo:{ ' + this.taskInfo.getDisplaySummary() + ' }': '');
  }

  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }
  override getTaskId(): number|undefined { return this.taskInfo.taskId; }
  override getTaskAttemptId(): number|undefined { return this.taskInfo.attempt; }
  override getExecutorId(): string|undefined { return this.taskInfo.executorId; }
  override getTaskInfo(): TaskInfo|undefined { return this.taskInfo; }

}

/**
 *
 */
export class SparkListenerTaskGettingResult extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'Task Getting Result';

  // @JsonProperty("Task Info")
  taskInfo: TaskInfo;

  getEvent(): string { return 'SparkListenerTaskGettingResult'; }
  getEventShortName(): string { return SparkListenerTaskGettingResult.SHORT_EVENT_NAME; }

  constructor(eventNum: number, taskInfo: TaskInfo ) {
    super(eventNum);
    this.taskInfo = taskInfo;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerTaskGettingResult {
    let taskInfo = TaskInfo.fromJson(src['Task Info'] );
    let event = new SparkListenerTaskGettingResult(eventNum, taskInfo );
  	// ctx.addTaskInfoUpdate(taskInfo, event);
  	return event;
  }

  override getDisplaySummary(): string {
    return ((this.taskInfo)? ' taskInfo:{ ' + this.taskInfo.getDisplaySummary() + ' }': '');
  }

//  override getStageId(): number|undefined { return this.taskInfo.; }
//  override getStageAttemptId(): number|undefined { return this.taskInfo.; }
  override getTaskId(): number|undefined { return this.taskInfo.taskId; }
  override getTaskAttemptId(): number|undefined { return this.taskInfo.attempt; }
  override getExecutorId(): string|undefined { return this.taskInfo.executorId; }
  override getTaskInfo(): TaskInfo|undefined { return this.taskInfo; }
}

/**
 *
 */
export class SparkListenerSpeculativeTaskSubmitted extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'SpeculativeTask Submitted';

  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;

  getEvent(): string { return 'SparkListenerSpeculativeTaskSubmitted'; }
  getEventShortName(): string { return SparkListenerSpeculativeTaskSubmitted.SHORT_EVENT_NAME; }

  constructor(eventNum: number, stageId: number, stageAttemptId: number ) {
    super(eventNum);
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerSpeculativeTaskSubmitted {
    let stageId = <number>src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID'];
    return new SparkListenerSpeculativeTaskSubmitted(eventNum, stageId, stageAttemptId );
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
  static readonly SHORT_EVENT_NAME = 'Task End';

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

  constructor(eventNum: number, stageId: number, stageAttemptId: number,
    taskType: string,
    reason: TaskEndReason,
    taskInfo: TaskInfo,
    taskExecutorMetrics: ExecutorMetrics,
    taskMetrics: TaskMetrics | null,
    metadata: Map<string, any> | null
  ) {
    super(eventNum);
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
    this.taskType = taskType;
    this.reason = reason;
    this.taskInfo = taskInfo;
    this.taskExecutorMetrics = taskExecutorMetrics;
    this.taskMetrics = taskMetrics;
    this.metadata = metadata;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerTaskEnd {
    let stageId = <number>src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID'];
    let taskType = <string>src['Task Type'];
    let tmpReason = src['Task End Reason'];
    let reason = ( tmpReason ) ? TaskEndReason.fromJson( tmpReason ) : TaskEndReason.createDefault();
    let taskInfo = TaskInfo.fromJson(src['Task Info'] );
    let taskExecutorMetrics = ExecutorMetrics.fromJson( src['Task Executor Metrics'] );
    let taskMetricsObj = src['Task Metrics'];
    let taskMetrics = ( taskMetricsObj ) ? TaskMetrics.fromJson( taskMetricsObj ) : null;
    let metadataObj = src['Metadata'];
    let metadata: Map<string, any> | null = ( metadataObj ) ? new Map( Object.entries( metadataObj ) ) : null;
    let event = new SparkListenerTaskEnd(eventNum, stageId, stageAttemptId, taskType, reason, taskInfo, taskExecutorMetrics, taskMetrics, metadata );
  	// ctx.addTaskInfoUpdate(taskInfo, event);
  	return event;
  }

  getEvent(): string { return 'SparkListenerTaskEnd'; }
  getEventShortName(): string { return SparkListenerTaskEnd.SHORT_EVENT_NAME; }

  override getDisplaySummary(): string {
    return ' stageId: ' + this.stageId
      + ((this.stageAttemptId !== 0)? ' stageAttemptId:' + this.stageAttemptId : '')
      + ' taskType:' + this.taskType
      + ((this.reason)? ' endReason:' + JSON.stringify(this.reason) : '')
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
  override getExecutorId(): string|undefined { return this.taskInfo.executorId; }
  override getTaskInfo(): TaskInfo|undefined { return this.taskInfo; }

}

/**
 *
 */
export class SparkListenerJobStart extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'Job Start';

  // @JsonProperty("Job ID")
  readonly jobId: number;

  // @JsonProperty("Submission Time")
  readonly time: Date;

  // @JsonProperty("Stage Infos")
  readonly stageInfos: StageInfo[];

  // @JsonProperty("Stage IDs")
  readonly stageIds: number[]; // redundant with stageInfos

  // @JsonProperty("Properties")
  readonly properties: Properties;

  readonly sqlExecId: number|undefined;

  constructor(eventNum: number, jobId: number, time: Date, stageInfos: StageInfo[], stageIds: number[], properties: Properties ) {
    super(eventNum);
    this.jobId = jobId;
    this.time = time;
    this.stageInfos = stageInfos;
    this.stageIds = stageIds;
    this.properties = properties;
    this.sqlExecId = extractPropSqlId(properties);
  }

  static fromJson( eventNum: number, src: any ): SparkListenerJobStart {
    let jobId = <number>src['Job ID'];
    let timeObj = <number>src['Submission Time'];
    let time = ( timeObj ) ? new Date( timeObj ) : new Date();
    let stageInfosObj = src['Stage Infos'];
    let stageInfos = (stageInfosObj) ? StageInfo.fromJsonArray(stageInfosObj) : [];
    let stageIds = <number[]>src['Stage IDs'];
    let propertiesObj = src['Properties'];
    let properties = ( propertiesObj ) ? new Map( Object.entries( propertiesObj ) ) : new Map();
    let event = new SparkListenerJobStart(eventNum, jobId, time, stageInfos, stageIds, properties );
	// if (stageInfos) {
	// 	stageInfos.forEach(stageInfo => ctx.addStageInfoUpdate(stageInfo, event));
	// }
  	return event;
  }

  getEvent(): string { return 'SparkListenerJobStart'; }
  getEventShortName(): string { return SparkListenerJobStart.SHORT_EVENT_NAME; }

  override getDisplaySummary(): string {
    var res = 'jobId:' + this.jobId
      + ' time:' + this.time;
      // TOADD
//    stageIds: number[]; // redundant with stageInfos
//    stageInfos: StageInfo[];
//    properties: Properties;';
    return res;
  }

  override getTime(): Date|undefined { return this.time; }

  // override getSqlExecId(): number|undefined { return this.sqlExecId; }
  override getJobId(): number|undefined { return this.jobId; }

  override getCallSiteDetail(): string | undefined {
    const stageInfos = this.stageInfos;
    if (stageInfos && stageInfos.length > 0) {
      return stageInfos[stageInfos.length-1].details;
    }
    return undefined;
  }
  override getPropertiesOpt(): Map<string,any> { return this.properties; }

  override toSparkJson(): any {
    return {
      "Job ID": this.jobId,
      "Submission Time": this.time.getMilliseconds(),
      "Stage Infos": this.stageInfos, // TODO map JSON
      // "Stage IDs":
      "Properties": (this.properties)? Object.fromEntries(this.properties) : undefined,
    };
  }


}

/**
 *
 */
export class SparkListenerJobEnd extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'Job End';

  // @JsonProperty("Job ID")
  jobId: number;

  // @JsonProperty("Completion Time")
  time: Date;

  // @JsonProperty("Job Result")
  jobResult: JobResult;

  // correspJobStartEvent: SparkListenerJobStart|undefined;

  constructor(eventNum: number, jobId: number, time: Date, jobResult: JobResult ) {
    super(eventNum);
    this.jobId = jobId;
    this.time = time;
    this.jobResult = jobResult;
    // this.correspJobStartEvent = ctx.findCorrespJobStart(jobId);
  }

  static fromJson(eventNum: number, src: any ): SparkListenerJobEnd {
    let jobId = <number>src['Job ID'];
    let timeObj = <number>src['Submission Time'];
    let time = ( timeObj ) ? new Date( timeObj ) : new Date();
    let jobResultObj = src['Job Result'];
    let jobResult = ( jobResultObj ) ? JobResult.fromJson( jobResultObj ) : JobResult.createDefault();
    return new SparkListenerJobEnd(eventNum, jobId, time, jobResult);
  }

  getEvent(): string { return 'SparkListenerJobEnd'; }
  getEventShortName(): string { return SparkListenerJobEnd.SHORT_EVENT_NAME; }

  override getDisplaySummary(): string {
    const res = 'jobId:' + this.jobId + ' time:' + this.time + ' jobResult:' + this.jobResult.getDisplaySummary();
    return res;
  }

  override getTime(): Date|undefined { return this.time; }
  override getJobId(): number|undefined { return this.jobId; }

  // getDuration(): number|undefined {
  //    if (!this.correspJobStartEvent) return undefined;
  //    return this.time.getTime() - this.correspJobStartEvent.time.getTime();
  // }

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

  constructor(eventNum: number,
    jvmInformation: Map<string, string>,
    sparkProperties: Map<string, string>,
    hadoopProperties: Map<string, string>,
    systemProperties: Map<string, string>,
    classpathEntries: Map<string, string>
  ) {
    super(eventNum);
    this.jvmInformation = jvmInformation;
    this.sparkProperties = sparkProperties;
    this.hadoopProperties = hadoopProperties;
    this.systemProperties = systemProperties;
    this.classpathEntries = classpathEntries;
  }

  static fromJson(eventNum: number, src: any ): SparkListenerEnvironmentUpdate {
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
    return new SparkListenerEnvironmentUpdate(eventNum, jvmInformation, sparkProperties, hadoopProperties, systemProperties, classpathEntries );
  }

  getEvent(): string { return 'SparkListenerEnvironmentUpdate'; }
  getEventShortName(): string { return 'EnvironmentUpdate'; }

  override isApplicationLifecycleEvents() { return true; }

}

/**
*
*/

export class SparkListenerBlockManagerAdded extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'BlockManager Added';

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

  constructor(eventNum: number, time: Date,
    blockManagerId: BlockManagerId,
    maxMem: number,
    maxOnHeapMem: number|null,
    maxOffHeapMem: number|null
    ) {
    super(eventNum);
    this.time = time;
    this.blockManagerId = blockManagerId;
    this.maxMem = maxMem;
    this.maxOnHeapMem = maxOnHeapMem;
    this.maxOffHeapMem = maxOffHeapMem;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerBlockManagerAdded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let blockManagerIdObj = src['Block Manager ID']
    let blockManagerId = (blockManagerIdObj)? BlockManagerId.fromJson(blockManagerIdObj) : BlockManagerId.createDefault();
    let maxMem = <number> src['Maximum Memory'];
    let maxOnHeapMem = <number> src['Maximum Onheap Memory'];
    let maxOffHeapMem = <number> src['Maximum Offheap Memory'];
    return new SparkListenerBlockManagerAdded(eventNum, time, blockManagerId, maxMem, maxOnHeapMem, maxOffHeapMem);
  }

  getEvent(): string { return 'SparkListenerBlockManagerAdded'; }
  getEventShortName(): string { return SparkListenerBlockManagerAdded.SHORT_EVENT_NAME; }

  override getTime(): Date|undefined { return this.time; }

  override getExecutorId(): string|undefined { return this.blockManagerId.executorId; }


  override isExecutorLifecycleEvents() { return true}
}

/**
*
*/
export class SparkListenerBlockManagerRemoved extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'BlockManager Removed';

  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Block Manager ID")
  readonly blockManagerId: BlockManagerId;

  // @JsonProperty("Maximum Memory")
  readonly maxMem: number

  constructor(eventNum: number, time: Date,
      blockManagerId: BlockManagerId,
      maxMem: number) {
    super(eventNum);
    this.time = time;
    this.blockManagerId = blockManagerId;
    this.maxMem = maxMem;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerBlockManagerRemoved {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let blockManagerIdObj = src['Block Manager ID']
    let blockManagerId = (blockManagerIdObj)? BlockManagerId.fromJson(blockManagerIdObj) : BlockManagerId.createDefault();
    let maxMem = <number> src['Maximum Memory'];
    return new SparkListenerBlockManagerRemoved(eventNum, time, blockManagerId, maxMem);
  }

  getEvent(): string { return 'SparkListenerBlockManagerRemoved'; }
  getEventShortName(): string { return SparkListenerBlockManagerRemoved.SHORT_EVENT_NAME; }

  override getTime(): Date|undefined { return this.time; }

  override getExecutorId(): string|undefined { return this.blockManagerId.executorId; }

  override isExecutorLifecycleEvents() { return true}


}

/**
 *
 */
export class SparkListenerUnpersistRDD extends SparkEvent {

  // @JsonProperty("RDD ID")
  readonly rddId: number;

  constructor(eventNum: number, rddId: number) {
    super(eventNum);
    this.rddId = rddId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerUnpersistRDD {
    let rddId = <number> src['RDD ID'];
    return new SparkListenerUnpersistRDD(eventNum, rddId);
  }

  getEvent(): string { return 'SparkListenerUnpersistRDD'; }
  getEventShortName(): string { return 'Unpersist RDD'; }

}

/**
 *
 */
export class SparkListenerExecutorAdded extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'Executor Added';

  // @JsonProperty("Timestamp")
  time: Date;

  // @JsonProperty("Executor ID")
  executorId: string;

  // @JsonProperty("Executor Info")
  executorInfo: ExecutorInfo;

  constructor(eventNum: number, time: Date, executorId: string, executorInfo: ExecutorInfo) {
    super(eventNum);
    this.time = time;
    this.executorId = executorId;
    this.executorInfo = executorInfo;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerExecutorAdded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <string> src['Executor ID'];
    let executorInfoObj = src['Executor Info'];
    let executorInfo = (executorInfoObj)? ExecutorInfo.fromJson(executorInfoObj) : ExecutorInfo.createDefault();
    return new SparkListenerExecutorAdded(eventNum, time, executorId, executorInfo);
  }

  getEvent(): string { return 'SparkListenerExecutorAdded'; }
  getEventShortName(): string { return SparkListenerExecutorAdded.SHORT_EVENT_NAME; }

  override getTime(): Date|undefined { return this.time; }

  override getExecutorId(): string|undefined { return this.executorId; }

  override isExecutorLifecycleEvents() { return true; }

}

/**
 *
 */
export class SparkListenerExecutorRemoved extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'Executor Removed';

  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: string;

  readonly reason: string;

  constructor(eventNum: number, time: Date, executorId: string, reason: string) {
    super(eventNum);
    this.time = time;
    this.executorId = executorId;
    this.reason = reason;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerExecutorRemoved {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <string> src['Executor ID'];
    let reason = <string> src['Reason'];
    return new SparkListenerExecutorRemoved(eventNum, time, executorId, reason);
  }

  getEvent(): string { return 'SparkListenerExecutorRemoved'; }
  getEventShortName(): string { return SparkListenerExecutorRemoved.SHORT_EVENT_NAME; }

  override getTime(): Date|undefined { return this.time; }

  override getExecutorId(): string|undefined { return this.executorId; }

  override isExecutorLifecycleEvents() { return true; }
}

/**
 * @Deprecated("use SparkListenerExecutorExcluded instead", "3.1.0")
 */
export class SparkListenerExecutorBlacklisted extends SparkEvent {

  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: string;

  readonly taskFailures: number;

  constructor(eventNum: number, time: Date, executorId: string, taskFailures: number) {
    super(eventNum);
    this.time = time;
    this.executorId = executorId;
    this.taskFailures = taskFailures;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerExecutorBlacklisted {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <string> src['Executor ID'];
    let taskFailures = <number> src['Task Failures'];
    return new SparkListenerExecutorBlacklisted(eventNum, time, executorId, taskFailures);
  }

  getEvent(): string { return 'SparkListenerExecutorBlacklisted'; }
  getEventShortName(): string { return 'ExecutorBlacklisted'; }

  override getTime(): Date|undefined { return this.time; }

  override getExecutorId(): string|undefined { return this.executorId; }

  override isExecutorLifecycleEvents() { return true; }
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

  constructor(eventNum: number, time: Date, executorId: number, taskFailures: number) {
    super(eventNum);
    this.time = time;
    this.executorId = executorId;
    this.taskFailures = taskFailures;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerExecutorExcluded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <number> src['Executor ID'];
    let taskFailures = <number> src['Task Failures'];
    return new SparkListenerExecutorExcluded(eventNum, time, executorId, taskFailures);
  }

  getEvent(): string { return 'SparkListenerExecutorExcluded'; }
  getEventShortName(): string { return 'ExecutorExcluded'; }

  override getTime(): Date|undefined { return this.time; }

  override isExecutorLifecycleEvents() { return true; }
}

/**
 * @Deprecated("use SparkListenerExecutorExcludedForStage instead", "3.1.0")
 */
export class SparkListenerExecutorBlacklistedForStage extends SparkEvent {
  // @JsonProperty("Timestamp")
  time: Date;

  // @JsonProperty("Executor ID")
  executorId: string;

  taskFailures: number;

  // @JsonProperty("Stage ID")
  stageId: number;

  // @JsonProperty("Stage Attempt ID")
  stageAttemptId: number;

  constructor(eventNum: number, time: Date, executorId: string, taskFailures: number, stageId: number, stageAttemptId: number) {
    super(eventNum);
    this.time = time;
    this.executorId = executorId;
    this.taskFailures = taskFailures;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerExecutorBlacklistedForStage {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <string> src['Executor ID'];
    let taskFailures = <number> src['Task Failures'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID'];
    return new SparkListenerExecutorBlacklistedForStage(eventNum, time, executorId, taskFailures, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerExecutorBlacklistedForStage'; }
  getEventShortName(): string { return 'ExecutorBlacklistedForStage'; }

  override getTime(): Date|undefined { return this.time; }
  override getExecutorId(): string|undefined { return this.executorId; }
  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }

  override isExecutorLifecycleEvents() { return true; }
}

/**
 * @Since("3.1.0")
 */
export class SparkListenerExecutorExcludedForStage extends SparkEvent {
  // @JsonProperty("Timestamp")
  time: Date;

  // @JsonProperty("Executor ID")
  executorId: string;

  taskFailures: number;

  // @JsonProperty("Stage ID")
  stageId: number;

  // @JsonProperty("Stage Attempt ID")
  stageAttemptId: number;

  constructor(eventNum: number, time: Date, executorId: string, taskFailures: number, stageId: number, stageAttemptId: number) {
    super(eventNum);
    this.time = time;
    this.executorId = executorId;
    this.taskFailures = taskFailures;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerExecutorExcludedForStage {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <string> src['Executor ID'];
    let taskFailures = <number> src['Task Failures'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID'];
    return new SparkListenerExecutorExcludedForStage(eventNum, time, executorId, taskFailures, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerExecutorExcludedForStage'; }
  getEventShortName(): string { return 'ExecutorExcludedForStage'; }

  override getTime(): Date|undefined { return this.time; }
  override getExecutorId(): string|undefined { return this.executorId; }
  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }

  override isExecutorLifecycleEvents() { return true; }
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

  constructor(eventNum: number, time: Date, hostId: string, executorFailures: number, stageId: number, stageAttemptId: number) {
    super(eventNum);
    this.time = time;
    this.hostId = hostId;
    this.executorFailures = executorFailures;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerNodeBlacklistedForStage {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    let executorFailures = <number> src['Executor Failures'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID'];
    return new SparkListenerNodeBlacklistedForStage(eventNum, time, hostId, executorFailures, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerNodeBlacklistedForStage'; }
  getEventShortName(): string { return 'NodeBlacklistedForStage'; }

  override getTime(): Date|undefined { return this.time; }
  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }

  override isExecutorLifecycleEvents() { return true; }
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

  constructor(eventNum: number, time: Date, hostId: string, executorFailures: number, stageId: number, stageAttemptId: number) {
    super(eventNum);
    this.time = time;
    this.hostId = hostId;
    this.executorFailures = executorFailures;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerNodeExcludedForStage {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    let executorFailures = <number> src['Executor Failures'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID'];
    return new SparkListenerNodeExcludedForStage(eventNum, time, hostId, executorFailures, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerNodeExcludedForStage'; }
  getEventShortName(): string { return 'NodeExcludedForStage'; }

  override getTime(): Date|undefined { return this.time; }
  override getStageId(): number|undefined { return this.stageId; }
  override getStageAttemptId(): number|undefined { return this.stageAttemptId; }

  override isExecutorLifecycleEvents() { return true; }
}

/**
 * @deprecated("use SparkListenerExecutorUnexcluded instead", "3.1.0")
 */
export class SparkListenerExecutorUnblacklisted extends SparkEvent {

  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: string;

  constructor(eventNum: number, time: Date, executorId: string) {
    super(eventNum);
    this.time = time;
    this.executorId = executorId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerExecutorUnblacklisted {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <string> src['Executor ID'];
    return new SparkListenerExecutorUnblacklisted(eventNum, time, executorId);
  }

  getEvent(): string { return 'SparkListenerExecutorUnblacklisted'; }
  getEventShortName(): string { return 'ExecutorUnblacklisted'; }

  override getTime(): Date|undefined { return this.time; }
  override getExecutorId(): string|undefined { return this.executorId; }

  override isExecutorLifecycleEvents() { return true; }
}

/**
 *
 */
export class SparkListenerExecutorUnexcluded extends SparkEvent {

  // @JsonProperty("Timestamp")
  readonly time: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: string;

  constructor(eventNum: number, time: Date, executorId: string) {
    super(eventNum);
    this.time = time;
    this.executorId = executorId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerExecutorUnexcluded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let executorId = <string> src['Executor ID'];
    return new SparkListenerExecutorUnexcluded(eventNum, time, executorId);
  }

  getEvent(): string { return 'SparkListenerExecutorUnexcluded'; }
  getEventShortName(): string { return 'ExecutorUnexcluded'; }

  override getTime(): Date|undefined { return this.time; }
  override getExecutorId(): string|undefined { return this.executorId; }

  override isExecutorLifecycleEvents() { return true; }
}

/**
 * @Deprecated("use SparkListenerNodeExcluded instead", "3.1.0")
 */
export class SparkListenerNodeBlacklisted extends SparkEvent {

  // @JsonProperty("Timestamp")
  time: Date;

  hostId: string;

  executorFailures: number;

  constructor(eventNum: number, time: Date, hostId: string, executorFailures: number) {
    super(eventNum);
    this.time = time;
    this.hostId = hostId;
    this.executorFailures = executorFailures;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerNodeBlacklisted {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    let executorFailures = <number> src['Executor Failures'];
    return new SparkListenerNodeBlacklisted(eventNum, time, hostId, executorFailures);
  }

  getEvent(): string { return 'SparkListenerNodeBlacklisted'; }
  getEventShortName(): string { return 'NodeBlacklisted'; }

  override getTime(): Date|undefined { return this.time; }

  override isExecutorLifecycleEvents() { return true; }
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

  constructor(eventNum: number, time: Date, hostId: string, executorFailures: number) {
    super(eventNum);
    this.time = time;
    this.hostId = hostId;
    this.executorFailures = executorFailures;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerNodeExcluded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    let executorFailures = <number> src['Executor Failures'];
    return new SparkListenerNodeExcluded(eventNum, time, hostId, executorFailures);
  }

  getEvent(): string { return 'SparkListenerNodeExcluded'; }
  getEventShortName(): string { return 'NodeExcluded'; }

  override getTime(): Date|undefined { return this.time; }

  override isExecutorLifecycleEvents() { return true; }
}

/**
 * @deprecated("use SparkListenerNodeUnexcluded instead", "3.1.0")
 */
export class SparkListenerNodeUnblacklisted extends SparkEvent {

  // @JsonProperty("Timestamp")
  readonly time: Date;

  readonly hostId: string;

  constructor(eventNum: number, time: Date, hostId: string) {
    super(eventNum);
    this.time = time;
    this.hostId = hostId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerNodeUnblacklisted {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    return new SparkListenerNodeUnblacklisted(eventNum, time, hostId);
  }

  getEvent(): string { return 'SparkListenerNodeUnblacklisted'; }
  getEventShortName(): string { return 'NodeUnblacklisted'; }

  override getTime(): Date|undefined { return this.time; }
  override getHostId(): string { return this.hostId; }

  override isExecutorLifecycleEvents() { return true; }
}

/**
 * @Since("3.1.0")
 */
export class SparkListenerNodeUnexcluded extends SparkEvent {

  // @JsonProperty("Timestamp")
  time: Date;

  hostId: string;

  constructor(eventNum: number, time: Date, hostId: string) {
    super(eventNum);
    this.time = time;
    this.hostId = hostId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerNodeUnexcluded {
    let timeObj = <number> src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    let hostId = <string> src['Host'];
    return new SparkListenerNodeUnexcluded(eventNum, time, hostId);
  }

  getEvent(): string { return 'SparkListenerNodeUnexcluded'; }
  getEventShortName(): string { return 'NodeUnexcluded'; }

  override getTime(): Date { return this.time; }
  override getHostId(): string { return this.hostId; }

  override isExecutorLifecycleEvents() { return true; }
}

/**
 * @Since("3.1.0")
 */
export class SparkListenerUnschedulableTaskSetAdded extends SparkEvent {

  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;

  constructor(eventNum: number, stageId: number, stageAttemptId: number) {
    super(eventNum);
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerUnschedulableTaskSetAdded {
    let stageId = <number>src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID']
    return new SparkListenerUnschedulableTaskSetAdded(eventNum, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerUnschedulableTaskSetAdded'; }
  getEventShortName(): string { return 'UnschedulableTaskSetAdded'; }

  override getStageId(): number { return this.stageId; }
  override getStageAttemptId(): number { return this.stageAttemptId; }

}

/**
 * @Since("3.1.0")
 */
export class SparkListenerUnschedulableTaskSetRemoved extends SparkEvent {
  // @JsonProperty("Stage ID")
  stageId: number;

  // @JsonProperty("Stage Attempt ID")
  stageAttemptId: number;

  constructor(eventNum: number, stageId: number, stageAttemptId: number) {
    super(eventNum);
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerUnschedulableTaskSetRemoved {
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number> src['Stage Attempt ID']
    return new SparkListenerUnschedulableTaskSetRemoved(eventNum, stageId, stageAttemptId);
  }

  getEvent(): string { return 'SparkListenerUnschedulableTaskSetRemoved'; }
  getEventShortName(): string { return 'UnschedulableTaskSetRemoved'; }

  override getStageId(): number { return this.stageId; }

}

/**
 *
 */
export class SparkListenerBlockUpdated extends SparkEvent {

  readonly blockUpdatedInfo: BlockUpdatedInfo;

  constructor(eventNum: number, blockUpdatedInfo: BlockUpdatedInfo) {
    super(eventNum);
    this.blockUpdatedInfo = blockUpdatedInfo;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerBlockUpdated {
    let blockUpdatedInfoObj = src['Block Updated Info'];
    let blockUpdatedInfo = (blockUpdatedInfoObj)? BlockUpdatedInfo.fromJson(blockUpdatedInfoObj) : BlockUpdatedInfo.createDefault();
    return new SparkListenerBlockUpdated(eventNum, blockUpdatedInfo);
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
  static readonly SHORT_EVENT_NAME = 'Executor MetricsUpdate';

  readonly execId: string;

  readonly accumUpdates: AccumUpdate[];

  // TODO ??? Map<Object/* (Int, Int) */, ExecutorMetrics> executorUpdates;
  readonly executorUpdates: ExecutorMetrics[];

  constructor(eventNum: number, execId: string, accumUpdates: AccumUpdate[], executorUpdates: ExecutorMetrics[]) {
    super(eventNum);
    this.execId = execId;
    this.accumUpdates = accumUpdates;
    this.executorUpdates = executorUpdates;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerExecutorMetricsUpdate {
    let execId = <string> src['Exec ID'];
    let accumUpdatesObj = src['Accum Update'];
    let accumUpdates = (accumUpdatesObj)? AccumUpdate.fromJsonArray(accumUpdatesObj): [];
    let executorUpdatesObj = src['Executor Updates'];
    let executorUpdates = (executorUpdatesObj)? ExecutorMetrics.fromJsonArray(executorUpdatesObj) : [];
    return new SparkListenerExecutorMetricsUpdate(eventNum, execId, accumUpdates, executorUpdates);
  }

  getEvent(): string { return 'SparkListenerExecutorMetricsUpdate'; }
  getEventShortName(): string { return SparkListenerExecutorMetricsUpdate.SHORT_EVENT_NAME; }

  override getExecutorId(): string { return this.execId; }

  override isExecutorLifecycleEvents() { return true; }

}

/**
 * Peak metric values for the executor for the stage, written to the history log
 * at stage completion.
 */
export class SparkListenerStageExecutorMetrics extends SparkEvent {

  readonly execId: string;

  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly stageAttemptId: number;

  readonly executorMetrics: ExecutorMetrics;

  constructor(eventNum: number, execId: string, stageId: number, stageAttemptId: number, executorMetrics: ExecutorMetrics) {
    super(eventNum);
    this.execId = execId;
    this.stageId = stageId;
    this.stageAttemptId = stageAttemptId;
    this.executorMetrics = executorMetrics;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerStageExecutorMetrics {
    let execId = <string> src['Exec ID'];
    let stageId = <number> src['Stage ID'];
    let stageAttemptId = <number>src['Stage Attempt ID'];
    let executorMetricsObj = src['Executor Metrics'];
    let executorMetrics = (executorMetricsObj)? ExecutorMetrics.fromJson(executorMetricsObj) : ExecutorMetrics.createDefault();
    return new SparkListenerStageExecutorMetrics(eventNum, execId, stageId, stageAttemptId, executorMetrics);
  }

  getEvent(): string { return 'SparkListenerStageExecutorMetrics'; }
  getEventShortName(): string { return 'StageExecutorMetrics'; }

  override getExecutorId(): string { return this.execId; }

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

  constructor(eventNum: number, appName: string,
    appId: string|null,
    time: Date,
    sparkUser: string,
    appAttemptId: string|null,
    driverLogs: Map<string,string>|null,
    driverAttributes: Map<string,string>|null
    ) {
    super(eventNum);
    this.appName = appName;
    this.appId = appId;
    this.time = time;
    this.sparkUser = sparkUser;
    this.appAttemptId = appAttemptId;
    this.driverLogs = driverLogs;
    this.driverAttributes = driverAttributes;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerApplicationStart {
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
    return new SparkListenerApplicationStart(eventNum, appName, appId, time, sparkUser, appAttemptId, driverLogs, driverAttributes);
  }

  getEvent(): string { return 'SparkListenerApplicationStart'; }
  getEventShortName(): string { return 'Application Start'; }

  override getTime(): Date|undefined { return this.time; }

  override isApplicationLifecycleEvents() { return true; }

}

/**
 *
 */
export class SparkListenerApplicationEnd extends SparkEvent {

  // @JsonProperty("Timestamp")
  readonly time: Date;

  constructor(eventNum: number, time: Date) {
    super(eventNum);
    this.time = time;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerApplicationEnd {
    let timeObj = src['Timestamp'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    return new SparkListenerApplicationEnd(eventNum, time);
  }

  getEvent(): string { return 'SparkListenerApplicationEnd'; }
  getEventShortName(): string { return 'Application End'; }

  override getTime(): Date|undefined { return this.time; }

  override isApplicationLifecycleEvents() { return true; }

}

/**
 * An internal class that describes the metadata of an event log.
 * example: {"Event":"SparkListenerLogStart","Spark Version":"3.1.1"}
 */
export class SparkListenerLogStart extends SparkEvent {

  // @JsonProperty("Spark Version")
  readonly version: string;

  constructor(eventNum: number, version: string) {
    super(eventNum);
    this.version = version;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerLogStart {
    let version = <string> src['Spark Version'];
    return new SparkListenerLogStart(eventNum, version);
  }

  getEvent(): string { return 'SparkListenerLogStart'; }
  getEventShortName(): string { return 'LogStart'; }

  override isApplicationLifecycleEvents() { return true; }

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

  static fromJson( eventNum: number, src: any ): ExecutorResourceRequest {
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

  constructor(eventNum: number, resourceProfileId: number, executorResourceRequests: Map<string, ExecutorResourceRequest>,
      taskResourceRequests: Map<string, ExecutorResourceRequest>) {
    super(eventNum);
    this.resourceProfileId = resourceProfileId;
    this.executorResourceRequests = executorResourceRequests;
    this.taskResourceRequests = taskResourceRequests;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerResourceProfileAdded {
    let resourceProfileId = <number> src['Resource Profile Id'];
    let executorResourceRequestsObj = src['Executor Resource Requests'];
    let executorResourceRequests = new Map(); // TOADD
    console.log('TODO SparkListenerResourceProfileAdded.executorResourceRequests', executorResourceRequestsObj);
    let taskResourceRequestsObj = src['Task Resource Requests'];
    let taskResourceRequests = new Map(); // TOADD
    // console.log('TODO SparkListenerResourceProfileAdded.taskResourceRequests', taskResourceRequestsObj);
    return new SparkListenerResourceProfileAdded(eventNum, resourceProfileId, executorResourceRequests, taskResourceRequests);
  }

  getEvent(): string { return 'SparkListenerResourceProfileAdded'; }
  getEventShortName(): string { return 'ResourceProfileAdded'; }

  override isApplicationLifecycleEvents() { return true; }

}

// cf spark source: sql/core/src/main/scala/org/apache/spark/sql/execution/ui/SQLListener.scala
// --------------------------------------------------------------------------------------------

export class SparkListenerSQLAdaptiveExecutionUpdate extends SparkEvent {

  readonly executionId: number;

  readonly physicalPlanDescription: string;

  readonly sparkPlanInfo: SparkPlanInfo;

  constructor(eventNum: number, executionId: number, physicalPlanDescription: string, sparkPlanInfo: SparkPlanInfo) {
    super(eventNum);
    this.executionId = executionId;
    this.physicalPlanDescription = physicalPlanDescription;
    this.sparkPlanInfo = sparkPlanInfo;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerSQLAdaptiveExecutionUpdate {
    let executionId = <number> src['executionId'];
    let physicalPlanDescription = src['physicalPlanDescription'];
    let sparkPlanInfoObj = src['sparkPlanInfo'];
    let sparkPlanInfo = (sparkPlanInfoObj)? SparkPlanInfo.fromJson(sparkPlanInfoObj) : SparkPlanInfo.createDefault();
    return new SparkListenerSQLAdaptiveExecutionUpdate(eventNum, executionId, physicalPlanDescription, sparkPlanInfo);
  }

  getEvent(): string { return 'SparkListenerSQLAdaptiveExecutionUpdate'; }
  getEventShortName(): string { return 'SQLAdaptiveExecutionUpdate'; }

  override getDisplaySummary(): string {
    return 'executionId: ' + this.executionId;
  }

  override getSQLExecId(): number { return this.executionId; }

  override isSqlAdaptiveExecutionUpdateEvent(): boolean { return true; }

  override getSparkPlanInfoOpt(): SparkPlanInfo { return this.sparkPlanInfo; }
  override getPhysicalPlanDescription(): string { return this.physicalPlanDescription; }
}

/**
 *
 */
export class SparkListenerSQLAdaptiveSQLMetricUpdates extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'SQLAdaptiveSQLMetricUpdates';

  readonly executionId: number;

  readonly sqlPlanMetrics: SQLPlanMetric[];

  constructor(eventNum: number, executionId: number, sqlPlanMetrics: SQLPlanMetric[]) {
    super(eventNum);
    this.executionId = executionId;
    this.sqlPlanMetrics = sqlPlanMetrics;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerSQLAdaptiveSQLMetricUpdates {
    let executionId = <number> src['executionId'];
    let sqlPlanMetricsObj = src['sqlPlanMetrics'];
    let sqlPlanMetrics = (sqlPlanMetricsObj)? SQLPlanMetric.fromJsonArray(sqlPlanMetricsObj) : [];
    return new SparkListenerSQLAdaptiveSQLMetricUpdates(eventNum, executionId, sqlPlanMetrics);
  }

  getEvent(): string { return 'SparkListenerSQLAdaptiveSQLMetricUpdates'; }
  getEventShortName(): string { return SparkListenerSQLAdaptiveSQLMetricUpdates.SHORT_EVENT_NAME; }

  override getDisplaySummary(): string {
    return 'executionId: ' + this.executionId;
  }

  override getSQLExecId(): number { return this.executionId; }

}

/**
 *
 */
export class SparkListenerSQLExecutionStart extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'SQLExecutionStart';

  readonly executionId: number

  readonly description: string;

  readonly details: string;

  readonly physicalPlanDescription: string;

  readonly sparkPlanInfo: SparkPlanInfo;

  readonly time: Date;

  constructor(eventNum: number, executionId: number, description: string, details: string, physicalPlanDescription: string, sparkPlanInfo: SparkPlanInfo, time: Date) {
    super(eventNum);
    this.executionId = executionId;
    this.description = description;
    this.details = details;
    this.physicalPlanDescription = physicalPlanDescription;
    this.sparkPlanInfo = sparkPlanInfo;
    this.time = time;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerSQLExecutionStart{
    let executionId = <number> src['executionId'];
    let description = <string> src['description'];
    let details = <string> src['details'];
    let physicalPlanDescription = <string> src['physicalPlanDescription'];
    let sparkPlanInfoObj = src['sparkPlanInfo'];
    let sparkPlanInfo = (sparkPlanInfoObj)? SparkPlanInfo.fromJson(sparkPlanInfoObj) : SparkPlanInfo.createDefault();
    let timeObj = <number> src['time'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    return new SparkListenerSQLExecutionStart(eventNum, executionId, description, details, physicalPlanDescription, sparkPlanInfo, time);
  }

  getEvent(): string { return 'SparkListenerSQLExecutionStart'; }
  getEventShortName(): string { return SparkListenerSQLExecutionStart.SHORT_EVENT_NAME; }

  override getDisplaySummary(): string {
    return 'executionId: ' + this.executionId;
  }

  override getTime(): Date|undefined { return this.time; }
  override getSQLExecId(): number { return this.executionId; }

  override isSqlStartEvent(): boolean { return true; }

  override getSparkPlanInfoOpt(): SparkPlanInfo|undefined { return this.sparkPlanInfo; }
  override getPhysicalPlanDescription(): string { return this.physicalPlanDescription; }
  override getCallSiteDetail(): string { return this.details; }
  override getDescription(): string|undefined { return this.description; }

}

/**
 *
 */
export class SparkListenerSQLExecutionEnd extends SparkEvent {
  static readonly SHORT_EVENT_NAME = 'SQLExecutionEnd';

  executionId: number;

  time: Date;

  constructor(eventNum: number, executionId: number, time: Date) {
    super(eventNum);
    this.executionId = executionId;
    this.time = time;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerSQLExecutionEnd {
    let executionId = <number> src['executionId'];
    let timeObj = <number> src['time'];
    let time = (timeObj)? new Date(timeObj) : new Date();
    return new SparkListenerSQLExecutionEnd(eventNum, executionId, time);
  }

  getEvent(): string { return 'SparkListenerSQLExecutionEnd'; }
  getEventShortName(): string { return SparkListenerSQLExecutionEnd.SHORT_EVENT_NAME; }

  override getDisplaySummary(): string {
    return 'executionId: ' + this.executionId;
  }

  override getTime(): Date|undefined { return this.time; }
  override getSQLExecId(): number { return this.executionId; }

  override isSqlEndEvent(): boolean { return true; }
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
    static readonly SHORT_EVENT_NAME = 'DriverAccumUpdates';

  readonly executionId: number

  // example json: [ [144,13],[145,3] ]
  readonly accumUpdates: AccumUpdateValue[];

  constructor(eventNum: number, executionId: number, accumUpdates: AccumUpdateValue[]) {
    super(eventNum);
    this.executionId = executionId;
    this.accumUpdates = accumUpdates;
  }

  static fromJson( eventNum: number, src: any ): SparkListenerDriverAccumUpdates {
    let executionId = <number> src['executionId'];
    let accumUpdatesObj = src['accumUpdates'];
    let accumUpdates = (accumUpdatesObj)? AccumUpdateValue.fromJsonArray(accumUpdatesObj) : [];
    return new SparkListenerDriverAccumUpdates(eventNum, executionId, accumUpdates);
  }

  getEvent(): string { return 'SparkListenerDriverAccumUpdates'; }
  getEventShortName(): string { return 'DriverAccumUpdates'; }

  override getDisplaySummary(): string {
    return 'executionId: ' + this.executionId;
  }

	override getSQLExecId(): number { return this.executionId; }
}
