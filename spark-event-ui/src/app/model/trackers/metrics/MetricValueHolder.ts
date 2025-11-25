import {AccumUpdateValue, SparkListenerDriverAccumUpdates, SparkListenerTaskEnd} from '../../sparkevents/SparkEvent';
import {TaskTracker} from '../TaskTracker';
import {SparkPlanInfoTree} from '../SparkPlanNode';
import {Metrics} from '../../sparkevents/SparkPlanInfo';
import {AccumulableInfo} from '../../sparkevents/AccumulableInfo';
import {MetricDescription} from './MetricDescription';
import {MetricDescriptionRegistry} from './MetricDescriptionRegistry';
import {SparkPlanNode} from '../sql/SparkPlanNode';


/**
 * holder for metric value in SparkPlanInfoNode
 */
export class MetricValueHolder {
  readonly attachedNode: SparkPlanNode;

  readonly metric: Metrics;
  // name: string;
  // accumulatorId: number;
  // metricType: string;
  readonly metricDescription: MetricDescription;

  value: number = 0;

  updateCount: number = 0;
  updateCountPerDriver: number = 0;
  get updateCountNotDriver(): number { return this.updateCount - this.updateCountPerDriver; }
  readonly updatesPerJob: MetricValueUpdatesPerJob[] = [];


  get name(): string { return this.metric.name; }
  get accumulatorId(): number { return this.metric.accumulatorId; }
  get metricType(): string { return this.metric.metricType; }

  constructor(attachedNode: SparkPlanNode,
              metric: Metrics,
              previousTree?: SparkPlanInfoTree
  ) {
    this.attachedNode = attachedNode;
    this.metric = metric;
    this.metricDescription = MetricDescriptionRegistry.INSTANCE.resolve(metric.name, metric.metricType);
    attachedNode.tree.metricValueHolderById.set(this.accumulatorId, this);

    if (previousTree) {
      const previousValueHolder = previousTree.metricValueHolderById.get(this.accumulatorId);
      if (previousValueHolder) {
        this.value = previousValueHolder.value;
        this.updateCount = previousValueHolder.updateCount;
        this.updateCountPerDriver = previousValueHolder.updateCountPerDriver;
        previousValueHolder.updatesPerJob.forEach(prevPerJob => {
          this.updatesPerJob.push(prevPerJob.newUpdateCopyFor(this));
        });
      }
    }
  }

  isValueToShow(): boolean {
    // TODO..
    if (!this.value) {
      return false;
    }
    return true;
  }

  getAllValues(): number[] {
    return this.updatesPerJob.flatMap(
      perJob => perJob.updatesPerStages.flatMap(
        perStage => perStage.incrValues
      )
    );
  }

  onChildTaskEndMetricValueUpdate(task: TaskTracker, event: SparkListenerTaskEnd, acc: AccumulableInfo) {
    const jobId = task.stage.job.jobId;
    const foundIndex = this.updatesPerJob.findIndex(x => x.jobId === jobId);
    let perJob: MetricValueUpdatesPerJob;
    if (-1 === foundIndex) {
      perJob = new MetricValueUpdatesPerJob(this, jobId);
      this.updatesPerJob.push(perJob);
    } else {
      perJob = this.updatesPerJob[foundIndex];
    }
    perJob.onChildTaskEndMetricValueUpdate(task, event, acc);

    this.value = acc.value; // should be equivalent to this.value += acc.update;
    this.updateCount++;
  }


  onDriverAccumUpdate(event: SparkListenerDriverAccumUpdates, accUpdate: AccumUpdateValue) {
    this.value = accUpdate.value;
    this.updateCount++;
    this.updateCountPerDriver++;
  }


  updatesPerJobSummary(perStageDetails: boolean) {
    if (this.updatesPerJob.length === 0) {
      return '';
    } if (this.updatesPerJob.length === 1) {
      const perJob = this.updatesPerJob[0];
      return '(from job ' + perJob.jobId + perJob.optUpdatesPerStageSummary(perStageDetails) + ')';
    } else {
      return `(from ${this.updatesPerJob.length} jobs:` +
        ' ' + this.updatesPerJob.map(
          x => x.jobId + x.optUpdatesPerStageSummary(perStageDetails)
        ).join(', ') +
        ')';
    }
  }

