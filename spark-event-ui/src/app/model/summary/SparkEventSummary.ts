import {
  SparkListenerApplicationEnd,
  SparkListenerApplicationStart,
  SparkListenerBlockManagerAdded,
  SparkListenerBlockManagerRemoved,
  SparkListenerEnvironmentUpdate,
  SparkListenerLogStart,
  SparkListenerResourceProfileAdded,
} from "../sparkevents/SparkEvent";
import {TemplateStringEntry} from '../templates/TemplateStringDictionary';
import {
  ExecutorInfo,
  NewCallSiteLongTemplateEventSummaryDTO,
  NewCallSiteShortTemplateEventSummaryDTO,
  NewPlanDescriptionTemplateEventSummaryDTO,
  SparkApplicationEndEventSummaryDTO,
  SparkApplicationStartEventSummaryDTO,
  SparkBlockManagerAddedEventSummaryDTO,
  SparkBlockManagerRemovedEventSummaryDTO,
  SparkEnvironmentUpdateEventSummaryDTO,
  SparkEventSummaryDTO,
  SparkExecutorAddedEventSummaryDTO,
  SparkExecutorExcludedEventSummaryDTO, SparkExecutorExcludedForStageEventSummaryDTO, SparkExecutorRemovedEventSummaryDTO,
  SparkExecutorUnexcludedEventSummaryDTO, SparkLogStartEventSummaryDTO, SparkNodeExcludedEventSummaryDTO,
  SparkNodeExcludedForStageEventSummaryDTO,
  SparkNodeUnexcludedEventSummaryDTO,
  SparkPlanInfoSummaryDTO,
  SparkResourceProfileAddedEventSummaryDTO, SparkSQLExecutionEventSummaryDTO,
  SparkTopLevelJobExecEventSummaryDTO,
} from '../../rest';
import {TemplatedString} from '../templates/TemplatedString';
import {CallSiteTemplated, TemplateDictionariesRegistry} from '../templates/TemplateDictionariesRegistry';
import {SparkPlanTree} from '../sql/SparkPlanNodeTree';
import {SummarySparkPlanInfoModelAdapter} from '../sql/SparkPlanNodeBuilder';


// Visitor
export interface SparkEventSummaryVisitor {
  onApplicationStart(e: SparkApplicationStartEventSummary): void;
  onApplicationEnd(e: SparkApplicationEndEventSummary): void;
  onLogStart(e: SparkLogStartEventSummary): void;
  onResourceProfileAdded(e: SparkResourceProfileAddedEventSummary): void;
  onEnvironmentUpdate(e: SparkEnvironmentUpdateEventSummary): void;

  onBlockManagerAdded(e: SparkBlockManagerAddedEventSummary): void;
  onBlockManagerRemoved(e: SparkBlockManagerRemovedEventSummary): void;
  onExecutorAdded(e: SparkExecutorAddedEventSummary): void;
  onExecutorRemoved(e: SparkExecutorRemovedEventSummary): void;
  onExecutorExcluded(e: SparkExecutorExcludedEventSummary): void;
  onExecutorExcludedForStage(e: SparkExecutorExcludedForStageEventSummary): void;
  onExecutorUnexcluded(e: SparkExecutorUnexcludedEventSummary): void;
  onNodeExcluded(e: SparkNodeExcludedEventSummary): void;
  onNodeExcludedForStage(e: SparkNodeExcludedForStageEventSummary): void;
  onNodeUnexcluded(e: SparkNodeUnexcludedEventSummary): void;

  onTopLevelJobExec(e: SparkTopLevelJobExecEventSummary): void;

  onSQLExecEnd(e: SparkSQLExecutionEventSummary): void;

  onNewCallSiteShortTemplate(e: NewCallSiteShortTemplateEventSummary): void;
  onNewCallSiteLongTemplate(e: NewCallSiteLongTemplateEventSummary): void;
  onNewPlanDescription(e: NewPlanDescriptionTemplateEventSummary): void;

  onUnrecognized(e: UnrecognizedSparkEventSummary): void;
}

