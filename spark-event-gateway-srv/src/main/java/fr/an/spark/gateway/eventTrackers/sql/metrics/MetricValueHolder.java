package fr.an.spark.gateway.eventTrackers.sql.metrics;

import fr.an.spark.gateway.eventTrackers.model.TaskTracker;
import fr.an.spark.gateway.eventTrackers.sql.SparkPlanInfoTree;
import fr.an.spark.gateway.eventTrackers.sql.SparkPlanNode;
import fr.an.spark.gateway.eventlog.model.AccumulableInfo;
import fr.an.spark.gateway.eventlog.model.SparkEvent.AccumUpdateValue;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerDriverAccumUpdates;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerTaskEnd;
import fr.an.spark.gateway.eventlog.model.SparkPlanInfo.Metrics;
import fr.an.spark.gateway.utils.LsUtils;
import lombok.Getter;
import lombok.val;

import java.util.*;
import java.util.stream.Collectors;

/**
 *
 */
@Getter
public class MetricValueHolder {

    public final SparkPlanNode attachedNode;
    public final Metrics metric;
    public final MetricDescription metricDescription;

    public Object value;
    public int updateCount = 0;
    public int updateCountPerDriver = 0;
    public final List<MetricValueUpdatesPerJob> updatesPerJobs = new ArrayList<>();

    // -----------------------------------------------------------------------------------------------------------------

    public MetricValueHolder(SparkPlanNode attachedNode, Metrics metric, SparkPlanInfoTree previousTree) {
        this.attachedNode = attachedNode;
        this.metric = metric;
        this.metricDescription = MetricDescriptionRegistry.INSTANCE.resolve(metric.name, metric.metricType);
        attachedNode.tree.metricValueHolderById.put(getAccumulatorId(), this);

        if (previousTree != null) {
            MetricValueHolder previousValueHolder = previousTree.metricValueHolderById.get(getAccumulatorId());
            if (previousValueHolder != null) {
                this.value = previousValueHolder.value;
                this.updateCount = previousValueHolder.updateCount;
                this.updateCountPerDriver = previousValueHolder.updateCountPerDriver;
                for (MetricValueUpdatesPerJob prevPerJob : previousValueHolder.updatesPerJobs) {
                    this.updatesPerJobs.add(prevPerJob.newUpdateCopyFor(this));
                }
            }
        }
    }

    public String getName() { return metric.name; }
    public int getAccumulatorId() { return metric.accumulatorId; }
    public String getMetricType() { return metric.metricType; }
    public int getUpdateCountNotDriver() { return updateCount - updateCountPerDriver; }

    public boolean isValueToShow() {
        return value != null;
    }

    public List<Long> getAllValues() {
        return updatesPerJobs.stream()
                .flatMap(perJob -> perJob.updatesPerStages.stream()
                        .flatMap(perStage -> perStage.incrValues.stream()))
                .collect(Collectors.toList());
    }

    public void onChildTaskEndMetricValueUpdate(TaskTracker task, SparkListenerTaskEnd event, AccumulableInfo acc) {
        // TODO task -> in stage.. can be in several jobs
        for(val job: task.stage.jobs) {
            val jobId = job.jobId;
            MetricValueUpdatesPerJob perJob = LsUtils.findFirstOrAdd(updatesPerJobs, x -> x.jobId == jobId,
                    () -> new MetricValueUpdatesPerJob(this, jobId));
            perJob.onChildTaskEndMetricValueUpdate(task, event, acc);
        }

        this.value = acc.value;
        this.updateCount++;
    }

    public void onDriverAccumUpdate(SparkListenerDriverAccumUpdates event, AccumUpdateValue accUpdate) {
        this.value = accUpdate.value();
        this.updateCount++;
        this.updateCountPerDriver++;
    }

    public String updatesPerJobSummary(boolean perStageDetails) {
        if (updatesPerJobs.isEmpty()) {
            return "";
        }
        if (updatesPerJobs.size() == 1) {
            MetricValueUpdatesPerJob perJob = updatesPerJobs.get(0);
            return "(from job " + perJob.jobId + perJob.optUpdatesPerStageSummary(perStageDetails) + ")";
        } else {
            return "(from " + updatesPerJobs.size() + " jobs: " +
                    updatesPerJobs.stream()
                            .map(x -> x.jobId + x.optUpdatesPerStageSummary(perStageDetails))
                            .collect(Collectors.joining(", ")) +
                    ")";
        }
    }

