import {ExecutorTracker} from './ExecutorTracker';
import {
  SparkEvent, SparkListenerApplicationEnd,
  SparkListenerApplicationStart,
  SparkListenerBlockManagerAdded,
  SparkListenerBlockManagerRemoved,
  SparkListenerBlockUpdated, SparkListenerDriverAccumUpdates,
  SparkListenerEnvironmentUpdate,
  SparkListenerExecutorAdded,
  SparkListenerExecutorBlacklisted,
  SparkListenerExecutorBlacklistedForStage,
  SparkListenerExecutorExcluded,
  SparkListenerExecutorExcludedForStage,
  SparkListenerExecutorMetricsUpdate,
  SparkListenerExecutorRemoved,
  SparkListenerExecutorUnblacklisted,
  SparkListenerExecutorUnexcluded,
  SparkListenerJobEnd,
  SparkListenerJobStart, SparkListenerLogStart,
  SparkListenerNodeBlacklisted,
  SparkListenerNodeBlacklistedForStage,
  SparkListenerNodeExcluded,
  SparkListenerNodeExcludedForStage,
  SparkListenerNodeUnblacklisted,
  SparkListenerNodeUnexcluded, SparkListenerResourceProfileAdded,
  SparkListenerSpeculativeTaskSubmitted, SparkListenerSQLAdaptiveExecutionUpdate,
  SparkListenerSQLAdaptiveSQLMetricUpdates, SparkListenerSQLExecutionEnd, SparkListenerSQLExecutionStart,
  SparkListenerStageCompleted,
  SparkListenerStageExecutorMetrics,
  SparkListenerStageSubmitted,
  SparkListenerTaskEnd,
  SparkListenerTaskGettingResult,
  SparkListenerTaskStart,
  SparkListenerUnpersistRDD,
  SparkListenerUnschedulableTaskSetAdded,
  SparkListenerUnschedulableTaskSetRemoved
} from '../sparkevents/SparkEvent';
import {SparkEventVisitor} from '../sparkevents/SparkEventVisitor';
import {JobTracker} from './JobTracker';
import {StageTracker} from './StageTracker';
import {TaskTracker} from './TaskTracker';
import {SqlExecTracker} from './SqlExecTracker';
import {ExecutorMetrics} from '../sparkevents/ExecutorMetrics';

/**
 * event tracker for SparkContext
 */
export class SparkContextTracker extends SparkEventVisitor {

  appStartEvent: SparkListenerApplicationStart|undefined;
  logStartEvent: SparkListenerLogStart|undefined;
  appEndEvent: SparkListenerApplicationEnd|undefined;

  executors = new Map<string,ExecutorTracker>();

  activeSqlExecs = new Map<number,SqlExecTracker>();
  activeJobs = new Map<number,JobTracker>();
  activeStages = new Map<number,StageTracker>();

  // useless?  (all task Start/End events contain stageId)
  activeTasks = new Map<number,TaskTracker>();

  //---------------------------------------------------------------------------------------------

  constructor() {
    super();
  }

  // handle (replay) events
  //---------------------------------------------------------------------------------------------

  onEvent(event: SparkEvent) {
    event.accept(this); // => call corresponding caseXyz(event)
  }

  //---------------------------------------------------------------------------------------------

  private shouldNotOccur(msg: string) {
    console.warn(msg);
  }

  private executor(executorId: string): ExecutorTracker {
    let res = this.executors.get(executorId);
    if (!res) {
      res = new ExecutorTracker(executorId);
      this.executors.set(executorId, res);
    }
    return res;
  }

  private sqlExecOpt(sqlId: number|undefined): SqlExecTracker|undefined {
    return (sqlId === undefined)? undefined : this.sqlExec(sqlId);
  }
  private sqlExec(sqlId: number): SqlExecTracker {
    let res = this.activeSqlExecs.get(sqlId);
    if (!res) {
      this.shouldNotOccur("sqlExec not found: " + sqlId + "..create");
      res = new SqlExecTracker(sqlId);
      this.activeSqlExecs.set(sqlId, res);
    }
    return res;
  }

