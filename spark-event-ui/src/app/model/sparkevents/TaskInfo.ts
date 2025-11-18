import { AccumulableInfo } from './AccumulableInfo';
import { SparkCtx } from '../trackers/SparkCtx';

/**
 *
 */
export class TaskInfo {

  // @JsonProperty("Task ID")
  readonly taskId: number;

  // @JsonProperty("Index")
  readonly index: number;

  // @JsonProperty("Attempt")
  readonly attempt: number;

  // @JsonProperty("Launch Time")
  readonly launchTime: Date;

  // @JsonProperty("Executor ID")
  readonly executorId: string;

  // @JsonProperty("Host")
  readonly host: string;

  // @JsonProperty("Locality")
  locality: string;

  // @JsonProperty("Speculative")
  speculative: boolean;

  // @JsonProperty("Getting Result Time")
  gettingResultTime: Date | null;

  // @JsonProperty("Finish Time")
  finishTime: Date | null;

  // @JsonProperty("Failed")
  failed: boolean;

  // @JsonProperty("Killed")
  killed: boolean;

  // @JsonProperty("Accumulables")
  accumulables: AccumulableInfo[] | null;

  // --------------------------------------------------------------------------

  constructor(
    taskId: number,
    index: number,
    attempt: number,
    launchTime: Date,
    executorId: string,
    host: string,
    locality: string,
    speculative: boolean,
    gettingResultTime: Date | null,
    finishTime: Date | null,
    failed: boolean,
    killed: boolean,
    accumulables: AccumulableInfo[] | null
  ) {
    this.taskId = taskId;
    this.index = index,
      this.attempt = attempt;
    this.launchTime = launchTime;
    this.executorId = executorId;
    this.host = host;
    this.locality = locality;
    this.speculative = speculative;
    this.gettingResultTime = gettingResultTime;
    this.finishTime = finishTime;
    this.failed = failed;
    this.killed = killed;
    this.accumulables = accumulables;
  }

  static fromJson(src: any ): TaskInfo {
    let taskId = <number>src['Task ID'];
    let index = <number>src['Index'];
    let attempt = <number>src['Attempt'];
    let launchTime = new Date( <number>src['Launch Time'] );
    let executorId = <string>src['Executor ID'];
    let host = <string>src['Host'];
    let locality = <string>src['Locality'];
    let speculative = <boolean>src['Speculative'];
    let tmpGettingResultTime = <number>src['Getting Result Time'];
    let gettingResultTime = ( tmpGettingResultTime ) ? new Date( tmpGettingResultTime ) : null;
    let tmpFinishTime = <number>src['Finish Time'];
    let finishTime = ( tmpFinishTime ) ? new Date( tmpFinishTime ) : null;
    let failed = <boolean>src['Failed'];
    let killed = <boolean>src['Killed'];
    let tmpAccumulables = <any[]>src['Accumulables'];
    let accumulables = ( tmpAccumulables !== undefined ) ? AccumulableInfo.fromJsonArray( tmpAccumulables ) : null;
    return new TaskInfo( taskId,
      index,
      attempt,
      launchTime,
      executorId,
      host,
      locality,
      speculative,
      gettingResultTime,
      finishTime,
      failed,
      killed,
      accumulables );
  }

  getDisplaySummary(): string {
    var res = 'taskId:' + this.taskId
      + ((this.index != 0)? ' index:' + this.index : '')
      + ((this.attempt != 0)? ' attempt:' + this.attempt : '');

    //TOADD
//    // @JsonProperty("Launch Time")
//    readonly launchTime: Date;
//
//    // @JsonProperty("Executor ID")
//    readonly executorId: number;
//
//    // @JsonProperty("Host")
//    readonly host: string;
//
//    // @JsonProperty("Locality")
//    locality: string;
//
//    // @JsonProperty("Speculative")
//    speculative: boolean;
//
//    // @JsonProperty("Getting Result Time")
//    gettingResultTime: Date | null;
//
//    // @JsonProperty("Finish Time")
//    finishTime: Date | null;
//
//    // @JsonProperty("Failed")
//    failed: boolean;
//
//    // @JsonProperty("Killed")
//    killed: boolean;
//
//    // @JsonProperty("Accumulables")
//    accumulables: AccumulableInfo[] | null;

    return res;
  }
}