export type SparkEventSummaryTypes = "ApplicationStart" |
  "ApplicationEnd" |
  "LogStart" |
  "ResourceProfileAdded" |
  "EnvUpdate" |
  "BlockManagerAdded" |
  "BlockManagerRemoved" |
  "ExecutorAdded" |
  "ExecutorRemoved" |
  "ExecutorExcluded" |
  "ExecutorExcludedForStage" |
  "ExecutorUnexcluded" |
  "NodeExcluded" |
  "NodeExcludedForStage" |
  "NodeUnexcluded" |
  "TopLevelJobExec" |
  "SQLExec" |
  "NewCallSiteShortTemplate" |
  "NewCallSiteLongTemplate" |
  "NewPlanDescriptionTemplate" |
  "Unknown";

/**
 *
 */
export abstract class SparkEventSummary {
  eventNum: number; // TODO useless?

  protected constructor(eventNum = 0) {
    this.eventNum = eventNum;
  }

  abstract accept(visitor: SparkEventSummaryVisitor): void;

  static fromTypeDTO(src: SparkEventSummaryDTO, dics: TemplateDictionariesRegistry): SparkEventSummary {
    switch (src.type) {
      case "ApplicationStart": return SparkApplicationStartEventSummary.fromDTO(<SparkApplicationStartEventSummaryDTO> src);
      case "ApplicationEnd": return SparkApplicationEndEventSummary.fromDTO(<SparkApplicationEndEventSummaryDTO> src);
      case "LogStart": return SparkLogStartEventSummary.fromDTO(<SparkLogStartEventSummaryDTO> src);
      case "ResourceProfileAdded": return SparkResourceProfileAddedEventSummary.fromDTO(<SparkResourceProfileAddedEventSummaryDTO> src);
      case "EnvUpdate": return SparkEnvironmentUpdateEventSummary.fromDTO(<SparkEnvironmentUpdateEventSummaryDTO> src);
      case "BlockManagerAdded": return SparkBlockManagerAddedEventSummary.fromDTO(<SparkBlockManagerAddedEventSummaryDTO> src);
      case "BlockManagerRemoved": return SparkBlockManagerRemovedEventSummary.fromDTO(<SparkBlockManagerRemovedEventSummaryDTO> src);
      case "ExecutorAdded": return SparkExecutorAddedEventSummary.fromDTO(<SparkExecutorAddedEventSummaryDTO> src);
      case "ExecutorRemoved": return SparkExecutorRemovedEventSummary.fromDTO(<SparkExecutorRemovedEventSummaryDTO> src);
      case "ExecutorExcluded": return SparkExecutorExcludedEventSummary.fromDTO(<SparkExecutorExcludedEventSummaryDTO> src);
      case "ExecutorExcludedForStage": return SparkExecutorExcludedForStageEventSummary.fromDTO(<SparkExecutorExcludedForStageEventSummaryDTO> src);
      case "ExecutorUnexcluded": return SparkExecutorUnexcludedEventSummary.fromDTO(<SparkExecutorUnexcludedEventSummaryDTO> src);
      case "NodeExcluded": return SparkNodeExcludedEventSummary.fromDTO(<SparkNodeExcludedEventSummaryDTO> src);
      case "NodeExcludedForStage": return SparkNodeExcludedForStageEventSummary.fromDTO(<SparkNodeExcludedForStageEventSummaryDTO> src);
      case "NodeUnexcluded": return SparkNodeUnexcludedEventSummary.fromDTO(<SparkNodeUnexcludedEventSummaryDTO> src);
      case "TopLevelJobExec": return SparkTopLevelJobExecEventSummary.fromDTO(<SparkTopLevelJobExecEventSummaryDTO> src, dics);
      case "SQLExec": return SparkSQLExecutionEventSummary.fromDTO(<SparkSQLExecutionEventSummaryDTO>src, dics);
      case "NewCallSiteShortTemplate": return NewCallSiteShortTemplateEventSummary.fromDTO(<NewCallSiteShortTemplateEventSummaryDTO> src, dics);
      case "NewCallSiteLongTemplate": return NewCallSiteLongTemplateEventSummary.fromDTO(<NewCallSiteLongTemplateEventSummaryDTO> src, dics);
      case "NewPlanDescriptionTemplate": return NewPlanDescriptionTemplateEventSummary.fromDTO(<NewPlanDescriptionTemplateEventSummaryDTO> src, dics);
      default: return new UnrecognizedSparkEventSummary(src); // should not occur
    }
  }