  private activeStage(stageId: number): StageTracker|undefined {
    return this.activeStages.get(stageId);
  }

  //---------------------------------------------------------------------------------------------

  override caseApplicationStart(event: SparkListenerApplicationStart) {
    this.appStartEvent = event;
    //
  }

  override caseApplicationEnd(event: SparkListenerApplicationEnd) {
    this.appEndEvent = event;
  }

  override caseLogStart(event: SparkListenerLogStart) {
    this.logStartEvent = event;
  }

  override caseResourceProfileAdded(event: SparkListenerResourceProfileAdded) {}

  override caseJobStart(event: SparkListenerJobStart) {
    const sqlExec = this.sqlExecOpt(event.sqlExecId);
    const jobId = event.jobId;
    let job = this.activeJobs.get(jobId);
    if (!job) {
      job = new JobTracker(sqlExec, event); // => create stages StageTracker[]
      this.activeJobs.set(jobId, job);

      // => stage ids are created here (before stage submited)
      job.stages.forEach(stage => {
        this.activeStages.set(stage.stageInfo.stageId, stage);
      })
    } else {
      // should not occur, continue?
    }
  }

  override caseJobEnd(event: SparkListenerJobEnd) {
    const jobId = event.jobId;
    const job = this.activeJobs.get(jobId);
    if (job) {
      job.onJobEnd(event);
      job.stages.forEach(stage => {
        this.activeStages.delete(stage.stageId);

        // ?? stage.activeTasks
      })
      this.activeJobs.delete(jobId);
    }
  }


  override caseStageSubmitted(event: SparkListenerStageSubmitted) {
    const stageId = event.stageInfo.stageId;
    const stage = this.activeStage(stageId);
    if (stage) {
      stage.onSubmitted(event);
    } else {
      this.shouldNotOccur("stage not found for event StageSubmitted: " + stageId + "");
    }
  }

  override caseStageCompleted(event: SparkListenerStageCompleted) {
    const stageId = event.stageInfo.stageId;
    const stage = this.activeStage(stageId);
    if (stage) {
      stage.onCompleted(event);
      this.activeStages.delete(stageId);
    } else {
      this.shouldNotOccur("stage not found for event StageCompleted: " + stageId + "");
    }
  }

  override caseTaskStart(event: SparkListenerTaskStart) {
    const taskInfo = event.taskInfo;
    const taskId = taskInfo.taskId;
    const stage = this.activeStage(event.stageId);
    if (stage) {
      let task = this.activeTasks.get(taskId);
      if (!task) {
        task = new TaskTracker(stage, event); // => onStart()
      } else {
        this.shouldNotOccur("task already exists: " + taskId + "");
      }
      this.activeTasks.set(taskId, task);
    } else {
      this.shouldNotOccur("stage not found: " + event.stageId + ".. ignore TaskStart");
    }
  }

  override caseTaskGettingResult(event: SparkListenerTaskGettingResult) {
    // TODO
  }

  override caseSpeculativeTaskSubmitted(event: SparkListenerSpeculativeTaskSubmitted) {
    // TODO

  }

  override caseTaskEnd(event: SparkListenerTaskEnd) {
    const taskInfo = event.taskInfo;
    const taskId = taskInfo.taskId;
    const stage = this.activeStage(event.stageId);
    if (stage) {
      const task = this.activeTasks.get(taskId);
      if (task) {
        task.onTaskEnd(event);
      }
    }
  }


  override caseEnvironmentUpdate(event: SparkListenerEnvironmentUpdate) {}
  override caseBlockManagerAdded(event: SparkListenerBlockManagerAdded) {}
  override caseBlockManagerRemoved(event: SparkListenerBlockManagerRemoved) {}
  override caseUnpersistRDD(event: SparkListenerUnpersistRDD) {}

