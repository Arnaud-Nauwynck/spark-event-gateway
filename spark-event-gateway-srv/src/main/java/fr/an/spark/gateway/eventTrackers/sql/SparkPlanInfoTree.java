package fr.an.spark.gateway.eventTrackers.sql;

import fr.an.spark.gateway.eventTrackers.model.TaskTracker;
import fr.an.spark.gateway.eventTrackers.sql.metrics.MetricValueHolder;
import fr.an.spark.gateway.eventlog.model.AccumulableInfo;
import fr.an.spark.gateway.eventlog.model.SparkEvent.AccumUpdateValue;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerDriverAccumUpdates;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerTaskEnd;
import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

public class SparkPlanInfoTree {

    public final SparkPlanInfo sparkPlanInfo; // useless? debug to show json
    public final SparkPlanNode rootNode;

    public final Map<Integer, MetricValueHolder> metricValueHolderById = new HashMap<>();

    // TODO move in view?
    public boolean showSimpleString = true;

    public boolean showMetrics = true;
    public boolean showMetricDetailsAccumulableId = false;
    public boolean showMetricDetailsUpdateCount = true;
    public boolean showMetricDetailsPerDriver = false;
    public boolean showMetricDetailsPerJob = false;
    public boolean showMetricDetailsPerStage = false;
    public boolean showMetricDetailsMinMaxValues = false;
    public boolean showMetricDetailsAllValues = false;

    public boolean showMetadata = false;

    public SparkPlanInfoTree(SparkPlanInfo sparkPlanInfo) {
        this(sparkPlanInfo, null);
    }

    public SparkPlanInfoTree(SparkPlanInfo sparkPlanInfo, SparkPlanInfoTree previousTree) {
        this.sparkPlanInfo = sparkPlanInfo;
        SparkPlanNodeBuilder nodeBuilder = new SparkPlanNodeBuilder(this, previousTree);
        this.rootNode = nodeBuilder.createTreeNode(sparkPlanInfo);
    }

    public void onChildTaskEndMetricValueUpdates(TaskTracker task, SparkListenerTaskEnd event, List<AccumulableInfo> accumulableUpdates) {
        for (AccumulableInfo acc : accumulableUpdates) {
            MetricValueHolder metricValueHolder = this.metricValueHolderById.get(acc.id);
            if (metricValueHolder != null) {
                metricValueHolder.onChildTaskEndMetricValueUpdate(task, event, acc);
            } else {
                // should not occur
            }
        }
    }

    public void onDriverAccumUpdatesEvent(SparkListenerDriverAccumUpdates event, List<AccumUpdateValue> accumUpdates) {
        for (AccumUpdateValue accUpdate : accumUpdates) {
            MetricValueHolder metricValueHolder = this.metricValueHolderById.get(accUpdate.id());
            if (metricValueHolder != null) {
                metricValueHolder.onDriverAccumUpdate(event, accUpdate);
            } else {
                // should not occur
            }
        }
    }
}