  get timeOpt(): number|undefined { return this.getTimeOpt(); }
  // get event(): SparkEvent|undefined { return this.getDisplayType(); }
  get displayType(): string { return this.getDisplayType(); }
  get descriptionText(): string { return this.getDescriptionText(); }
  get detailText(): string|undefined { return this.getDetailText(); }
  get durationOpt(): number|undefined { return this.getDurationOpt(); }

  abstract getType(): SparkEventSummaryTypes;

  getTimeOpt(): number|undefined { return undefined; }
  getTimeText(): string {
    const timeOpt = this.getTimeOpt();
    if (undefined === timeOpt) return '';
    return new Date(timeOpt!).toTimeString();
  }

  abstract getDisplayType(): string;
  abstract getDescriptionText(): string;
  getDetailText(): string|undefined { return undefined; }
  getDurationOpt(): number|undefined {return }

  isPseudoEvent(): boolean { return false; }

  asTopLevelJobExecEvent(): SparkTopLevelJobExecEventSummary|undefined { return undefined; }
  asSqlExecEvent(): SparkSQLExecutionEventSummary|undefined { return undefined; }

}

/**
 *
 */
export class UnrecognizedSparkEventSummary extends SparkEventSummary {
  static readonly TYPE = 'Unknown';

  readonly src: SparkEventSummaryDTO;

  constructor(src: SparkEventSummaryDTO) {
    super();
    this.src = src;
  }

  static fromDTO(src: SparkEventSummaryDTO): UnrecognizedSparkEventSummary {
    return new UnrecognizedSparkEventSummary(src);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onUnrecognized(this); }

  override getType(): SparkEventSummaryTypes { return UnrecognizedSparkEventSummary.TYPE; }

  override getDisplayType(): string { return "Unrecognized"; }
  override getDescriptionText(): string { return this.src.type; }

}

/**
 *
 */
export class SparkApplicationStartEventSummary extends SparkEventSummary {
  static readonly TYPE = 'ApplicationStart';
  public event: SparkListenerApplicationStart;

  constructor(event: SparkListenerApplicationStart) { super(event.eventNum); this.event = event; }

  static fromDTO(src: SparkApplicationStartEventSummaryDTO): SparkApplicationStartEventSummary {
    const event = SparkListenerApplicationStart.fromJson(src.event!.n!, src.event!);
    return new SparkApplicationStartEventSummary(event);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onApplicationStart(this); }

  override getType(): SparkEventSummaryTypes { return SparkApplicationStartEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.event.time.getTime(); }
  override getDisplayType(): string { return "Start App"; }
  override getDescriptionText(): string { return 'appId:' + this.event.appId; }

}

/**
 *
 */
export class SparkApplicationEndEventSummary extends SparkEventSummary {
  static readonly TYPE = 'ApplicationEnd';
  readonly event: SparkListenerApplicationEnd;

  constructor(event: SparkListenerApplicationEnd) { super(event.eventNum); this.event = event; }

  static fromDTO(src: SparkApplicationEndEventSummaryDTO) {
    const event = SparkListenerApplicationEnd.fromJson(0, src.event!);
    return new SparkApplicationEndEventSummary(event);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onApplicationEnd(this); }

  override getType(): SparkEventSummaryTypes { return SparkApplicationEndEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.event.time.getTime(); }
  override getDisplayType(): string { return "App End"; }
  override getDescriptionText(): string { return ''; }

}

/**
 *
 */
export class SparkLogStartEventSummary extends SparkEventSummary {
  static readonly TYPE = 'LogStart';
  readonly event: SparkListenerLogStart;

