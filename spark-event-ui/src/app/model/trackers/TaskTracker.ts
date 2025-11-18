import {
  SparkListenerSpeculativeTaskSubmitted, SparkListenerTaskEnd,
  SparkListenerTaskGettingResult,
  SparkListenerTaskStart
} from '../sparkevents/SparkEvent';
import {StageTracker} from './StageTracker';

/**
 * event tracker for Task
 */
export class TaskTracker {

  taskId: number;
  stage: StageTracker;

  startEvent: SparkListenerTaskStart;

  speculativeSubmittedEvent: SparkListenerSpeculativeTaskSubmitted|undefined;

  gettingResultEvent: SparkListenerTaskGettingResult|undefined;

  endEvent: SparkListenerTaskEnd|undefined;

  get startTime(): Date|undefined { return this.startEvent?.taskInfo.launchTime; }
  get endTime(): Date|undefined|null { return this.endEvent?.taskInfo.finishTime; }

  //---------------------------------------------------------------------------------------------

  constructor(stage: StageTracker, startEvent: SparkListenerTaskStart) {
    this.taskId = startEvent.taskInfo.taskId;
    this.stage = stage;
    this.startEvent = startEvent;
    this.stage.onChildTaskStart(this);
  }

  //---------------------------------------------------------------------------------------------

  onTaskEnd(event: SparkListenerTaskEnd) {
    this.endEvent = event;
    this.stage.onChildTaskEnd(this);
  }
}
