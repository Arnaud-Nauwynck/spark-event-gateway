package fr.an.spark.gateway.sql;

import fr.an.spark.gateway.eventTrackers.TaskTracker;
import fr.an.spark.gateway.sql.metrics.MetricValueHolder;
import fr.an.spark.gateway.eventlog.model.AccumulableInfo;
import fr.an.spark.gateway.eventlog.model.SparkEvent.AccumUpdateValue;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerDriverAccumUpdates;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerTaskEnd;
import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

public class SparkPlanTree {

    public final SparkPlanInfo sparkPlanInfo; // useless? debug to show json
    public final SparkPlanNode rootNode;

    public final Map<Integer, MetricValueHolder> metricValueHolderById = new HashMap<>();
    protected int invalidMetricCounter;

    // -----------------------------------------------------------------------------------------------------------------

    public SparkPlanTree(SparkPlanInfo sparkPlanInfo, SparkPlanTree previousTree) {
        this.sparkPlanInfo = sparkPlanInfo;
        SparkPlanNodeBuilder nodeBuilder = new SparkPlanNodeBuilder(this, previousTree);
        // *** recursively create nodes ***
        this.rootNode = nodeBuilder.createTreeNode(sparkPlanInfo);
    }

    // -----------------------------------------------------------------------------------------------------------------

    public void onChildTaskEndMetricValueUpdates(TaskTracker task, SparkListenerTaskEnd event, List<AccumulableInfo> accumulableUpdates) {
        for (AccumulableInfo acc : accumulableUpdates) {
            MetricValueHolder metricValueHolder = this.metricValueHolderById.get(acc.id);
            if (metricValueHolder != null) {
                metricValueHolder.onChildTaskEndMetricValueUpdate(task, event, acc);
            } else {
                invalidMetricCounter++; // should not occur
            }
        }
    }

    public void onDriverAccumUpdatesEvent(SparkListenerDriverAccumUpdates event, List<AccumUpdateValue> accumUpdates) {
        for (AccumUpdateValue accUpdate : accumUpdates) {
            MetricValueHolder metricValueHolder = this.metricValueHolderById.get(accUpdate.id());
            if (metricValueHolder != null) {
                metricValueHolder.onDriverAccumUpdate(event, accUpdate);
            } else {
                invalidMetricCounter++; // should not occur
            }
        }
    }
}
