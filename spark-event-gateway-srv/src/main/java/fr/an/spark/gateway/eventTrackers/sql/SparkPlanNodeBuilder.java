package fr.an.spark.gateway.eventTrackers.sql;


import fr.an.spark.gateway.eventTrackers.sql.SparkPlanNodes.*;
import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Slf4j
public class SparkPlanNodeBuilder {

    private final SparkPlanInfoTree tree;
    private final SparkPlanInfoTree previousTree;

    private int idGenerator = 0;

    public int newId() {
        this.idGenerator++;
        return this.idGenerator;
    }

    // -----------------------------------------------------------------------------------------------------------------

    public SparkPlanNodeBuilder(SparkPlanInfoTree tree) {
        this(tree, null);
    }

    public SparkPlanNodeBuilder(SparkPlanInfoTree tree, SparkPlanInfoTree previousTree) {
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

        log.info("/** \n *\n */\nexport class " + nodeName + "Node extends SparkPlanNode {\n"
                + "  public " + nodeName + "Node(SparkPlanNodeBuilder builder, SparkPlanNode parent, SparkPlanInfo info) {\n"
                + "    super(builder, parent, info);\n"
                + "  }\n"
                + "}\n");
        return new GenericSparkPlanNode(this, parent, info);
    }
}
