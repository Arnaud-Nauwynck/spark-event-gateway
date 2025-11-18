import {
  SparkListenerSpeculativeTaskSubmitted,
  SparkListenerStageCompleted, SparkListenerStageExecutorMetrics,
  SparkListenerStageSubmitted, SparkListenerTaskEnd, SparkListenerTaskGettingResult,
  SparkListenerTaskStart
} from '../sparkevents/SparkEvent';
import {StageInfo} from '../sparkevents/StageInfo';
import {JobTracker} from './JobTracker';
import {TaskTracker} from './TaskTracker';
import {ExecutorTracker} from './ExecutorTracker';
import {ExecutorMetrics} from '../sparkevents/ExecutorMetrics';

/**
 *
 */
export class StageTracker {
  readonly stageId: number;
  readonly job: JobTracker;

  // stageInfo, from event SparkListenerJobStart
  stageInfo: StageInfo;

  submittedEvent: SparkListenerStageSubmitted|undefined;

  completedEvent: SparkListenerStageCompleted|undefined;

  activeTasks = new Map<number,TaskTracker>();

  //---------------------------------------------------------------------------------------------

  constructor(job: JobTracker,
              stageInfo: StageInfo) {
    this.stageId = stageInfo.stageId;
    this.job = job;
    this.stageInfo = stageInfo;
  }

  onSubmitted(event: SparkListenerStageSubmitted) {
    this.submittedEvent = event;
    this.job.onChildStageSubmitted(this);
  }

  onCompleted(event: SparkListenerStageCompleted) {
    this.completedEvent = event;
    this.job.onChildStageCompleted(this);
  }

  onChildTaskStart(task: TaskTracker) {
    this.activeTasks.set(task.taskId, task);
    const t = task.startTime;
    // increment stats..
  }

  onChildTaskEnd(task: TaskTracker) {
    this.activeTasks.delete(task.taskId);
    const t = task.endTime;
    // increment stats..
  }

  onChildExecutorMetrics(executor: ExecutorTracker, event: SparkListenerStageExecutorMetrics) {
    // const attemptId = event.stageAttemptId;
    const executorMetrics = event.executorMetrics;
    // Map<string,any>
    // TODO
  }
}