  updatesSummary(showMetricDetailsUpdateCount: boolean,
                 showMetricDetailsPerDriver: boolean,
                 showMetricDetailsPerJob: boolean,
                 showMetricDetailsPerStage: boolean,
                 showMetricDetailsMinMaxValues: boolean,
                 showMetricDetailsValues: boolean) {
    if (this.updateCount === 0) {
      return "";
    }
    let res = '';
    if (showMetricDetailsUpdateCount) {
      if (this.updateCount === 1) {
        // res += ' updated once';
      } else {
        res += ` updated ${this.updateCount} time${this.updateCount > 1 ? 's' : ''}`;
      }
    }
    if (showMetricDetailsPerDriver) {
      if (this.updateCountPerDriver === 0) {
        //
      } else if (this.updateCountPerDriver === 1) {
        res += ' from driver';
      } else {
        res += ` ${this.updateCountPerDriver} from driver`;
      }
    }

    if (showMetricDetailsPerJob) {
      res += ' ' + this.updatesPerJobSummary(showMetricDetailsPerStage);
    }

    if (this.updateCountNotDriver > 1) {
      if (showMetricDetailsMinMaxValues) {
        const allValues = this.getAllValues();
        if (allValues.length === 0) {
          res += ' no values'; // ???? multiple update from Driver? values not recorded yet
        } else {
          const minValue = Math.min(...allValues);
          const maxValue = Math.max(...allValues);
          res += ` min: ${minValue}, max: ${maxValue}`;
        }
      }

      if (showMetricDetailsValues) {
        res += ' values [' + this.getAllValues().join(', ') + ']';
      }
    }
    return res;
  }
}

/**
 *
 */
export class MetricValueUpdatesPerJob {
  readonly updatesPerStages: MetricValueUpdatesPerJobStage[] = [];

  constructor(public readonly valueHolder: MetricValueHolder,
              public readonly jobId: number) {
  }

  onChildTaskEndMetricValueUpdate(task: TaskTracker, event: SparkListenerTaskEnd, acc: AccumulableInfo) {
    const stageId = task.stage.stageId;
    const foundIndex = this.updatesPerStages.findIndex(x => x.stageId === stageId);
    let perStage: MetricValueUpdatesPerJobStage;
    if (-1 === foundIndex) {
      perStage = new MetricValueUpdatesPerJobStage(this, stageId);
      this.updatesPerStages.push(perStage);
    } else {
      perStage = this.updatesPerStages[foundIndex];
    }
    perStage.onChildTaskEndMetricValueUpdate(task, event, acc);
  }

  optUpdatesPerStageSummary(enable: boolean): string {
    return enable ? ' ' + this.updatesPerStageSummary() : '';
  }

  updatesPerStageSummary() {
    if (this.updatesPerStages.length === 0) {
      return '';
    } if (this.updatesPerStages.length === 1) {
      const perStage = this.updatesPerStages[0];
      let res = 'stage: ' + perStage.stageId;
      return res;
    } else {
      return ` (${this.updatesPerStages.length} stages: ` +
        this.updatesPerStages.map(x => x.stageId).join(', ') +
        ')';
    }
  }

  newUpdateCopyFor(toValueHolder: MetricValueHolder): MetricValueUpdatesPerJob {
    const res = new MetricValueUpdatesPerJob(toValueHolder, this.jobId);
    this.updatesPerStages.forEach(prevPerStage => {
      res.updatesPerStages.push(prevPerStage.newUpdateCopyFor(this));
    });
    return res;
  }
}

/**
 *
 */
export class MetricValueUpdatesPerJobStage {
  count: number = 0;
  incrValuesSum: number = 0;
  readonly incrValues: number[] = [];
  readonly incrTimes: number[] = [];

  constructor(public readonly perJob: MetricValueUpdatesPerJob,
              public readonly stageId: number) {
  }

  onChildTaskEndMetricValueUpdate(task: TaskTracker, event: SparkListenerTaskEnd, acc: AccumulableInfo) {
    this.count++;
    this.incrValuesSum += acc.update;
    this.incrValues.push(acc.update);
    this.incrTimes.push(event.taskInfo.finishTime?.getTime() ?? 0);
  }

  newUpdateCopyFor(newPerJob: MetricValueUpdatesPerJob): MetricValueUpdatesPerJobStage {
    const res = new MetricValueUpdatesPerJobStage(newPerJob, this.stageId);
    res.count = this.count;
    res.incrValuesSum = this.incrValuesSum;
    res.incrValues.push(...this.incrValues);
    res.incrTimes.push(...this.incrTimes);
    return res;
  }
}

