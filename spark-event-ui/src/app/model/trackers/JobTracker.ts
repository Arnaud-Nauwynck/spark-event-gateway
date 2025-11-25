import {
  SparkListenerJobEnd,
  SparkListenerJobStart, SparkListenerStageCompleted, SparkListenerStageSubmitted,
  SparkListenerTaskEnd,
  SparkListenerTaskGettingResult,
  SparkListenerTaskStart
} from '../sparkevents/SparkEvent';
import {SqlExecTracker} from './SqlExecTracker';
import StageTracker from './StageTracker';
import {TaskTracker} from './TaskTracker';

/**
 *
 */
class JobTracker {
  readonly jobId: number;

  readonly sqlExec: SqlExecTracker|undefined;

  startEvent: SparkListenerJobStart|undefined;

  stages: StageTracker[] = [];

  activeStage: StageTracker|undefined;

  endEvent: SparkListenerJobEnd|undefined;

  get startTime(): number {
    return this.startEvent?.time.getTime() ?? 0;
  }
  get endTime(): number {
    return this.endEvent?.time?.getTime() ?? 0;
  }

  //---------------------------------------------------------------------------------------------

  constructor(sqlExec: SqlExecTracker|undefined,
              jobId: number) {
    this.jobId = jobId;
    this.sqlExec = sqlExec;
  }

  //---------------------------------------------------------------------------------------------

  onJobStartEvent(event: SparkListenerJobStart) {
    this.startEvent = event;
    this.stages = event.stageInfos.map(stageInfo => new StageTracker(this, stageInfo));

    if (this.sqlExec) {
      this.sqlExec.onChildJobStart(this, event);
    }
  }

  onJobEnd(event: SparkListenerJobEnd) {
    this.endEvent = event;
    if (this.sqlExec) {
      this.sqlExec.onChildJobEnd(this, event);
    }
  }

  onChildStageSubmitted(stage: StageTracker, event: SparkListenerStageSubmitted) {
    if (this.activeStage !== stage) {
      // assert this.activeStage === undefined
      this.activeStage = stage;
    }
    if (this.sqlExec) {
      this.sqlExec.onChildStageSubmitted(stage, event);
    }
  }

  onChildStageCompleted(stage: StageTracker, event: SparkListenerStageCompleted) {
    if (this.activeStage === stage) {
      this.activeStage = undefined;
    }
    if (this.sqlExec) {
      this.sqlExec.onChildStageCompleted(stage, event);
    }
  }

  onChildTaskStart(task: TaskTracker, event: SparkListenerTaskStart) {
    // ignore?
    if (this.sqlExec) {
      this.sqlExec.onChildTaskStart(task, event);
    }
  }

  onChildTaskEnd(task: TaskTracker, event: SparkListenerTaskEnd) {
    // ignore?
    if (this.sqlExec) {
      this.sqlExec.onChildTaskEnd(task, event);
    }
  }

  onChildTaskGettingResult(task: TaskTracker, event: SparkListenerTaskGettingResult) {
    // ignore?
    if (this.sqlExec) {
      this.sqlExec.onChildTaskGettingResult(task, event);
    }
  }
}

export default JobTracker