  constructor(event: SparkListenerLogStart) { super(event.eventNum); this.event = event; }
  accept(v: SparkEventSummaryVisitor): void { v.onLogStart(this); }

  static fromDTO(src: SparkLogStartEventSummaryDTO) {
    const event = SparkListenerLogStart.fromJson(src.event!.n!, src.event!);
    return new SparkLogStartEventSummary(event);
  }

  override getType(): SparkEventSummaryTypes { return SparkLogStartEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.event.getTime()?.getTime(); }
  override getDisplayType(): string { return "LogStart"; }
  override getDescriptionText(): string { return ''; }

}

/**
 *
 */
export class SparkResourceProfileAddedEventSummary extends SparkEventSummary {
  static readonly TYPE = 'ResourceProfileAdded';
  readonly event: SparkListenerResourceProfileAdded;

  constructor(event: SparkListenerResourceProfileAdded) { super(event.eventNum); this.event = event; }

  static fromDTO(src: SparkResourceProfileAddedEventSummaryDTO) {
    const event = SparkListenerResourceProfileAdded.fromJson(0, // src.event!.n!, TODO
      src.event!);
    return new SparkResourceProfileAddedEventSummary(event);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onResourceProfileAdded(this); }

  override getType(): SparkEventSummaryTypes { return SparkResourceProfileAddedEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.event.getTime()?.getTime(); }
  override getDisplayType(): string { return "ProfileAdded"; }
  override getDescriptionText(): string { return ''; }

}

/**
 *
 */
export class SparkEnvironmentUpdateEventSummary extends SparkEventSummary {
  static readonly TYPE = 'EnvUpdate';
  readonly event: SparkListenerEnvironmentUpdate;

  constructor(event: SparkListenerEnvironmentUpdate) { super(event.eventNum); this.event = event; }

  static fromDTO(src: SparkEnvironmentUpdateEventSummaryDTO) {
    const event = SparkListenerEnvironmentUpdate.fromJson(src.event!.n!, src.event!);
    return new SparkEnvironmentUpdateEventSummary(event);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onEnvironmentUpdate(this); }

  override getType(): SparkEventSummaryTypes { return SparkEnvironmentUpdateEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.event.getTime()?.getTime(); }
  override getDisplayType(): string { return "EnvironmentUpdate"; }
  override getDescriptionText(): string { return 'sparkProperties: ' + this.event.sparkProperties; }

}

/**
 *
 */
export class SparkBlockManagerAddedEventSummary extends SparkEventSummary {
  static readonly TYPE = 'BlockManagerAdded';
  readonly event: SparkListenerBlockManagerAdded;

  constructor(event: SparkListenerBlockManagerAdded) { super(event.eventNum); this.event = event; }

  static fromDTO(src: SparkBlockManagerAddedEventSummaryDTO) {
    const event = SparkListenerBlockManagerAdded.fromJson(src.event!.n!, src.event!);
    return new SparkBlockManagerAddedEventSummary(event);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onBlockManagerAdded(this); }

  override getType(): SparkEventSummaryTypes { return SparkBlockManagerAddedEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.event.getTime()?.getTime(); }
  override getDisplayType(): string { return "BlockManager Added"; }
  override getDescriptionText(): string { return 'executorId:' + this.event.blockManagerId.executorId; }

}

/**
 *
 */
export class SparkBlockManagerRemovedEventSummary extends SparkEventSummary {
  static readonly TYPE = 'BlockManagerRemoved';
  readonly event: SparkListenerBlockManagerRemoved;

  constructor(event: SparkListenerBlockManagerRemoved) { super(event.eventNum); this.event = event; }

  static fromDTO(src: SparkBlockManagerRemovedEventSummaryDTO) {
    const event = SparkListenerBlockManagerRemoved.fromJson(0, // TODO src.event!.n!,
      src.event!);
    return new SparkBlockManagerRemovedEventSummary(event);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onBlockManagerRemoved(this); }

