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
import JobTracker from './JobTracker';
import StageTracker from './StageTracker';
import {TaskTracker} from './TaskTracker';
import {SqlExecTracker} from './SqlExecTracker';
import {ExecutorMetrics} from '../sparkevents/ExecutorMetrics';

/**
 * event tracker for SparkContext
 */
export class SparkContextTracker extends SparkEventVisitor {

  environmentUpdateEvent: SparkListenerEnvironmentUpdate|undefined;
  executorCore: number = 1;

  appStartEvent: SparkListenerApplicationStart|undefined;
  logStartEvent: SparkListenerLogStart|undefined;

  appEndEvent: SparkListenerApplicationEnd|undefined;

  executors = new Map<string,ExecutorTracker>();

  activeSqlExecs = new Map<number,SqlExecTracker>();
  activeJobs = new Map<number,JobTracker>();
  activeStages = new Map<number,StageTracker>();

  // useless?  (all task Start/End events contain stageId)
  activeTasks = new Map<number,TaskTracker>();

  retainSqlExecPredicate: (sqlExec: SqlExecTracker) => boolean = (sqlExec) => true;
  /** completed sqlExecs retained according to retainSqlExecPredicate */
  sqlExecs: SqlExecTracker[] = [];

  //---------------------------------------------------------------------------------------------

  constructor() {
    super();
  }

  // configure for retention
  //---------------------------------------------------------------------------------------------



  // handle (replay) events
  //---------------------------------------------------------------------------------------------

  onEvent(event: SparkEvent) {
    event.accept(this); // => call corresponding caseXyz(event)
  }

  onEvents(events: SparkEvent[]) {
    events.forEach( event => this.onEvent(event) );
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

  private optGetActiveSqlExec(sqlId: number|undefined): SqlExecTracker|undefined {
    return (sqlId === undefined)? undefined : this.getActiveSqlExec(sqlId);
  }

  private getActiveSqlExec(sqlId: number): SqlExecTracker {
    let res = this.activeSqlExecs.get(sqlId);
    if (!res) {
      this.shouldNotOccur("sqlExec not found: " + sqlId + "..create");
      res = new SqlExecTracker(sqlId);
      this.activeSqlExecs.set(sqlId, res);
    }
    return res;
  }

  activeSqlExecOpt(sqlId: number): SqlExecTracker|undefined {
    return this.activeSqlExecs.get(sqlId);
  }

  private activeStageOpt(stageId: number): StageTracker|undefined {
    return this.activeStages.get(stageId);
  }

  //---------------------------------------------------------------------------------------------

  override caseEnvironmentUpdate(event: SparkListenerEnvironmentUpdate) {
    this.environmentUpdateEvent = event;
    const sparkProps = event.sparkProperties;
    const foundCoreProp = sparkProps['spark.executor.cores'];
    this.executorCore = (foundCoreProp)? +foundCoreProp : 1;
    console.log('onEnvironmentUpdateEvent, executorCore:', this.executorCore);
  }

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
    const sqlExec = this.optGetActiveSqlExec(event.sqlExecId);
    const jobId = event.jobId;
    let job = this.activeJobs.get(jobId);
    if (!job) {
      job = new JobTracker(sqlExec, jobId);
      this.activeJobs.set(jobId, job);

      job.onJobStartEvent(event); // => create stages StageTracker[]

      // => stage ids are created here (before stage submitted)
      job.stages.forEach(stage => {
        this.activeStages.set(stage.stageInfo.stageId, stage);
      });
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
    const stage = this.activeStageOpt(stageId);
    if (stage) {
      stage.onSubmitted(event);
    } else {
      this.shouldNotOccur("stage not found for event StageSubmitted: " + stageId + "");
    }
  }

  override caseSpeculativeTaskSubmitted(event: SparkListenerSpeculativeTaskSubmitted) {
    const stageId = event.stageId;
    const stageAttemptId = event.stageAttemptId;
    const stage = this.activeStageOpt(stageId);
    if (stage) {
      stage.onSpeculativeTaskSubmittedEvent(event);
    } else {
      this.shouldNotOccur("stage not found " + stageId + ", ignore SpeculativeTaskSubmitted");
    }
  }


  override caseStageCompleted(event: SparkListenerStageCompleted) {
    const stageId = event.stageInfo.stageId;
    const stage = this.activeStageOpt(stageId);
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
    const stage = this.activeStageOpt(event.stageId);
    if (stage) {
      let task = this.activeTasks.get(taskId);
      if (!task) {
        task = new TaskTracker(stage, taskId);
      } else {
        this.shouldNotOccur("task already exists: " + taskId + "");
      }
      this.activeTasks.set(taskId, task);
      task.onTaskStartEvent(event);
    } else {
      this.shouldNotOccur("stage not found: " + event.stageId + ".. ignore TaskStart");
    }
  }

  override caseTaskGettingResult(event: SparkListenerTaskGettingResult) {
    const taskInfo = event.taskInfo;
    const taskId = taskInfo.taskId;
    let task = this.activeTasks.get(taskId);
    if (!task) {
      this.shouldNotOccur("task not found: " + taskId + " .. ignore TaskGettingResult");
    } else {
      task.onTaskGettingResultEvent(event);
    }
  }

  override caseTaskEnd(event: SparkListenerTaskEnd) {
    const taskInfo = event.taskInfo;
    const taskId = taskInfo.taskId;
    const stage = this.activeStageOpt(event.stageId);
    if (stage) {
      const task = this.activeTasks.get(taskId);
      if (task) {
        task.onTaskEndEvent(event);
      } else {
        this.shouldNotOccur("task not found: " + taskId + ".. ignore TaskEnd");
      }
    } else {
      this.shouldNotOccur("stage not found: " + event.stageId + ".. ignore TaskEnd");
    }
  }


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
      // this.shouldNotOccur("update non-found executor .. create it");
      exec = new ExecutorTracker(execId);
      this.executors.set(execId, exec);
    }
    const stageId = event.stageId;
    // const stageAttemptId = stageAttemptId;
    const executorMetrics = event.executorMetrics;
    const stage = this.activeStageOpt(stageId);
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

