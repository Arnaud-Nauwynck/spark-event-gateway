import {
  SparkEvent, SparkListenerBlockManagerAdded, SparkListenerBlockManagerRemoved, SparkListenerDriverAccumUpdates,
  SparkListenerExecutorAdded,
  SparkListenerExecutorMetricsUpdate,
  SparkListenerExecutorRemoved,
  SparkListenerJobEnd, SparkListenerJobStart,
  SparkListenerSpeculativeTaskSubmitted, SparkListenerSQLExecutionEnd, SparkListenerSQLExecutionStart,
  SparkListenerStageCompleted,
  SparkListenerStageSubmitted, SparkListenerTaskEnd, SparkListenerTaskGettingResult, SparkListenerTaskStart
} from './sparkevents/SparkEvent';

/**
 * Filter criteria for SparkEvent
 */
export class SparkEventFilter {

  showApplicationLifecycleEvents = true;

  showExecutorLifecycleEvents = true;
  showExecutorAddedEvents = true;
  showExecutorRemovedEvents = true;
  showExecutorMetricsUpdateEvents = true;
  showExecutorBlockManagerAddedEvents = true;
  showExecutorBlockManagerRemovedEvents = true;

  showSql: boolean = true;
  showSqlDriverAccumulateUpdateEvents: boolean = true;
  showSqlStartEvents: boolean = true;
  showSqlEndEvents: boolean = true;

  showJobs: boolean = true;
  showJobStartEvents: boolean = true;
  showJobEndEvents: boolean = true;

  showStages: boolean = true;
  showStageSubmittedEvents: boolean = true;
  showStageCompletedEvents: boolean = true;

  showTasks: boolean = true;
  showTaskStartEvents: boolean = true;
  showSpeculativeTaskSubmittedEvents: boolean = true;
  showTaskEndEvents: boolean = true;
  showTaskGettingResultEvents: boolean = true;

  accept(evt: SparkEvent): boolean {
    if (evt.isApplicationLifecycleEvents()) {
      if (!this.showApplicationLifecycleEvents) {
        return false;
      }
    }

    if (evt.isExecutorLifecycleEvents()) {
      if (!this.showExecutorLifecycleEvents) {
        return false;
      }
      if (!this.showExecutorAddedEvents && evt.eventShortname === SparkListenerExecutorAdded.SHORT_EVENT_NAME) {
        return false;
      }
      if (!this.showExecutorRemovedEvents && evt.eventShortname === SparkListenerExecutorRemoved.SHORT_EVENT_NAME) {
        return false;
      }
      if (!this.showExecutorMetricsUpdateEvents && evt.eventShortname === SparkListenerExecutorMetricsUpdate.SHORT_EVENT_NAME) {
        return false;
      }
      if (!this.showExecutorBlockManagerAddedEvents && evt.eventShortname === SparkListenerBlockManagerAdded.SHORT_EVENT_NAME) {
        return false;
      }
      if (!this.showExecutorBlockManagerRemovedEvents && evt.eventShortname === SparkListenerBlockManagerRemoved.SHORT_EVENT_NAME) {
        return false;
      }
    }

    if (! this.showSql && evt.getSQLExecId() !== undefined) {
      return false;
    }
    if (! this.showSqlDriverAccumulateUpdateEvents && evt.eventShortname === SparkListenerDriverAccumUpdates.SHORT_EVENT_NAME) {
      return false;
    }
    if (! this.showSqlStartEvents && evt.eventShortname === SparkListenerSQLExecutionStart.SHORT_EVENT_NAME) {
      return false;
    }
    if (! this.showSqlEndEvents && evt.eventShortname === SparkListenerSQLExecutionEnd.SHORT_EVENT_NAME) {
      return false;
    }

    if (! this.showJobs && evt.getJobId() !== undefined) {
      return false;
    }
    if (! this.showJobStartEvents && evt.eventShortname === SparkListenerJobStart.SHORT_EVENT_NAME) {
      return false;
    }
    if (! this.showJobEndEvents && evt.eventShortname === SparkListenerJobEnd.SHORT_EVENT_NAME) {
      return false;
    }

    if (! this.showStages && evt.getStageId() !== undefined) {
      return false;
    }
    if (! this.showStageSubmittedEvents && evt.eventShortname === SparkListenerStageSubmitted.SHORT_EVENT_NAME) {
      return false;
    }
    if (! this.showStageCompletedEvents && evt.eventShortname === SparkListenerStageCompleted.SHORT_EVENT_NAME) {
      return false;
    }

    if (! this.showTasks && evt.getTaskId() !== undefined) {
      return false;
    }
    if (! this.showTaskStartEvents && evt.eventShortname === SparkListenerTaskStart.SHORT_EVENT_NAME) {
      return false;
    }
    if (! this.showSpeculativeTaskSubmittedEvents && evt.eventShortname === SparkListenerSpeculativeTaskSubmitted.SHORT_EVENT_NAME) {
      return false;
    }
    if (! this.showTaskEndEvents && evt.eventShortname === SparkListenerTaskEnd.SHORT_EVENT_NAME) {
      return false;
    }
    if (! this.showTaskGettingResultEvents && evt.eventShortname === SparkListenerTaskGettingResult.SHORT_EVENT_NAME) {
      return false;
    }

    return true;

  }
}
