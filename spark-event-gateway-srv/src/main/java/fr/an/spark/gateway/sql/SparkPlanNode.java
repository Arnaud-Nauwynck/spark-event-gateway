package fr.an.spark.gateway.sql;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fr.an.spark.gateway.sql.metrics.MetricValueHolder;
import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;
import lombok.Getter;
import lombok.val;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.*;
import java.util.stream.Collectors;

/**
 *
 */
@Getter
public abstract class SparkPlanNode {

    public final SparkPlanTree tree;
    protected final SparkPlanNode parent;
    protected final int nodePathId;

    protected final String nodeName;
    protected final String simpleString;
    protected final Map<String, Object> metadata;

    protected final List<SparkPlanNode> children;
    protected final List<MetricValueHolder> metricValueHolders;

    // computed attribute, scanning recursively children first
    protected int semanticHash;

    @JsonIgnore
    public int sameDuplicatedIndex;
    @JsonIgnore // not json tree serializable, loop
    public SparkPlanNode sameDuplicateFirstNode;
    @JsonIgnore
    public Integer sameDuplicateFirstNodePathId; // = firstSameDuplicateNode.nodePathId

    @JsonIgnore
    public int semanticDuplicatedIndex;
    @JsonIgnore // not json tree serializable, loop
    public SparkPlanNode semanticDuplicateFirstNode;
    @JsonIgnore
    public Integer semanticDuplicateFirstNodePathId; // = firstSemanticDuplicateNode.nodePathId




    // -----------------------------------------------------------------------------------------------------------------

    public SparkPlanNode(
            SparkPlanNodeBuilder builder,
            SparkPlanNode parent,
            SparkPlanInfo info
    ) {
        this.tree = builder.getTree();
        this.nodePathId = builder.newNodePathId();
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

        this.semanticHash = buildSemanticHash();
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

    public boolean equalsSameTextAndMetadata(SparkPlanNode node) {
        return Objects.equals(this.nodeName, node.nodeName)
                && Objects.equals(this.simpleString, node.simpleString)
                && Objects.equals(this.metadata, node.metadata);
    }

    public boolean equalsSame(SparkPlanNode node) {
        if (!equalsSameTextAndMetadata(node)) {
            return false;
        }
        // compare metrics  (exact same accumulableIds and values)
        int metricsCount = this.metricValueHolders.size();
        if (metricsCount != node.metricValueHolders.size()) {
            return false;
        }
        for (int i = 0; i < metricsCount; i++) {
            val leftMetric = this.metricValueHolders.get(i);
            val rightMetric = node.metricValueHolders.get(i);
            if (! leftMetric.equalsSameTypeAndId(rightMetric)) {
                return false;
            }
        }

        val leftChildCount = this.children != null ? this.children.size() : 0;
        val rightChildCount = node.children != null ? node.children.size() : 0;
        if (leftChildCount != rightChildCount) return false;
        if (children != null) {
            for (int i = 0; i < leftChildCount; i++) {
                val leftChild = this.children.get(i);
                val rightChild = node.children.get(i);
                if (!leftChild.equalsSame(rightChild)) return false;
            }
        }
        return true;
    }


    /**
     * may override in subclasses to be more specific, in particular to handle "alias"
     * ... this is not handled here, only generic attributes
     */
    protected int buildSemanticHash() {
        val b = new SemanticHashBuilder();
        b.addChildrenSemanticHashTo(children);
        b.addNodeName(nodeName);
        b.addSimpleString(simpleString);
        b.addMetadata(metadata);
        return b.toHashCode();
    }

    public boolean equalsCanonicalized(SparkPlanNode node) {
        if (semanticHash != node.semanticHash) return false;
        if (!compareBaseNodeCanonicalized(node)) return false;

        val leftChildCount = this.children != null ? this.children.size() : 0;
        val rightChildCount = node.children != null ? node.children.size() : 0;
        if (leftChildCount != rightChildCount) return false;
        if (children != null) {
            for (int i = 0; i < leftChildCount; i++) {
                val leftChild = this.children.get(i);
                val rightChild = node.children.get(i);
                if (!leftChild.equalsCanonicalized(rightChild)) return false;
            }
        }
        return true;
    }

    protected boolean compareBaseNodeCanonicalized(SparkPlanNode node) {
        if (!Objects.equals(this.nodeName, node.nodeName)) {
            return false;
        }
        if (!Objects.equals(this.simpleString, node.simpleString)) {
            return false;
        }
        return Objects.equals(this.metadata, node.metadata);
    }


    protected static class SemanticHashBuilder {
        private final HashCodeBuilder hashCodeBuilder = new HashCodeBuilder();
        protected int toHashCode() {
            return hashCodeBuilder.toHashCode();
        }
        protected void add(String text) {
            hashCodeBuilder.append(text);
        }

        protected void addNodeName(String nodeName) {
            add(nodeName);
        }
        protected void addSimpleString(String simpleString) {
            add(simpleString);
        }
        protected void addChildrenSemanticHashTo(List<SparkPlanNode> children) {
            if (children != null) {
                for (SparkPlanNode child : children) {
                    hashCodeBuilder.append(child.getSemanticHash());
                }
            }
        }

        @SuppressWarnings({"rawtypes", "unchecked"})
        protected void addMetadata(Map<String, Object> metadata) {
            if (metadata == null || metadata.isEmpty()) {
                return;
            }
            if (metadata.size() == 1) {
                val e = metadata.entrySet().iterator().next();
                hashCodeBuilder.append(e.getKey());
                hashCodeBuilder.append(e.getValue());
            } else {
                TreeMap<String,Object> sortedMetadata;
                if (metadata instanceof TreeMap metadata2) {
                    sortedMetadata = (TreeMap<String,Object>) metadata2; // already sorted
                } else {
                    sortedMetadata = new TreeMap<>(metadata);
                    // may remove some keys?
                    hashCodeBuilder.append(sortedMetadata);
                }
            }
        }

    }
}