  findSqlExec(sqlId: number): SqlExecTracker|undefined {
    return this.sqlExecs.find(x => x.sqlId === sqlId);
  }

  override caseSQLExecutionStart(event: SparkListenerSQLExecutionStart) {
    let sqlId = event.executionId;
    let res = this.activeSqlExecs.get(sqlId);
    if (!res) {
      res = new SqlExecTracker(sqlId);
      this.activeSqlExecs.set(sqlId, res);
      this.sqlExecs.push(res);

      if (this.environmentUpdateEvent) {
        res.onSetContextEnvironment(this.environmentUpdateEvent, this.executorCore);
      }
    } else {
      this.shouldNotOccur("sqlExec already exists: " + sqlId + "");
    }
    res.onStartEvent(event);
  }

  override caseSQLExecutionEnd(event: SparkListenerSQLExecutionEnd) {
    let sqlId = event.executionId;
    const sqlExec = this.getActiveSqlExec(sqlId);
    sqlExec.onEndEvent(event);
    this.activeSqlExecs.delete(sqlId);

    if (this.retainSqlExecPredicate(sqlExec)) {
      // ok, retain copy
    } else {
      const foundIndex = this.sqlExecs.findIndex(x => x.sqlId === sqlId);
      if (foundIndex) {
        this.sqlExecs.splice(foundIndex, 1);
      }
    }
  }

  override caseSQLAdaptiveExecutionUpdate(event: SparkListenerSQLAdaptiveExecutionUpdate) {
    let sqlId = event.executionId;
    const sqlExec = this.getActiveSqlExec(sqlId);
    sqlExec.onSQLAdaptiveExecutionUpdateEvent(event);
  }

  override caseSQLAdaptiveSQLMetricUpdates(event: SparkListenerSQLAdaptiveSQLMetricUpdates) {
    let sqlId = event.executionId;
    const sqlExec = this.getActiveSqlExec(sqlId);
    sqlExec.onSQLAdaptiveMetricUpdatesEvent(event);
  }

  override caseSQLDriverAccumUpdates(event: SparkListenerDriverAccumUpdates) {
    let sqlId = event.executionId;
    const sqlExec = this.getActiveSqlExec(sqlId);
    sqlExec.onSQLDriverAccumUpdatesEvent(event);
  }


  // other events: Spark-Streaming, etc.
  //---------------------------------------------------------------------------------------------
  override caseOther(event: SparkEvent) {
    console.log("Unhandled event type: ", event);
  }


}