    public String updatesSummary(boolean showMetricDetailsUpdateCount,
                                 boolean showMetricDetailsPerDriver,
                                 boolean showMetricDetailsPerJob,
                                 boolean showMetricDetailsPerStage,
                                 boolean showMetricDetailsMinMaxValues,
                                 boolean showMetricDetailsValues) {
        if (updateCount == 0) {
            return "";
        }
        StringBuilder res = new StringBuilder();
        if (showMetricDetailsUpdateCount) {
            if (updateCount != 1) {
                res.append(" updated ").append(updateCount).append(" time").append(updateCount > 1 ? "s" : "");
            }
        }
        if (showMetricDetailsPerDriver) {
            if (updateCountPerDriver == 1) {
                res.append(" from driver");
            } else if (updateCountPerDriver > 1) {
                res.append(" ").append(updateCountPerDriver).append(" from driver");
            }
        }
        if (showMetricDetailsPerJob) {
            res.append(" ").append(updatesPerJobSummary(showMetricDetailsPerStage));
        }
        if (getUpdateCountNotDriver() > 1) {
            if (showMetricDetailsMinMaxValues) {
                List<Long> allValues = getAllValues();
                if (allValues.isEmpty()) {
                    res.append(" no values");
                } else {
                    long minValue = Collections.min(allValues);
                    long maxValue = Collections.max(allValues);
                    res.append(" min: ").append(minValue).append(", max: ").append(maxValue);
                }
            }
            if (showMetricDetailsValues) {
                res.append(" values [")
                        .append(getAllValues().stream().map(String::valueOf).collect(Collectors.joining(", ")))
                        .append("]");
            }
        }
        return res.toString();
    }

    // -----------------------------------------------------------------------------------------------------------------

    public static class MetricValueUpdatesPerJob {
        public final List<MetricValueUpdatesPerJobStage> updatesPerStages = new ArrayList<>();
        public final MetricValueHolder valueHolder;
        public final int jobId;

        public MetricValueUpdatesPerJob(MetricValueHolder valueHolder, int jobId) {
            this.valueHolder = valueHolder;
            this.jobId = jobId;
        }

        public void onChildTaskEndMetricValueUpdate(TaskTracker task, SparkListenerTaskEnd event, AccumulableInfo acc) {
            int stageId = task.stageId;
            MetricValueUpdatesPerJobStage perStage = LsUtils.findFirst(updatesPerStages, x -> x.stageId == stageId);
            if (perStage == null) {
                perStage = new MetricValueUpdatesPerJobStage(this, stageId);
                updatesPerStages.add(perStage);
            }
            perStage.onChildTaskEndMetricValueUpdate(task, event, acc);
        }

        public String optUpdatesPerStageSummary(boolean enable) {
            return enable ? " " + updatesPerStageSummary() : "";
        }

        public String updatesPerStageSummary() {
            if (updatesPerStages.isEmpty()) {
                return "";
            }
            if (updatesPerStages.size() == 1) {
                MetricValueUpdatesPerJobStage perStage = updatesPerStages.get(0);
                return "stage: " + perStage.stageId;
            } else {
                return " (" + updatesPerStages.size() + " stages: " +
                        updatesPerStages.stream().map(x -> String.valueOf(x.stageId)).collect(Collectors.joining(", ")) +
                        ")";
            }
        }

        public MetricValueUpdatesPerJob newUpdateCopyFor(MetricValueHolder toValueHolder) {
            MetricValueUpdatesPerJob res = new MetricValueUpdatesPerJob(toValueHolder, this.jobId);
            for (MetricValueUpdatesPerJobStage prevPerStage : this.updatesPerStages) {
                res.updatesPerStages.add(prevPerStage.newUpdateCopyFor(res));
            }
            return res;
        }
    }

    public static class MetricValueUpdatesPerJobStage {
        public int count = 0;
        public long incrValuesSum = 0;
        public final List<Long> incrValues = new ArrayList<>();
        public final List<Long> incrTimes = new ArrayList<>();
        public final MetricValueUpdatesPerJob perJob;
        public final int stageId;

        public MetricValueUpdatesPerJobStage(MetricValueUpdatesPerJob perJob, int stageId) {
            this.perJob = perJob;
            this.stageId = stageId;
        }

        public void onChildTaskEndMetricValueUpdate(TaskTracker task, SparkListenerTaskEnd event, AccumulableInfo acc) {
            this.count++;
            Object accValue = acc.update;
            if (accValue instanceof Number accValueNum) {
                val accValueLong = accValueNum.longValue();
                this.incrValuesSum += accValueLong;
                this.incrValues.add(accValueLong);
            } else {
                // should not occur
            }
            this.incrTimes.add(event.taskInfo.finishTime);
        }

        public MetricValueUpdatesPerJobStage newUpdateCopyFor(MetricValueUpdatesPerJob newPerJob) {
            MetricValueUpdatesPerJobStage res = new MetricValueUpdatesPerJobStage(newPerJob, this.stageId);
            res.count = this.count;
            res.incrValuesSum = this.incrValuesSum;
            res.incrValues.addAll(this.incrValues);
            res.incrTimes.addAll(this.incrTimes);
            return res;
        }
    }
}
