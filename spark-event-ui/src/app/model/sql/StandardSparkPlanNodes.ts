import {SparkPlanNode} from './SparkPlanNode';
import {ISparkPlanInfoModel, SparkPlanNodeBuilder} from './SparkPlanNodeBuilder';

/**
 *
 */
export class WholeStageCodegenNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class AdaptiveSparkPlanNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class BroadcastExchangeNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class FilterNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class SortMergeJoinNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ShuffledHashJoinNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ShuffleQueryStageNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class BroadcastHashJoinNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class ExecuteInsertIntoHiveTableNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ProjectNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ExchangeNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class SortNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ScanParquetNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class ScanOrcNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class ScanHiveNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ScanInMemoryTableNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ExecuteInsertIntoHadoopFsRelationCommandNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ExecuteSaveIntoDataSourceCommandNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class BroadcastQueryStageNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class AQEShuffleReadNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ColumnarToRowNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class WriteFilesNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class UnionNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class HashAggregateNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class WindowNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class WindowGroupLimitNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class GenerateNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class ReusedExchangeNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class InMemoryTableScanNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class SerializeFromObjectNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class MapPartitionsNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class MapElementsNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class DeserializeToObjectNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class SortAggregateNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class CollectLimitNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class LocalTableScanNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class MapGroupsNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class AppendColumnsNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: ISparkPlanInfoModel) {
    super(builder, parent, info);
  }
}