  override getType(): SparkEventSummaryTypes { return SparkBlockManagerRemovedEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.event.getTime()?.getTime(); }
  override getDisplayType(): string { return "BlockManager Removed"; }
  override getDescriptionText(): string { return 'executorId:' + this.event.blockManagerId.executorId; }
}

/**
 *
 */
export class SparkExecutorAddedEventSummary extends SparkEventSummary {
  static readonly TYPE = 'ExecutorAdded';
  readonly t: number;
  readonly executorId: string;
  readonly executorInfo: ExecutorInfo;

  constructor(t: number, executorId: string, executorInfo: ExecutorInfo) {
    super();
    this.t = t;
    this.executorId = executorId;
    this.executorInfo = executorInfo;
  }

  static fromDTO(src: SparkExecutorAddedEventSummaryDTO): SparkExecutorAddedEventSummary {
    return new SparkExecutorAddedEventSummary(src.t!, src.execId!, src.executorInfo!);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onExecutorAdded(this); }

  override getType(): SparkEventSummaryTypes { return SparkExecutorAddedEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.t; }
  override getDisplayType(): string { return "Executor Added"; }
  override getDescriptionText(): string { return 'executorId:' + this.executorId; }

}

/**
 *
 */
export class SparkExecutorRemovedEventSummary extends SparkEventSummary {
  static readonly TYPE = 'ExecutorRemoved';
  readonly t: number;
  readonly executorId: string;
  readonly reason: string;

  constructor(src: SparkExecutorRemovedEventSummaryDTO) {
    super();
    this.t = src.t!;
    this.executorId = src.execId!;
    this.reason = src.reason!;
  }

  static fromDTO(src: SparkExecutorRemovedEventSummaryDTO) {
    return new SparkExecutorRemovedEventSummary(src);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onExecutorRemoved(this); }

  override getType(): SparkEventSummaryTypes { return SparkExecutorRemovedEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.t; }
  override getDisplayType(): string { return "Executor Removed"; }
  override getDescriptionText(): string { return 'executorId:' + this.executorId + ', reason:' + this.reason; }

}

/**
 *
 */
export class SparkExecutorExcludedEventSummary extends SparkEventSummary {
  static readonly TYPE = 'ExecutorExcluded';
  readonly t: number;
  readonly executorId: string;
  readonly taskFailures: number;

  constructor(src: SparkExecutorExcludedEventSummaryDTO) {
    super();
    this.t = src.t!;
    this.executorId = src.execId!;
    this.taskFailures = src.taskFailures!;
  }

  static fromDTO(src: SparkExecutorExcludedEventSummaryDTO) {
    return new SparkExecutorExcludedEventSummary(src);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onExecutorExcluded(this); }

  override getType(): SparkEventSummaryTypes { return SparkExecutorExcludedEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.t; }
  override getDisplayType(): string { return "Executor Excluded"; }
  override getDescriptionText(): string { return 'executorId:' + this.executorId; }

}

/**
 *
 */
export class SparkExecutorExcludedForStageEventSummary extends SparkEventSummary {
  private static readonly TYPE = 'ExecutorExcludedForStage';
  readonly t: number;
  readonly executorId: string;
  readonly stageId: number;
  readonly taskFailures: number;
  readonly stageAttemptId: number;

  constructor(src: SparkExecutorExcludedForStageEventSummaryDTO) {
    super();
    this.t = src.t!;
    this.executorId = src.execId!;
    this.stageId = src.stageId!;
    this.taskFailures = src.taskFailures!;
    this.stageAttemptId = src.stageAttemptId!;
  }

  static fromDTO(src: SparkExecutorExcludedForStageEventSummaryDTO): SparkExecutorExcludedForStageEventSummary {
    return new SparkExecutorExcludedForStageEventSummary(src);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onExecutorExcludedForStage(this); }


  override getType(): SparkEventSummaryTypes { return SparkExecutorExcludedForStageEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.t; }
  override getDisplayType(): string { return "Executor Excluded For Stage"; }
  override getDescriptionText(): string { return 'executorId:' + this.executorId; }

}

/**
 *
 */
