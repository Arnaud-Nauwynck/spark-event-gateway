import {SparkListenerJobEnd, SparkListenerJobStart} from '../sparkevents/SparkEvent';
import {SqlExecTracker} from './SqlExecTracker';
import {StageTracker} from './StageTracker';

/**
 *
 */
export class JobTracker {
  readonly jobId: number;

  readonly sqlExec: SqlExecTracker|undefined;

  readonly startEvent: SparkListenerJobStart;

  readonly stages: StageTracker[] = [];

  activeStage: StageTracker|undefined;

  endEvent: SparkListenerJobEnd|undefined;

  //---------------------------------------------------------------------------------------------

  constructor(sqlExec: SqlExecTracker|undefined,
              startEvent: SparkListenerJobStart) {
    this.jobId = startEvent.jobId;
    this.sqlExec = sqlExec;
    this.startEvent = startEvent;
    this.stages = startEvent.stageInfos.map(stageInfo => new StageTracker(this, stageInfo));
  }

  //---------------------------------------------------------------------------------------------

  onJobEnd(event: SparkListenerJobEnd) {
    this.endEvent = event;
    if (this.sqlExec) {
      this.sqlExec.onChildJobEnd(this);
    }
  }

  onChildStageSubmitted(stage: StageTracker) {
    if (this.activeStage !== stage) {
      // assert this.activeStage === undefined
      this.activeStage = stage;
    }
  }

  onChildStageCompleted(stage: StageTracker) {
    if (this.activeStage === stage) {
      this.activeStage = undefined;
    }
  }

}
