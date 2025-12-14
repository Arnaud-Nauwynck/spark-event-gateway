import {
  SparkListenerSpeculativeTaskSubmitted, SparkListenerTaskEnd,
  SparkListenerTaskGettingResult,
  SparkListenerTaskStart
} from '../sparkevents/SparkEvent';
import StageTracker from './StageTracker';

/**
 * event tracker for Task
 */
export class TaskTracker {

  taskId: number;
  stage: StageTracker;

  taskStartEvent: SparkListenerTaskStart|undefined;

  taskGettingResultEvent: SparkListenerTaskGettingResult|undefined;

  taskEndEvent: SparkListenerTaskEnd|undefined;

  get startTime(): number { return this.taskStartEvent?.taskInfo.launchTime?.getTime() || 0; }
  get endTime(): number { return this.taskEndEvent?.taskInfo.finishTime?.getTime() || this.startTime; }

  //---------------------------------------------------------------------------------------------

  constructor(stage: StageTracker, taskId: number) {
    this.taskId = taskId;
    this.stage = stage;
  }

  //---------------------------------------------------------------------------------------------

  onTaskStartEvent(event: SparkListenerTaskStart) {
    this.taskStartEvent = event;
    this.stage.onChildTaskStart(this, event);
  }

  onTaskEndEvent(event: SparkListenerTaskEnd) {
    this.taskEndEvent = event;
    this.stage.onChildTaskEnd(this, event);
  }

  onTaskGettingResultEvent(event: SparkListenerTaskGettingResult) {
    this.taskGettingResultEvent = event;
    this.stage.onChildTaskGettingResult(this, event);
  }

}