export class SparkExecutorUnexcludedEventSummary extends SparkEventSummary {
  static readonly TYPE = 'ExecutorUnexcluded';
  readonly t: number;
  readonly executorId: string;

  constructor(src: SparkExecutorUnexcludedEventSummaryDTO) {
    super();
    this.t = src.t!;
    this.executorId = src.execId!;
  }

  static fromDTO(src: SparkExecutorUnexcludedEventSummaryDTO): SparkExecutorUnexcludedEventSummary {
    return new SparkExecutorUnexcludedEventSummary(src);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onExecutorUnexcluded(this); }

  override getType(): SparkEventSummaryTypes { return SparkExecutorUnexcludedEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.t; }
  override getDisplayType(): string { return "Executor UnExcluded"; }
  override getDescriptionText(): string { return 'executorId:' + this.executorId; }

}

/**
 *
 */
export class SparkNodeExcludedEventSummary extends SparkEventSummary {
  static readonly TYPE = 'NodeExcluded';
  readonly t: number;
  readonly hostId: string;
  readonly executorFailures: number;

  constructor(src: SparkNodeExcludedEventSummaryDTO) {
    super();
    this.t = src.t!;
    this.hostId = src.hostId!;
    this.executorFailures = src.executorFailures!;
  }

  static fromDTO(src: SparkNodeExcludedEventSummaryDTO): SparkNodeExcludedEventSummary {
    return new SparkNodeExcludedEventSummary(src);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onNodeExcluded(this); }

  override getType(): SparkEventSummaryTypes { return SparkNodeExcludedEventSummary.TYPE; }

  override getTimeOpt(): number|undefined { return this.t; }
  override getDisplayType(): string { return "Node Excluded"; }
  override getDescriptionText(): string { return 'host:' + this.hostId + ' failures:' + this.executorFailures; }
}

/**
 *
 */
export class SparkNodeExcludedForStageEventSummary extends SparkEventSummary {
  static readonly TYPE = 'NodeExcludedForStage';
  readonly t: number;
  readonly hostId: string;
  readonly executorFailures: number;
  readonly stageId: number;
  readonly stageAttemptId: number;

  constructor(src: SparkNodeExcludedForStageEventSummaryDTO) {
    super();
    this.t = src.t!;
    this.hostId = src.hostId!;
    this.stageId = src.stageId!;
    this.executorFailures = src.executorFailures!;
    this.stageAttemptId = src.stageAttemptId!;
  }

  static fromDTO(src: SparkNodeExcludedForStageEventSummaryDTO) {
    return new SparkNodeExcludedForStageEventSummary(src);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onNodeExcludedForStage(this); }

  override getType(): SparkEventSummaryTypes { return SparkNodeExcludedForStageEventSummary.TYPE; }

  override getTimeOpt(): number|undefined { return this.t; }
  override getDisplayType(): string { return "Node Excluded or Stage"; }
  override getDescriptionText(): string { return 'host:' + this.hostId + ' , stageId:' + this.stageId; }

}

/**
 *
 */
export class SparkNodeUnexcludedEventSummary extends SparkEventSummary {
  static readonly TYPE = 'NodeUnexcluded';
  readonly t: number;
  readonly hostId: string;

  constructor(src: SparkNodeUnexcludedEventSummaryDTO) {
    super();
    this.t = src.t!;
    this.hostId = src.hostId!;
  }

  static fromDTO(src: SparkNodeUnexcludedEventSummaryDTO): SparkNodeUnexcludedEventSummary {
    return new SparkNodeUnexcludedEventSummary(src);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onNodeUnexcluded(this); }

  override getType(): SparkEventSummaryTypes { return SparkNodeUnexcludedEventSummary.TYPE; }
  override getTimeOpt(): number|undefined { return this.t; }
  override getDisplayType(): string { return "Node UnExcluded"; }
  override getDescriptionText(): string { return 'host:' + this.hostId; }

}

// Job summaries
// -----------------------------------------------------------------------------------------------------------------

/**
 *
 */
