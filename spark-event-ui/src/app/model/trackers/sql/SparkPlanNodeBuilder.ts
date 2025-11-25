import {SparkPlanInfoTree} from '../SparkPlanNode';
import {GenericSparkPlanNode, SparkPlanNode} from './SparkPlanNode';
import {SparkPlanInfo} from '../../sparkevents/SparkPlanInfo';
import {
  AdaptiveSparkPlanNode, AQEShuffleReadNode,
  BroadcastExchangeNode,
  BroadcastHashJoinNode, BroadcastQueryStageNode, ColumnarToRowNode, ExchangeNode,
  ExecuteInsertIntoHiveTableNode, FilterNode, ProjectNode, ScanHiveNode, ScanInMemoryTableNode, ScanOrcNode, ScanParquetNode,
  ShuffledHashJoinNode, ShuffleQueryStageNode,
  SortMergeJoinNode, SortNode, WholeStageCodegenNode
} from './StandardSparkPlanNodes';

export class SparkPlanNodeBuilder {

  readonly tree: SparkPlanInfoTree;
  readonly previousTree: SparkPlanInfoTree|undefined;

  idGenerator= 0;
  newId(){ this.idGenerator++; return this.idGenerator; }

  // -----------------------------------------------------------------------------------------------------------------

  constructor(
    tree: SparkPlanInfoTree,
    previousTree?: SparkPlanInfoTree
  ) {
    this.tree = tree;
    this.previousTree = previousTree;
  }

  // -----------------------------------------------------------------------------------------------------------------

  createTreeNode(rootSparkPlanInfo: SparkPlanInfo) {
    return this.createNode(undefined, rootSparkPlanInfo);
  }

  createNode(
    parent: SparkPlanNode|undefined,
    info: SparkPlanInfo
  ): SparkPlanNode {
    // parse nodeName to determine type of node to create
    const nodeName = info.nodeName;
    switch(nodeName) {
      case 'AdaptiveSparkPlan': return new AdaptiveSparkPlanNode(this, parent, info);
      case 'AQEShuffleRead': return new AQEShuffleReadNode(this, parent, info);
      case 'Exchange': return new ExchangeNode(this, parent, info);
      case 'BroadcastExchange': return new BroadcastExchangeNode(this, parent, info);
      case 'SortMergeJoin': return new SortMergeJoinNode(this, parent, info);
      case 'Filter': return new FilterNode(this, parent, info);
      case 'Sort': return new SortNode(this, parent, info);
      case 'ShuffledHashJoin': return new ShuffledHashJoinNode(this, parent, info);
      case 'ShuffleQueryStage': return new ShuffleQueryStageNode(this, parent, info);
      case 'BroadcastHashJoin': return new BroadcastHashJoinNode(this, parent, info);
      case 'Execute InsertIntoHiveTable': return new ExecuteInsertIntoHiveTableNode(this, parent, info);
      case 'Project': return new ProjectNode(this, parent, info);
      case 'BroadcastQueryStage': return new BroadcastQueryStageNode(this, parent, info);
      case 'ColumnarToRow': return new ColumnarToRowNode(this, parent, info);
      // TODO add more sub-class matchings here ...
    }

    if (nodeName.startsWith('WholeStageCodegen ')) {
      return new WholeStageCodegenNode(this, parent, info);
    }
    if (nodeName.startsWith('Scan parquet')) {
      return new ScanParquetNode(this, parent, info);
    }
    if (nodeName.startsWith('Scan orc')) {
      return new ScanOrcNode(this, parent, info);
    }
    if (nodeName.startsWith('Scan hive')) {
      return new ScanHiveNode(this, parent, info);
    }
    if (nodeName.startsWith('Scan In-memory table')) {
      return new ScanInMemoryTableNode(this, parent, info);
    }

    console.log('/** \n *\n */\nexport class ' + nodeName + 'Node extends SparkPlanNode {\n  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {\n    super(builder, parent, info);\n  }\n}\n');
    return new GenericSparkPlanNode(this, parent, info);
  }

}
