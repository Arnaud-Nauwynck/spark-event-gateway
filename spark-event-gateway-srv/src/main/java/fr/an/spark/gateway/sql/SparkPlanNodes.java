package fr.an.spark.gateway.sql;


import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;
import fr.an.spark.gateway.sql.metrics.MetricDescription;

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

    /**
     *
     */
    public static class ScanCsvNode extends SparkPlanNode {
        public ScanCsvNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ScanTextNode extends SparkPlanNode {
        public ScanTextNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
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

    public static class SortAggregateNode extends SparkPlanNode {
        public SortAggregateNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class InMemoryTableScanNode extends SparkPlanNode {
        public InMemoryTableScanNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class HashAggregateNode extends SparkPlanNode {
        public HashAggregateNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ExecuteInsertIntoHadoopFsRelationCommandNode extends SparkPlanNode {
        public ExecuteInsertIntoHadoopFsRelationCommandNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ExecuteSetCommandNode extends SparkPlanNode {
        public ExecuteSetCommandNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class CollectLimitNode extends SparkPlanNode {
        public CollectLimitNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class DeserializeToObjectNode extends SparkPlanNode {
        public DeserializeToObjectNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ScanExistingRDDNode extends SparkPlanNode {
        public ScanExistingRDDNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class WindowNode extends SparkPlanNode {
        public WindowNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class CacheTableAsSelectNode extends SparkPlanNode {
        public CacheTableAsSelectNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class LocalTableScanNode extends SparkPlanNode {
        public LocalTableScanNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ScanOneRowRelationNode extends SparkPlanNode {
        public ScanOneRowRelationNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ExecuteCreateFunctionCommandNode extends SparkPlanNode {
        public ExecuteCreateFunctionCommandNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class UncacheTableNode extends SparkPlanNode {
        public UncacheTableNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ReusedExchangeNode extends SparkPlanNode {
        public ReusedExchangeNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class MapElementsNode extends SparkPlanNode {
        public MapElementsNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class SerializeFromObjectNode extends SparkPlanNode {
        public SerializeFromObjectNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ObjectHashAggregateNode extends SparkPlanNode {
        public ObjectHashAggregateNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class MapPartitionsNode extends SparkPlanNode {
        public MapPartitionsNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class UnionNode extends SparkPlanNode {
        public UnionNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ExecuteSaveIntoDataSourceCommandNode extends SparkPlanNode {
        public ExecuteSaveIntoDataSourceCommandNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class GenerateNode extends SparkPlanNode {
        public GenerateNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ExecuteCreateViewCommandNode extends SparkPlanNode {
        public ExecuteCreateViewCommandNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class MapGroupsNode extends SparkPlanNode {
        public MapGroupsNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class WriteFilesNode extends SparkPlanNode {
        public WriteFilesNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class AppendColumnsNode extends SparkPlanNode {
        public AppendColumnsNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class SubqueryNode extends SparkPlanNode {
        public SubqueryNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

    /**
     *
     */
    public static class ReusedSubqueryNode extends SparkPlanNode {
        public ReusedSubqueryNode(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {
            super(builder, parent, info);
        }
    }

}