export class SparkTopLevelJobExecEventSummary extends SparkEventSummary {
  static readonly TYPE = 'TopLevelJobExec';
  readonly jobId: number;
  readonly submitTime: number;
  // TODO
  // readonly propOverrides: KeyValueObject;
  readonly callSite: CallSiteTemplated;

  readonly duration: number;
  readonly result?: string; // TODO Enum ?
//  readonly resultEx?: SparkException;
  get submitTimeText(): string { return new Date(this.submitTime).toTimeString(); }

  constructor(src: SparkTopLevelJobExecEventSummaryDTO,
              callSite: CallSiteTemplated) {
    super();
    this.jobId = src.jobId!;
    this.submitTime = src.submitTime!;
    // this.propOverrides =
    this.callSite = callSite;

    this.duration = src.duration!;
    this.result = src.result;
    // this.resultEx = src.resultEx;
  }

  static fromDTO(src: SparkTopLevelJobExecEventSummaryDTO, dics: TemplateDictionariesRegistry): SparkTopLevelJobExecEventSummary {
    const callSite = dics.resolveCallSiteFromDTO(src.callSiteTemplated!);
    return new SparkTopLevelJobExecEventSummary(src, callSite);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onTopLevelJobExec(this); }

  override getType(): SparkEventSummaryTypes { return SparkTopLevelJobExecEventSummary.TYPE; }
  override asTopLevelJobExecEvent(): SparkTopLevelJobExecEventSummary { return this; }

  override getTimeOpt(): number|undefined { return this.submitTime; }
  override getDisplayType(): string { return "Job"; }
  override getDescriptionText(): string { return 'job:' + this.jobId; }
  override getDurationOpt(): number | undefined { return this.duration; }

}


// SQL summaries
// -----------------------------------------------------------------------------------------------------------------

/**
 *
 */
export class SparkSQLExecutionEventSummary extends SparkEventSummary {
  static readonly TYPE = 'SQLExec';
  readonly execId: number;

  // TODO
  readonly startTime: number;
  readonly callSite: CallSiteTemplated;
  // readonly modifiedConfigs: KeyValueObject;

  readonly lastSQLAdaptiveExecutionUpdateEvent?: unknown;
  readonly physicalPlanDescription: TemplatedString;
  readonly plan: SparkPlanInfoSummaryDTO;

  // lazy computed from plan DTO, for memory savings
  protected _planTree: SparkPlanTree|undefined;
  get planTree(): SparkPlanTree {
    if (! this._planTree) {
      const modelAdapter = new SummarySparkPlanInfoModelAdapter();
      this._planTree = new SparkPlanTree(this.plan, modelAdapter, undefined); // new SparkPlanInfoTree();
    }
    return this._planTree;
  }

  readonly endEventNum: number;
  readonly duration: number;
  readonly endErrorMessage?: string;

  get startTimeText(): string { return new Date(this.startTime).toTimeString(); }

  constructor(src: SparkSQLExecutionEventSummaryDTO,
              callSite: CallSiteTemplated,
              physicalPlanDescription: TemplatedString) {
    super(src.n!);
    this.execId = src.execId!;
    this.startTime = src.startTime!;
    this.callSite = callSite;
    this.lastSQLAdaptiveExecutionUpdateEvent = src.lastSQLAdaptiveExecutionUpdateEvent;
    this.physicalPlanDescription = physicalPlanDescription;
    this.plan = src.plan!; // TODO SparkPlanInfoSummary.fromDTO(src.plan!, dics);
    this.endEventNum = src.endEventNum!;
    this.duration = src.duration!;
    this.endErrorMessage = src.endErrorMessage;
  }

  static fromDTO(src: SparkSQLExecutionEventSummaryDTO, dics: TemplateDictionariesRegistry): SparkSQLExecutionEventSummary {
    const callSite = dics.resolveCallSiteFromDTO(src.callSiteTemplated!);
    const physicalPlanDescription = dics.planDescriptionDictionary.resolve(src.physicalPlanDescriptionTemplateId!);
    return new SparkSQLExecutionEventSummary(src, callSite, physicalPlanDescription);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onSQLExecEnd(this); }

