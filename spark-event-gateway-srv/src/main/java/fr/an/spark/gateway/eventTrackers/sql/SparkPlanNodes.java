package fr.an.spark.gateway.eventTrackers.sql;


import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;

/**
 *
 */
public class SparkPlanNodes {

    public static class GenericSparkPlanNode extends SparkPlanNode {
        public GenericSparkPlanNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }


    public static class WholeStageCodegenNode extends SparkPlanNode {
        public WholeStageCodegenNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class AdaptiveSparkPlanNode extends SparkPlanNode {
        public AdaptiveSparkPlanNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class BroadcastExchangeNode extends SparkPlanNode {
        public BroadcastExchangeNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class FilterNode extends SparkPlanNode {
        public FilterNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class SortMergeJoinNode extends SparkPlanNode {
        public SortMergeJoinNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ShuffledHashJoinNode extends SparkPlanNode {
        public ShuffledHashJoinNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ShuffleQueryStageNode extends SparkPlanNode {
        public ShuffleQueryStageNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class BroadcastHashJoinNode extends SparkPlanNode {
        public BroadcastHashJoinNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ExecuteInsertIntoHiveTableNode extends SparkPlanNode {
        public ExecuteInsertIntoHiveTableNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ProjectNode extends SparkPlanNode {
        public ProjectNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ExchangeNode extends SparkPlanNode {
        public ExchangeNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class SortNode extends SparkPlanNode {
        public SortNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ScanParquetNode extends SparkPlanNode {
        public ScanParquetNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ScanOrcNode extends SparkPlanNode {
        public ScanOrcNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ScanHiveNode extends SparkPlanNode {
        public ScanHiveNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ScanInMemoryTableNode extends SparkPlanNode {
        public ScanInMemoryTableNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class BroadcastQueryStageNode extends SparkPlanNode {
        public BroadcastQueryStageNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class AQEShuffleReadNode extends SparkPlanNode {
        public AQEShuffleReadNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    public static class ColumnarToRowNode extends SparkPlanNode {
        public ColumnarToRowNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }
}
