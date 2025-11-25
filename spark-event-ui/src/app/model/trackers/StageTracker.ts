import {
  SparkListenerSpeculativeTaskSubmitted,
  SparkListenerStageCompleted,
  SparkListenerStageExecutorMetrics,
  SparkListenerStageSubmitted, SparkListenerTaskEnd, SparkListenerTaskGettingResult, SparkListenerTaskStart
} from '../sparkevents/SparkEvent';
import {StageInfo} from '../sparkevents/StageInfo';
import JobTracker from './JobTracker';
import {TaskTracker} from './TaskTracker';
import {ExecutorTracker} from './ExecutorTracker';

export class PerExecutorTaskSet {
  readonly executorId: string;
  tasks: TaskTracker[] = [];

  constructor(executorId: string) {
    this.executorId = executorId;
  }
}

/**
 *
 */
class StageTracker {
  readonly stageId: number;
  readonly job: JobTracker;

  // stageInfo, from event SparkListenerJobStart
  stageInfo: StageInfo;

  submittedEvent: SparkListenerStageSubmitted|undefined;

  speculativeSubmittedEvent: SparkListenerSpeculativeTaskSubmitted|undefined;

  completedEvent: SparkListenerStageCompleted|undefined;

  activeTasks = new Map<number,TaskTracker>();

  tasks: TaskTracker[] = [];
  perExecutorTaskSet: PerExecutorTaskSet[] = [];

  //---------------------------------------------------------------------------------------------

  constructor(job: JobTracker,
              stageInfo: StageInfo) {
    this.stageId = stageInfo.stageId;
    this.job = job;
    this.stageInfo = stageInfo;
  }

  onSubmitted(event: SparkListenerStageSubmitted) {
    this.submittedEvent = event;
    this.job.onChildStageSubmitted(this, event);
  }

  onSpeculativeTaskSubmittedEvent(event: SparkListenerSpeculativeTaskSubmitted) {
    this.speculativeSubmittedEvent = event;
    // this.job.onChildStageSpeculativeTaskSubmitted(this);
  }

  onCompleted(event: SparkListenerStageCompleted) {
    this.completedEvent = event;
    this.job.onChildStageCompleted(this, event);
  }

  onChildTaskStart(task: TaskTracker, event: SparkListenerTaskStart) {
    this.activeTasks.set(task.taskId, task);
    this.tasks.push(task);

    const executorId = event.taskInfo.executorId;
    let foundPerExec = this.perExecutorTaskSet.find(pe => pe.executorId === executorId);
    if (! foundPerExec) {
      foundPerExec = new PerExecutorTaskSet(executorId);
      this.perExecutorTaskSet.push(foundPerExec);
      // sort per executorId?
    }
    foundPerExec.tasks.push(task);


    const t = task.startTime;
    // increment stats..
    this.job.onChildTaskStart(task, event);
  }

  onChildTaskEnd(task: TaskTracker, event: SparkListenerTaskEnd) {
    this.activeTasks.delete(task.taskId);
    const t = task.endTime;
    // increment stats..
    this.job.onChildTaskEnd(task, event);
  }

  onChildTaskGettingResult(task: TaskTracker, event: SparkListenerTaskGettingResult) {
    this.job.onChildTaskGettingResult(task, event);
  }


  onChildExecutorMetrics(executor: ExecutorTracker, event: SparkListenerStageExecutorMetrics) {
    // const attemptId = event.stageAttemptId;
    const executorMetrics = event.executorMetrics;
    // Map<string,any>
    // TODO
  }

}

export default StageTracker

