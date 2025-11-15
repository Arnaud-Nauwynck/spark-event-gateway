import { RDDInfo } from './RDDInfo';
import { TaskMetrics } from './TaskMetrics';
import { AccumulableInfo } from './AccumulableInfo';
import { SparkCtx } from './SparkCtx';

export class StageInfo {

  // @JsonProperty("Stage ID")
  readonly stageId: number;

  // @JsonProperty("Stage Attempt ID")
  readonly attemptId: number;

  // @JsonProperty("Stage Name")
  readonly name: string;

  // @JsonProperty("Number of Tasks")
  numTasks: number;

  // @JsonProperty("RDD Info")
  rddInfos: RDDInfo[];

  // @JsonProperty("Parent IDs")
  parentIds: number[];

  // @JsonProperty("Details")
  details: string;

  // @JsonProperty("Task Metrics")
  taskMetrics: TaskMetrics; // TOCHECK nullable?

  // @JsonProperty("Resource Profile Id")
  resourceProfileId: number;

  /** When this stage was submitted from the DAGScheduler to a TaskScheduler. */
  // @JsonProperty("Submission Time")
  submissionTime: Date | null;

  /** Time when all tasks in the stage completed or when the stage was cancelled. */
  // @JsonProperty("Completion Time")
  completionTime: Date | null;

  /** If the stage failed, the reason why. */
  // @JsonProperty("Failure Reason")
  failureReason: string | null;

  /** Terminal values of accumulables updated during this stage, including all the user-defined accumulators. */
  // @JsonProperty("Accumulables")
  accumulables: AccumulableInfo[];

  // --------------------------------------------------------------------------

  constructor( stageId: number, attemptId: number, name: string,
      numTasks: number,
      rddInfos: RDDInfo[],
      parentIds: number[],
      details: string,
      taskMetrics: TaskMetrics,
      resourceProfileId: number,
      submissionTime: Date | null,
      completionTime: Date | null,
      failureReason: string | null,
      accumulables: AccumulableInfo[]) {
    this.stageId = stageId;
    this.attemptId = attemptId;
    this.name = name;
    this.numTasks = numTasks;
    this.rddInfos = rddInfos;
    this.parentIds = parentIds;
    this.details = details;
    this.taskMetrics = taskMetrics;
    this.resourceProfileId = resourceProfileId;
    this.submissionTime = submissionTime;
    this.completionTime = completionTime;
    this.failureReason = failureReason;
    this.accumulables = accumulables;
  }

  static fromJson(src: any ): StageInfo {
    let stageId = <number> src['Stage ID'];
    let attemptId = <number> src['Stage Attempt ID'];
    let name = <string> src['Stage Name'] ?? '';
    let numTasks = <number> src['Number of Tasks'];
    let rddInfosObj = <any[]> src['RDD Info'];
    let rddInfos = (rddInfosObj)? RDDInfo.fromJsonArray(rddInfosObj) : [];
    let parentIds = <number[]> src['Parent IDs'];
    let details = <string> src['Details'];
    let taskMetricsObj = src['Task Metrics'];
    let taskMetrics = (taskMetricsObj)? TaskMetrics.fromJson(taskMetricsObj) : TaskMetrics.createDefault();
    let resourceProfileId = <number> src['Resource Profile Id'];
    let submissionTimeObj = <number> src['Submission Time'];
    let submissionTime = (submissionTimeObj)? new Date(submissionTimeObj) : null;
    let completionTimeObj = <number> src['Completion Time'];
    let completionTime= (completionTimeObj)? new Date(completionTimeObj) : null;
    let failureReasonObj = src['Failure Reason'];
    let failureReason = (failureReasonObj)? <string> failureReasonObj : null;
    let accumulablesObj = src['Accumulables'];
    let accumulables = (accumulablesObj)? AccumulableInfo.fromJsonArray(accumulablesObj) : [];
    return new StageInfo( stageId, attemptId, name,
        numTasks, rddInfos, parentIds, details, taskMetrics, resourceProfileId, submissionTime, completionTime, failureReason, accumulables);
  }

  static fromJsonArray(src: any[] ): StageInfo[] {
      return src.map(x => StageInfo.fromJson(x));
  }

  static createDefault(): StageInfo {
    let stageId = 0;
    let attemptId = 0;
    let name = '';
    let numTasks = 0;
    let rddInfos: RDDInfo[] = [];
    let parentIds: number[] = [];
    let details = '';
    let taskMetrics = TaskMetrics.createDefault();
    let resourceProfileId = 0;
    let submissionTime = null;
    let completionTime = null;
    let failureReason = '';
    let accumulables: AccumulableInfo[] = [];
    return new StageInfo( stageId, attemptId, name,
        numTasks, rddInfos, parentIds, details, taskMetrics, resourceProfileId, submissionTime, completionTime, failureReason, accumulables);
  }

  getDisplaySummary(): string {
    var res = 'stageId:' + this.stageId;
    if (this.attemptId != 0) {
      res += ' attemptId:' + this.attemptId;
    }
    if (this.name) {
      res += ' "' + this.name + '"';
    }
    // TOADD..
    return res;
  }

}
