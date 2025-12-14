import {SparkPlanNode} from './SparkPlanNode';
import {
  AdaptiveSparkPlanNode, AppendColumnsNode, AQEShuffleReadNode,
  BroadcastExchangeNode,
  BroadcastHashJoinNode, BroadcastQueryStageNode, CollectLimitNode, ColumnarToRowNode,
  DeserializeToObjectNode, ExchangeNode, ExecuteInsertIntoHadoopFsRelationCommandNode,
  ExecuteInsertIntoHiveTableNode, ExecuteSaveIntoDataSourceCommandNode, FilterNode,
  GenerateNode, HashAggregateNode,
  InMemoryTableScanNode, LocalTableScanNode, MapElementsNode, MapGroupsNode,
  MapPartitionsNode, ProjectNode, ReusedExchangeNode, ScanHiveNode, ScanInMemoryTableNode, ScanOrcNode, ScanParquetNode, SerializeFromObjectNode,
  ShuffledHashJoinNode, ShuffleQueryStageNode, SortAggregateNode,
  SortMergeJoinNode, SortNode, UnionNode, WholeStageCodegenNode, WindowGroupLimitNode, WindowNode, WriteFilesNode
} from './StandardSparkPlanNodes';
import {SparkPlanInfo} from '../../rest';
import {MetadataKeyValueMap} from '../sparkevents/SparkPlanInfo';
import {MetricValueHolder} from './metrics/MetricValueHolder';
import {MetricDescriptionRegistry} from './metrics/MetricDescriptionRegistry';
import {SparkPlanTree} from './SparkPlanNodeTree';


export interface ISparkPlanInfoModel {
  nodeName?: string;
  simpleString?: string;
  children?: SparkPlanInfo[];
  metadata?: MetadataKeyValueMap;
  metrics?: any[]    // Metrics | MetricValueHolderSummary[];
}

export abstract class SparkPlanInfoModelAdapter/*<T extends SparkPlanInfoModel>*/ {
  abstract createMetricsValueHoldersFor(
    attachedNode: SparkPlanNode,
    model: ISparkPlanInfoModel,
    previousTree?: SparkPlanTree) : MetricValueHolder[];
}

export class DefaultSparkPlanInfoModelAdapter extends SparkPlanInfoModelAdapter/*<SparkPlanInfo>*/ {
  override createMetricsValueHoldersFor(attachedNode: SparkPlanNode,
                                        model: SparkPlanInfo,
                                        previousTree?: SparkPlanTree) : MetricValueHolder[] {
    return (model.metrics)? model.metrics.map(x => {
      const metricDescription = MetricDescriptionRegistry.INSTANCE.resolve(x.name!, x.metricType!)
      return new MetricValueHolder(attachedNode, metricDescription, x.accumulatorId!, previousTree)
    }) : [];
  }
}

export class SummarySparkPlanInfoModelAdapter extends SparkPlanInfoModelAdapter/*<SparkPlanInfoSummaryDTO>*/ {
  override createMetricsValueHoldersFor(attachedNode: SparkPlanNode,
                                        model: ISparkPlanInfoModel,
                                        previousTree?: SparkPlanTree) : MetricValueHolder[] {
    return (model.metrics)? model.metrics.map(x => {
      const metricDescription = MetricDescriptionRegistry.INSTANCE.resolve(x.name, x.metricType)
      return new MetricValueHolder(attachedNode, metricDescription, x.accumulatorId, previousTree)
    }) : [];
  }
}


/**
 *
 */
export class SparkPlanNodeBuilder {

  readonly tree: SparkPlanTree;
  readonly modelAdapter: SparkPlanInfoModelAdapter;
  readonly previousTree: SparkPlanTree|undefined;

  nodePathIdGenerator= 0;
  newNodePathId(){ this.nodePathIdGenerator++; return this.nodePathIdGenerator; }

  // -----------------------------------------------------------------------------------------------------------------

  constructor(
    tree: SparkPlanTree,
    modelAdapter: SparkPlanInfoModelAdapter,
    previousTree?: SparkPlanTree
  ) {
    this.tree = tree;
    this.modelAdapter = modelAdapter;
    this.previousTree = previousTree;
  }

  // -----------------------------------------------------------------------------------------------------------------

  createTreeNode(rootSparkPlanInfo: ISparkPlanInfoModel) {
    return this.createNode(undefined, rootSparkPlanInfo);
  }

  createNode(
    parent: SparkPlanNode|undefined,
    info: ISparkPlanInfoModel
  ): SparkPlanNode {
    // parse nodeName to determine type of node to create
    const nodeName = info.nodeName || '';
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
      case 'Execute InsertIntoHadoopFsRelationCommand': return new ExecuteInsertIntoHadoopFsRelationCommandNode(this, parent, info);
      case 'Execute SaveIntoDataSourceCommand': return new ExecuteSaveIntoDataSourceCommandNode(this, parent, info);
      case 'Project': return new ProjectNode(this, parent, info);
      case 'BroadcastQueryStage': return new BroadcastQueryStageNode(this, parent, info);
      case 'ColumnarToRow': return new ColumnarToRowNode(this, parent, info);
      case 'WriteFiles': return new WriteFilesNode(this, parent, info);
      case 'Union': return new UnionNode(this, parent, info);
      case 'HashAggregate': return new HashAggregateNode(this, parent, info);
      case 'Window': return new WindowNode(this, parent, info);
      case 'WindowGroupLimit': return new WindowGroupLimitNode(this, parent, info);
      case 'Generate': return new GenerateNode(this, parent, info);
      case 'ReusedExchange': return new ReusedExchangeNode(this, parent, info);
      case 'InMemoryTableScan': return new InMemoryTableScanNode(this, parent, info);
      case 'SerializeFromObject': return new SerializeFromObjectNode(this, parent, info);
      case 'DeserializeToObject': return new DeserializeToObjectNode(this, parent, info);
      case 'MapPartitions': return new MapPartitionsNode(this, parent, info);
      case 'MapElements': return new MapElementsNode(this, parent, info);
      case 'SortAggregate': return new SortAggregateNode(this, parent, info);
      case 'CollectLimit': return new CollectLimitNode(this, parent, info);
      case 'LocalTableScan': return new LocalTableScanNode(this, parent, info);
      case 'MapGroups': return new MapGroupsNode(this, parent, info);
      case 'AppendColumns': return new AppendColumnsNode(this, parent, info);

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

    const className = nodeName.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('') + 'Node';
    console.log(
      'case \'' + nodeName + '\': return new ' + className + '(this, parent, info);\n' +
      '/** \n' + //
      ' *\n' + //
      ' */\n' + //
      'export class ' + className + ' extends SparkPlanNode {\n' + //
      '  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {\n' + //
      '    super(builder, parent, info);\n' + //
      '  }\n' + //
      '}\n');
    return new GenericSparkPlanNode(this, parent, info);
  }

}

/**
 *
 */
export class GenericSparkPlanNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined,
              info: ISparkPlanInfoModel
  ) {
    super(builder, parent, info);
  }

}