  override getType(): SparkEventSummaryTypes { return SparkSQLExecutionEventSummary.TYPE; }
  override asSqlExecEvent(): SparkSQLExecutionEventSummary { return this; }

  override getTimeOpt(): number|undefined { return this.startTime; }
  override getDisplayType(): string { return "Sql"; }
  override getDescriptionText(): string { return 'sqlId:' + this.execId; }
  override getDurationOpt(): number | undefined { return this.duration; }

}

export default SparkSQLExecutionEventSummary

// Template internal summaries
// -----------------------------------------------------------------------------------------------------------------

/**
 *
 */
export class NewCallSiteShortTemplateEventSummary extends SparkEventSummary {
  static readonly TYPE = 'NewCallSiteLongTemplate';
  readonly templateEntry: TemplateStringEntry;

  constructor(templateEntry: TemplateStringEntry) {
    super(0);
    this.templateEntry = templateEntry;
  }

  static fromDTO(src: NewCallSiteShortTemplateEventSummaryDTO, dics: TemplateDictionariesRegistry): NewCallSiteShortTemplateEventSummary {
    const templateEntry = dics.callSiteShortDictionary.registerTemplateEntry(src.templateEntry!);
    return new NewCallSiteShortTemplateEventSummary(templateEntry);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onNewCallSiteShortTemplate(this); }

  override isPseudoEvent(): boolean { return true; }

  override getType(): SparkEventSummaryTypes { return NewCallSiteShortTemplateEventSummary.TYPE; }
  override getDisplayType(): string { return "First seen CallSite Short"; }
  override getDescriptionText(): string { return '(' + this.templateEntry.templateId + ') ' + this.templateEntry.template; }

}

/**
 *
 */
export class NewCallSiteLongTemplateEventSummary extends SparkEventSummary {
  static readonly TYPE = 'NewCallSiteShortTemplate';
  readonly templateEntry: TemplateStringEntry;

  constructor(templateEntry: TemplateStringEntry) {
    super(0);
    this.templateEntry = templateEntry;
  }

  static fromDTO(src: NewCallSiteLongTemplateEventSummaryDTO, dics: TemplateDictionariesRegistry): NewCallSiteLongTemplateEventSummary {
    const templateEntry = dics.callSiteLongDictionary.registerTemplateEntry(src.templateEntry!);
    return new NewCallSiteLongTemplateEventSummary(templateEntry);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onNewCallSiteLongTemplate(this); }

  override isPseudoEvent(): boolean { return true; }

  override getType(): SparkEventSummaryTypes { return NewCallSiteLongTemplateEventSummary.TYPE; }
  override getDisplayType(): string { return "First seen CallSite Long"; }
  override getDescriptionText(): string { return '(' + this.templateEntry.templateId + ') ' + this.templateEntry.template; }

}

/**
 *
 */
export class NewPlanDescriptionTemplateEventSummary extends SparkEventSummary {
  static readonly TYPE = 'NewPlanDescriptionTemplate';
  readonly templateEntry: TemplateStringEntry;

  constructor(templateEntry: TemplateStringEntry) {
    super(0);
    this.templateEntry = templateEntry;
  }

  static fromDTO(src: NewPlanDescriptionTemplateEventSummaryDTO, dics: TemplateDictionariesRegistry): NewPlanDescriptionTemplateEventSummary {
    const templateEntry = dics.planDescriptionDictionary.registerTemplateEntry(src.templateEntry!);
    return new NewPlanDescriptionTemplateEventSummary(templateEntry);
  }

  accept(v: SparkEventSummaryVisitor): void { v.onNewPlanDescription(this); }

  override isPseudoEvent(): boolean { return true; }

  override getType(): SparkEventSummaryTypes { return NewPlanDescriptionTemplateEventSummary.TYPE; }
  override getDisplayType(): string { return "First seen PlanDescription"; }
  override getDescriptionText(): string { return '(' + this.templateEntry.templateId + ') ' + this.templateEntry.template; }

}