  override caseExecutorAdded(event: SparkListenerExecutorAdded) {
    const id = event.executorId;
    let exec = this.executors.get(id);
    if (! exec) {
      exec = new ExecutorTracker(id);
      this.executors.set(id, exec);
    } else {
      // should not occur, continue
    }
    exec.onExecutorAddedEvent(event);
  }

  override caseExecutorRemoved(event: SparkListenerExecutorRemoved) {
    const id = event.executorId;
    let exec = this.executors.get(id);
    if (exec) {
      exec.onExecutorRemovedEvent(event);
    } else {
      // should not occur, continue (ignore)
    }
  }

  override caseExecutorMetricsUpdate(event: SparkListenerExecutorMetricsUpdate) {
    const execId = event.execId;
    let exec = this.executors.get(execId);
    if (! exec) {
      // this.shouldNotOccur("update non-found executor .. create it");
      exec = new ExecutorTracker(execId);
      this.executors.set(execId, exec);
    }
    // const stageAttemptId = stageAttemptId;
    const accumUpdates = event.accumUpdates;
    const executorUpdates = event.executorUpdates;
    // TODO
  }

  override caseStageExecutorMetrics(event: SparkListenerStageExecutorMetrics) {
    const execId = event.execId;
    let exec = this.executors.get(execId);
    if (! exec) {
      this.shouldNotOccur("update non-found executor .. create it");
      exec = new ExecutorTracker(execId);
      this.executors.set(execId, exec);
    }
    const stageId = event.stageId;
    // const stageAttemptId = stageAttemptId;
    const executorMetrics = event.executorMetrics;
    const stage = this.activeStage(stageId);
    if (stage) {
      stage.onChildExecutorMetrics(exec, event);
    }
  }

  override caseExecutorBlacklisted(event: SparkListenerExecutorBlacklisted) {}
  override caseExecutorExcluded(event: SparkListenerExecutorExcluded) {}
  override caseExecutorBlacklistedForStage(event: SparkListenerExecutorBlacklistedForStage) {}
  override caseExecutorExcludedForStage(event: SparkListenerExecutorExcludedForStage) {}
  override caseNodeBlacklistedForStage(event: SparkListenerNodeBlacklistedForStage) {}
  override caseNodeExcludedForStage(event: SparkListenerNodeExcludedForStage) {}
  override caseExecutorUnblacklisted(event: SparkListenerExecutorUnblacklisted) {}
  override caseExecutorUnexcluded(event: SparkListenerExecutorUnexcluded) {}
  override caseNodeBlacklisted(event: SparkListenerNodeBlacklisted) {}
  override caseNodeExcluded(event: SparkListenerNodeExcluded) {}
  override caseNodeUnblacklisted(event: SparkListenerNodeUnblacklisted) {}
  override caseNodeUnexcluded(event: SparkListenerNodeUnexcluded) {}
  override caseUnschedulableTaskSetAdded(event: SparkListenerUnschedulableTaskSetAdded) {}
  override caseUnschedulableTaskSetRemoved(event: SparkListenerUnschedulableTaskSetRemoved) {}

  override caseBlockUpdated(event: SparkListenerBlockUpdated) {}


  // SQL
  //---------------------------------------------------------------------------------------------

  override caseSQLExecutionStart(event: SparkListenerSQLExecutionStart) {
    // TODO
  }

  override caseSQLExecutionEnd(event: SparkListenerSQLExecutionEnd) {
    // TODO

  }

  override caseSQLAdaptiveExecutionUpdate(event: SparkListenerSQLAdaptiveExecutionUpdate) {
    // TODO

  }

  override caseSQLAdaptiveSQLMetricUpdates(event: SparkListenerSQLAdaptiveSQLMetricUpdates) {
    // TODO

  }

  override caseSQLDriverAccumUpdates(event: SparkListenerDriverAccumUpdates) {
    // TODO

  }


  // other events: Spark-Streaming, etc.
  //---------------------------------------------------------------------------------------------
  override caseOther(event: SparkEvent) {}

}
