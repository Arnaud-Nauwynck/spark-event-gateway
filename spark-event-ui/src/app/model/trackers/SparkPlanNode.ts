import {SparkPlanInfo} from '../sparkevents/SparkPlanInfo';
import {TaskTracker} from './TaskTracker';
import {AccumUpdateValue, SparkListenerDriverAccumUpdates, SparkListenerTaskEnd} from '../sparkevents/SparkEvent';
import {AccumulableInfo} from '../sparkevents/AccumulableInfo';
import {MetricValueHolder} from './metrics/MetricValueHolder';
import {SparkPlanNode} from './sql/SparkPlanNode';
import {SparkPlanNodeBuilder} from './sql/SparkPlanNodeBuilder';


/**
 *
 */
export class SparkPlanInfoTree {

  readonly sparkPlanInfo: SparkPlanInfo; // useless? debug to show json
  readonly rootNode: SparkPlanNode;

  readonly metricValueHolderById = new Map<number, MetricValueHolder>();


  // TODO move in view?
  showSimpleString = true;

  showMetrics = true;
  showMetricDetailsAccumulableId = false;
  showMetricDetailsUpdateCount = true;
  showMetricDetailsPerDriver = false;
  showMetricDetailsPerJob = false;
  showMetricDetailsPerStage = false;
  showMetricDetailsMinMaxValues = false;
  showMetricDetailsAllValues = false;

  showMetadata = false;

  constructor(sparkPlanInfo: SparkPlanInfo,
              previousTree?: SparkPlanInfoTree) {
    this.sparkPlanInfo = sparkPlanInfo;
    const nodeBuilder = new SparkPlanNodeBuilder(this, previousTree);
    this.rootNode = nodeBuilder.createTreeNode(sparkPlanInfo);
  }

  onChildTaskEndMetricValueUpdates(task: TaskTracker, event: SparkListenerTaskEnd, accumulableUpdates: AccumulableInfo[]) {
    accumulableUpdates.forEach(acc=> {
      const metricValueHolder = this.metricValueHolderById.get(acc.id);
      if (metricValueHolder) {
        metricValueHolder.onChildTaskEndMetricValueUpdate(task, event, acc);
      } else {
        // should not occur
      }
    });
  }

  onDriverAccumUpdatesEvent(event: SparkListenerDriverAccumUpdates, accumUpdates: AccumUpdateValue[]) {
    accumUpdates.forEach(accUpdate => {
      const metricValueHolder = this.metricValueHolderById.get(accUpdate.id);
      if (metricValueHolder) {
        metricValueHolder.onDriverAccumUpdate(event, accUpdate);
      } else {
        // should not occur
      }
    });
  }
}
