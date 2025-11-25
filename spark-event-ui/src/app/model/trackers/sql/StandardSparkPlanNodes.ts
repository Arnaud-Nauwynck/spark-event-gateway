import {SparkPlanNode} from './SparkPlanNode';
import {SparkPlanNodeBuilder} from './SparkPlanNodeBuilder';
import {SparkPlanInfo} from '../../sparkevents/SparkPlanInfo';

/**
 *
 */
export class WholeStageCodegenNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class AdaptiveSparkPlanNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class BroadcastExchangeNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class FilterNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class SortMergeJoinNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ShuffledHashJoinNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ShuffleQueryStageNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class BroadcastHashJoinNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class ExecuteInsertIntoHiveTableNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ProjectNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ExchangeNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class SortNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ScanParquetNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class ScanOrcNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}


/**
 *
 */
export class ScanHiveNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ScanInMemoryTableNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class BroadcastQueryStageNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class AQEShuffleReadNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}

/**
 *
 */
export class ColumnarToRowNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined, info: SparkPlanInfo) {
    super(builder, parent, info);
  }
}
