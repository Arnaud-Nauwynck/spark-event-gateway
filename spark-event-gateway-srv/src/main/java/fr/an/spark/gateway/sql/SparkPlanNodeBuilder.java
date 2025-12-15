package fr.an.spark.gateway.sql;


import fr.an.spark.gateway.sql.SparkPlanNodes.*;
import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Slf4j
public class SparkPlanNodeBuilder {

    private final SparkPlanTree tree;
    private final SparkPlanTree previousTree;

    private int idGenerator = 0;

    public int newNodePathId() {
        this.idGenerator++;
        return this.idGenerator;
    }

    // -----------------------------------------------------------------------------------------------------------------

    public SparkPlanNodeBuilder(SparkPlanTree tree) {
        this(tree, null);
    }

    public SparkPlanNodeBuilder(SparkPlanTree tree, SparkPlanTree previousTree) {
        this.tree = tree;
        this.previousTree = previousTree;
    }

    // -----------------------------------------------------------------------------------------------------------------

    public SparkPlanNode createTreeNode(SparkPlanInfo rootSparkPlanInfo) {
        return this.createNode(null, rootSparkPlanInfo);
    }

    public SparkPlanNode createNode(SparkPlanNode parent, SparkPlanInfo info) {
        String nodeName = info.getNodeName();
        switch (nodeName) {
            case "AdaptiveSparkPlan": return new AdaptiveSparkPlanNode(this, parent, info);
            case "AQEShuffleRead": return new AQEShuffleReadNode(this, parent, info);
            case "Exchange": return new ExchangeNode(this, parent, info);
            case "BroadcastExchange": return new BroadcastExchangeNode(this, parent, info);
            case "SortMergeJoin": return new SortMergeJoinNode(this, parent, info);
            case "Filter": return new FilterNode(this, parent, info);
            case "Sort": return new SortNode(this, parent, info);
            case "ShuffledHashJoin": return new ShuffledHashJoinNode(this, parent, info);
            case "ShuffleQueryStage": return new ShuffleQueryStageNode(this, parent, info);
            case "BroadcastHashJoin": return new BroadcastHashJoinNode(this, parent, info);
            case "Execute InsertIntoHiveTable": return new ExecuteInsertIntoHiveTableNode(this, parent, info);
            case "Project": return new ProjectNode(this, parent, info);
            case "BroadcastQueryStage": return new BroadcastQueryStageNode(this, parent, info);
            case "ColumnarToRow": return new ColumnarToRowNode(this, parent, info);
            case "SortAggregate": return new SortAggregateNode(this, parent, info);
            case "InMemoryTableScan": return new InMemoryTableScanNode(this, parent, info);
            case "HashAggregate": return new HashAggregateNode(this, parent, info);
            case "Execute InsertIntoHadoopFsRelationCommand": return new ExecuteInsertIntoHadoopFsRelationCommandNode(this, parent, info);
            case "Execute SetCommand": return new ExecuteSetCommandNode(this, parent, info);
            case "CollectLimit": return new CollectLimitNode(this, parent, info);
            case "DeserializeToObject": return new DeserializeToObjectNode(this, parent, info);
            case "Window": return new WindowNode(this, parent, info);
            case "CacheTableAsSelect": return new CacheTableAsSelectNode(this, parent, info);
            case "LocalTableScan": return new LocalTableScanNode(this, parent, info);
            case "Scan OneRowRelation": return new ScanOneRowRelationNode(this, parent, info);
            case "Execute CreateFunctionCommand": return new ExecuteCreateFunctionCommandNode(this, parent, info);
            case "UncacheTable": return new UncacheTableNode(this, parent, info);
            case "ReusedExchange": return new ReusedExchangeNode(this, parent, info);
            case "MapElements": return new MapElementsNode(this, parent, info);
            case "SerializeFromObject": return new SerializeFromObjectNode(this, parent, info);
            case "ObjectHashAggregate": return new ObjectHashAggregateNode(this, parent, info);
            case "MapPartitions": return new MapPartitionsNode(this, parent, info);
            case "Union": return new UnionNode(this, parent, info);
            case "Execute SaveIntoDataSourceCommand": return new ExecuteSaveIntoDataSourceCommandNode(this, parent, info);
            case "Execute CreateViewCommand": return new ExecuteCreateViewCommandNode(this, parent, info);
            case "Generate": return new GenerateNode(this, parent, info);
            case "MapGroups": return new MapGroupsNode(this, parent, info);
            case "WriteFiles": return new WriteFilesNode(this, parent, info);
            case "AppendColumns": return new AppendColumnsNode(this, parent, info);
            case "Subquery": return new SubqueryNode(this, parent, info);
            case "ReusedSubquery": return new ReusedSubqueryNode(this, parent, info);
            // TODO add more sub-class matchings here ...
        }

        if (nodeName.startsWith("WholeStageCodegen ")) {
            return new WholeStageCodegenNode(this, parent, info);
        }
        if (nodeName.startsWith("Scan parquet")) {
            return new ScanParquetNode(this, parent, info);
        }
        if (nodeName.startsWith("Scan orc")) {
            return new ScanOrcNode(this, parent, info);
        }
        if (nodeName.startsWith("Scan hive")) {
            return new ScanHiveNode(this, parent, info);
        }
        if (nodeName.startsWith("Scan In-memory table")) {
            return new ScanInMemoryTableNode(this, parent, info);
        }
        if (nodeName.startsWith("Scan csv")) {
            return new ScanCsvNode(this, parent, info);
        }
        if (nodeName.startsWith("Scan text")) {
            return new ScanTextNode(this, parent, info);
        }
        if (nodeName.startsWith("Scan ExistingRDD")) {
            return new ScanExistingRDDNode(this, parent, info);
        }
        log.info("\n"
                + "/** \n *\n */\npublic static class " + nodeName + "Node extends SparkPlanNode {\n"
                + "  public " + nodeName + "Node(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {\n"
                + "    super(builder, parent, info);\n"
                + "  }\n"
                + "}\n");
        return new GenericSparkPlanNode(this, parent, info);
    }
}
