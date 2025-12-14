import {AccumulableInfo} from '../sparkevents/AccumulableInfo';

import {SparkPlanNode} from './SparkPlanNode';
import {ISparkPlanInfoModel, SparkPlanInfoModelAdapter, SparkPlanNodeBuilder} from './SparkPlanNodeBuilder';
import {MetricValueHolder} from './metrics/MetricValueHolder';
import {TaskTracker} from '../trackers/TaskTracker';
import {AccumUpdateValue, SparkListenerDriverAccumUpdates, SparkListenerTaskEnd} from '../sparkevents/SparkEvent';
import {NodeDuplicatesWithinSqlExecAnalysisDTO} from '../../rest';
import {SparkSqlExecKey} from '../SparkSqlExecKey';
import {SparkApiService} from '../../services/SparkApiService';
import {Observable, tap} from 'rxjs';

/**
 *
 */
export class SparkPlanTree {

  readonly rootNode: SparkPlanNode;

  readonly metricValueHolderById = new Map<number, MetricValueHolder>();


  // TODO move in view?
  showNodePathIds = false;
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
  showSimpleStringFully = false;
  showMetadataFully = false;

  nodeDuplicatesWithinSqlExecAnalysis: NodeDuplicatesWithinSqlExecAnalysisDTO|null = null;
  inMemoryNodes: SparkPlanNode[] | undefined;



  constructor(sparkPlanInfo: ISparkPlanInfoModel,
              modelAdapter: SparkPlanInfoModelAdapter,
              previousTree?: SparkPlanTree) {
    const nodeBuilder = new SparkPlanNodeBuilder(this, modelAdapter, previousTree);
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

  performSparkPlanNodeDuplicatesAnalysis$(sparkApi: SparkApiService, sparkSqlKey: SparkSqlExecKey): Observable<NodeDuplicatesWithinSqlExecAnalysisDTO> {
    return sparkApi.performSparkPlanNodeDuplicatesAnalysis$(sparkSqlKey).pipe(
      tap(res => {
        this.nodeDuplicatesWithinSqlExecAnalysis = res;
        const sameDuplicatesEntries = res.sameDuplicatesEntries;
        if (sameDuplicatesEntries && sameDuplicatesEntries.length) {
          for(let dupEntry of sameDuplicatesEntries) {
            // dupEntry.semanticHash
            let nodePathIds = dupEntry.nodePathIds!;
            const firstNodePathId = nodePathIds[0];
            const firstDuplicateNode = this.rootNode.findNodeByPathId(firstNodePathId);
            let duplicatedIndex = 0;
            for(let nodePathId of nodePathIds) {
              // find node by id
              const node = this.rootNode.findNodeByPathId(nodePathId);
              duplicatedIndex++;
              if (! node) {
                console.log('should not occur... node not found by nodePathId:', nodePathId);
              } else {
                // assign duplicate info to node (=> could also expand/reduce all them, and add borders in view)
                node.sameDuplicatedIndex = duplicatedIndex;
                node.sameDuplicateFirstNode = firstDuplicateNode;
                node.totalSameDuplicates = nodePathIds.length;
              }
            }
          }
        }

        const semanticDuplicatesEntries = res.semanticDuplicatesEntries;
        if (semanticDuplicatesEntries && semanticDuplicatesEntries.length) {
          for(let dupEntry of semanticDuplicatesEntries) {
            // dupEntry.semanticHash
            let nodePathIds = dupEntry.nodePathIds!;
            const firstNodePathId = nodePathIds[0];
            const firstDuplicateNode = this.rootNode.findNodeByPathId(firstNodePathId);
            let duplicatedIndex = 0;
            for(let nodePathId of nodePathIds) {
              // find node by id
              const node = this.rootNode.findNodeByPathId(nodePathId);
              duplicatedIndex++;
              if (! node) {
                console.log('should not occur... node not found by nodePathId:', nodePathId);
              } else {
                // assign duplicate info to node (=> could also expand/reduce all them, and add borders in view)
                node.semanticDuplicatedIndex = duplicatedIndex;
                node.semanticDuplicateFirstNode = firstDuplicateNode;
                node.totalSemanticDuplicates = nodePathIds.length;
              }
            }
          }
        }
      })
    );
  }

  recursiveFindInMemoryScanNodes(node: SparkPlanNode, resInMemoryNodes: SparkPlanNode[]) {
    if (node.nodeName === 'InMemoryTableScan') {
      node.expanded = false;
      resInMemoryNodes.push(node);
    }
    if (node.children) {
      for (let child of node.children) {
        this.recursiveFindInMemoryScanNodes(child, resInMemoryNodes);
      }
    }
  }

}
