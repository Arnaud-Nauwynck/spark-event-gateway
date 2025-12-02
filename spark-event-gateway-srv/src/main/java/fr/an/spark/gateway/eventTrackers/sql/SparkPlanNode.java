package fr.an.spark.gateway.eventTrackers.sql;

import fr.an.spark.gateway.eventTrackers.sql.metrics.MetricValueHolder;
import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;
import lombok.Getter;

import java.util.*;
import java.util.stream.Collectors;

/**
 *
 */
@Getter
public abstract class SparkPlanNode {

    public final SparkPlanInfoTree tree;
    protected final int id;
    protected final SparkPlanNode parent;

    protected final String nodeName;
    protected final String simpleString;
    protected final Map<String, Object> metadata;

    protected final List<SparkPlanNode> children;
    protected final List<MetricValueHolder> metricValueHolders;

    protected boolean expanded = true;

    // -----------------------------------------------------------------------------------------------------------------

    public SparkPlanNode(
            SparkPlanNodeBuilder builder,
            SparkPlanNode parent,
            SparkPlanInfo info
    ) {
        this.tree = builder.getTree();
        this.id = builder.newId();
        this.parent = parent;
        this.nodeName = info.getNodeName();
        this.simpleString = info.getSimpleString();
        this.metadata = info.getMetadata();

        if (info.getChildren() != null) {
            this.children = info.getChildren().stream()
                    .map(x -> {
                        if ("InputAdapter".equals(x.getNodeName()) && x.getChildren() != null && x.getChildren().size() == 1) {
                            return builder.createNode(this, x.getChildren().get(0));
                        }
                        return builder.createNode(this, x);
                    })
                    .collect(Collectors.toList());
        } else {
            this.children = new ArrayList<>();
        }

        if (info.getMetrics() != null) {
            this.metricValueHolders = info.getMetrics().stream()
                    .map(x -> new MetricValueHolder(this, x, builder.getPreviousTree()))
                    .collect(Collectors.toList());
        } else {
            this.metricValueHolders = new ArrayList<>();
        }
    }

    public List<MetadataKeyValue> getMetadataKeyValues() {
        if (metadata == null) return Collections.emptyList();
        List<MetadataKeyValue> result = new ArrayList<>();
        for (Map.Entry<String, Object> entry : metadata.entrySet()) {
            result.add(new MetadataKeyValue(entry.getKey(), entry.getValue()));
        }
        return result;
    }

    public MetricValueHolder metricByName(String name) {
        return metricValueHolders.stream()
                .filter(x -> name.equals(x.getName()))
                .findFirst()
                .orElse(null);
    }

    public MetricValueHolder metricByAccumulatorId(int accumulatorId) {
        return metricValueHolders.stream()
                .filter(x -> x.getAccumulatorId() == accumulatorId)
                .findFirst()
                .orElse(null);
    }

    public int countMetricValuesToShow() {
        return (int) metricValueHolders.stream().filter(MetricValueHolder::isValueToShow).count();
    }

    public int countMetricsWithUpdates() {
        return (int) metricValueHolders.stream().filter(m -> m.getUpdateCount() != 0).count();
    }

    public void toggle() {
        expanded = !expanded;
    }

    public void expandAll() {
        expanded = true;
        children.forEach(SparkPlanNode::expandAll);
    }

    public void collapseAll() {
        expanded = false;
        children.forEach(SparkPlanNode::collapseAll);
    }
}
