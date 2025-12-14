import {
  SparkListenerDriverAccumUpdates, SparkListenerEnvironmentUpdate,
  SparkListenerJobEnd,
  SparkListenerJobStart,
  SparkListenerSQLAdaptiveExecutionUpdate,
  SparkListenerSQLAdaptiveSQLMetricUpdates,
  SparkListenerSQLExecutionEnd,
  SparkListenerSQLExecutionStart,
  SparkListenerStageCompleted,
  SparkListenerStageSubmitted,
  SparkListenerTaskEnd,
  SparkListenerTaskGettingResult,
  SparkListenerTaskStart
} from '../sparkevents/SparkEvent';
import JobTracker from './JobTracker';
import {SparkPlanInfo} from '../sparkevents/SparkPlanInfo';
import {TaskTracker} from './TaskTracker';
import StageTracker from './StageTracker';
import {SparkPlanTree} from '../sql/SparkPlanNodeTree';
import {DefaultSparkPlanInfoModelAdapter} from '../sql/SparkPlanNodeBuilder';

/**
 * event tracker for SQL execution
 */
export class SqlExecTracker {
  readonly sqlId: number;

  environmentUpdateEvent: SparkListenerEnvironmentUpdate|undefined;
  executorCores: number = 1;

  startEvent: SparkListenerSQLExecutionStart|undefined;

  readonly sqlAdaptiveExecUpdates: SparkListenerSQLAdaptiveExecutionUpdate[] = [];
  readonly sqlAdaptiveMetricUpdates: SparkListenerSQLAdaptiveSQLMetricUpdates[] = [];
  readonly driverAccumUpdates: SparkListenerDriverAccumUpdates[] = [];

  readonly jobs: JobTracker[] = [];
  activeJobs = new Map<number,JobTracker>();

  endEvent: SparkListenerSQLExecutionEnd|undefined;

  currPlanInfo: SparkPlanInfo|undefined; // TODO remove
  currPlanInfoTree: SparkPlanTree|undefined;

  //-----------------------------------------------------------------------------------------------

  constructor(sqlId: number) {
    this.sqlId = sqlId;
  }

  //---------------------------------------------------------------------------------------------

  onSetContextEnvironment(event: SparkListenerEnvironmentUpdate, executorCore: number) {
    this.environmentUpdateEvent = event;
    this.executorCores = executorCore;
    // console.log('SqlExecTracker.onSetContextEnvironment, executorCore:', this.executorCore);
  }

  onStartEvent(event: SparkListenerSQLExecutionStart) {
    this.startEvent = event;
    this.setCurrPlanInfo(event.sparkPlanInfo);
  }

  onSQLAdaptiveExecutionUpdateEvent(event: SparkListenerSQLAdaptiveExecutionUpdate) {
    this.sqlAdaptiveExecUpdates.push(event);
    this.setCurrPlanInfo(event.sparkPlanInfo);
  }

  private setCurrPlanInfo(planInfo: SparkPlanInfo) {
    this.currPlanInfo = planInfo;
    if (planInfo) {
      // re-copy previous metricValueHolders to new tree
      const previousTree = this.currPlanInfoTree;
      const modelAdapter = new DefaultSparkPlanInfoModelAdapter();
      this.currPlanInfoTree = new SparkPlanTree(planInfo, modelAdapter, previousTree);
    }
  }

  onSQLAdaptiveMetricUpdatesEvent(event: SparkListenerSQLAdaptiveSQLMetricUpdates) {
    this.sqlAdaptiveMetricUpdates.push(event);
    const planMetrics = event.sqlPlanMetrics;
    // TODO
    console.log('onSQLAdaptiveMetricUpdatesEvent, sqlPlanMetrics:', planMetrics);
  }

  onSQLDriverAccumUpdatesEvent(event: SparkListenerDriverAccumUpdates) {
    this.driverAccumUpdates.push(event);
    const accumUpdates = event.accumUpdates;
    // console.log('onSQLDriverAccumUpdatesEvent, accumUpdates:', accumUpdates);
    if (this.currPlanInfoTree) {
      this.currPlanInfoTree.onDriverAccumUpdatesEvent(event, accumUpdates);
    }
  }

  onEndEvent(event: SparkListenerSQLExecutionEnd) {
    this.endEvent = event;
  }

  onChildJobStart(job: JobTracker, event: SparkListenerJobStart) {
    this.activeJobs.set(job.jobId, job);
    this.jobs.push(job);
  }

  onChildJobEnd(job: JobTracker, event: SparkListenerJobEnd) {
    // const job = this.activeJobs.get(job.jobId);
    this.activeJobs.delete(job.jobId);
    if (! job) {
      // console.log('should not occur: unknown job end');
      return;
    }
  }

  onChildStageSubmitted(stage: StageTracker, event: SparkListenerStageSubmitted) {
    // ignore?
  }

  onChildStageCompleted(stage: StageTracker, event: SparkListenerStageCompleted) {
    // ignore?

  }

  onChildTaskStart(task: TaskTracker, event: SparkListenerTaskStart) {
    // ignore?
  }

  onChildTaskEnd(task: TaskTracker, event: SparkListenerTaskEnd) {
    // ignore?
    const accumulables = event.taskInfo.accumulables;
    const taskMetrics = event.taskMetrics;
    if (taskMetrics) {
      // console.log('SqlExecTracker.onChildTaskEnd, taskMetrics:', taskMetrics);
    }
    if (accumulables) {
      if (this.currPlanInfoTree) {
        this.currPlanInfoTree.onChildTaskEndMetricValueUpdates(task, event, accumulables);
      }
    }
  }

  onChildTaskGettingResult(task: TaskTracker, event: SparkListenerTaskGettingResult) {
    // ignore?
  }


}
