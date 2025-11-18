import {
  SparkListenerDriverAccumUpdates, SparkListenerJobEnd, SparkListenerJobStart,
  SparkListenerSQLAdaptiveExecutionUpdate,
  SparkListenerSQLAdaptiveSQLMetricUpdates, SparkListenerSQLExecutionEnd, SparkListenerSQLExecutionStart
} from '../sparkevents/SparkEvent';
import {JobTracker} from './JobTracker';

/**
 * event tracker for SQL execution
 */
export class SqlExecTracker {
  readonly sqlId: number;

  startEvent: SparkListenerSQLExecutionStart|undefined;

  readonly sqlAdaptiveExecUpdates: SparkListenerSQLAdaptiveExecutionUpdate[] = [];
  readonly sqlAdaptiveMetricUpdates: SparkListenerSQLAdaptiveSQLMetricUpdates[] = [];
  readonly driverAccumUpdates: SparkListenerDriverAccumUpdates[] = [];

  readonly jobs: JobTracker[] = [];
  activeJobs = new Map<number,JobTracker>();

  endEvent: SparkListenerSQLExecutionEnd|undefined;


  //-----------------------------------------------------------------------------------------------

  constructor(sqlId: number) {
    this.sqlId = sqlId;
  }

  //---------------------------------------------------------------------------------------------

  onStart(event: SparkListenerSQLExecutionStart) {
    this.startEvent = event;
  }

  onEnd(event: SparkListenerSQLExecutionEnd) {
    this.endEvent = event;
  }

  onChildJobStart(job: JobTracker) {
    this.activeJobs.set(job.jobId, job);
    this.jobs.push(job);
  }

  onChildJobEnd(job: JobTracker) {
    // const job = this.activeJobs.get(job.jobId);
    this.activeJobs.delete(job.jobId);
    if (! job) {
      console.log('should not occur: unknown job end');
      return;
    }
  }
}
