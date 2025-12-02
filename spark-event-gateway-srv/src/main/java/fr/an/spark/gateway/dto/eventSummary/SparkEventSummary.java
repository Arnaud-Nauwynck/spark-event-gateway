package fr.an.spark.gateway.dto.eventSummary;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;
import fr.an.spark.gateway.dto.IdentifiedSparkEvent;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummary.*;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummary.SparkPlanInfoSummary.MetricValueHolderSummary;
import fr.an.spark.gateway.eventlog.model.*;
import fr.an.spark.gateway.eventlog.model.SparkEvent.*;
import lombok.NoArgsConstructor;
import lombok.val;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


/**
 * AST class hierarchy for Spark Event Summary DTOs
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = As.PROPERTY, property = "type")
@JsonSubTypes({ //
        @Type(value = SparkApplicationStartEventSummary.class, name = "ApplicationStart"), //
        @Type(value = SparkApplicationEndEventSummary.class, name = "ApplicationEnd"), //
        @Type(value = SparkLogStartEventSummary.class, name = "LogStart"), //
        @Type(value = SparkResourceProfileAddedEventSummary.class, name = "ResourceProfileAdded"), //
        @Type(value = SparkEnvironmentUpdateEventSummary.class, name = "EnvUpdate"), //
        @Type(value = SparkBlockManagerAddedEventSummary.class, name = "BlockManagerAdded"), //
        @Type(value = SparkBlockManagerRemovedEventSummary.class, name = "BlockManagerRemoved"), //

        @Type(value = SparkJobExecEventSummary.class, name = "JobExec"), //

        // @Type(value = SparkUnpersistRDDEventSummary.class, name = "UnpersistRDD"), //
        // @Type(value = SparkBlockUpdatedEventSummary.class, name = "BlockUpdated"), //

        @Type(value = SparkExecutorAddedEventSummary.class, name = "ExecutorAdded"), //
        @Type(value = SparkExecutorRemovedEventSummary.class, name = "ExecutorRemoved"), //
        @Type(value = SparkExecutorExcludedEventSummary.class, name = "ExecutorExcluded"), //
        @Type(value = SparkExecutorExcludedForStageEventSummary.class, name = "ExecutorExcludedForStage"), //
        @Type(value = SparkExecutorUnexcludedEventSummary.class, name = "ExecutorUnexcluded"), //

        @Type(value = SparkNodeExcludedEventSummary.class, name = "NodeExcluded"), //
        @Type(value = SparkNodeExcludedForStageEventSummary.class, name = "NodeExcludedForStage"), //
        @Type(value = SparkNodeUnexcludedEventSummary.class, name = "NodeUnexcluded"), //

        // --------------------------------------------------------------------------------------------

        @Type(value = SparkSQLExecutionEventSummary.class, name = "SQLExec") //

        // ADD more event summary types here
        // @Type(value = SparkStreamingEventSummary.class, name = "StreamingEvent") //
        // ...

})
public abstract class SparkEventSummary {

    /**
     *
     */
    @JsonProperty("n")
    public int eventNum;

    /** for json deserialization only */
    public SparkEventSummary() {
    }

    public SparkEventSummary(int eventNum) {
        this.eventNum = eventNum;
    }

    public abstract void accept(SparkEventSummaryVisitor visitor);


    // -----------------------------------------------------------------------------------------------------------------

    /**
     * see {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerApplicationStart}
     */
    public static class SparkApplicationStartEventSummary extends SparkEventSummary {

        public SparkListenerApplicationStart event;

        public SparkApplicationStartEventSummary(int eventNum, SparkListenerApplicationStart event) {
            super(eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseApplicationStart(this);
        }

    }

    /**
     * see {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerApplicationEnd}
     */
    public static class SparkApplicationEndEventSummary extends SparkEventSummary {

        public SparkListenerApplicationEnd event;

        public SparkApplicationEndEventSummary(int eventNum, SparkListenerApplicationEnd event) {
            super(eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseApplicationEnd(this);
        }

    }

    /**
     * see {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerLogStart}
     */
    public static class SparkLogStartEventSummary extends SparkEventSummary {

        public SparkListenerLogStart event;

        SparkLogStartEventSummary(int eventNum, SparkListenerLogStart event) {
            super(eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseLogStart(this);
        }

    }

    /**
     * see {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerResourceProfileAdded}
     */
    @NoArgsConstructor
    public static class SparkResourceProfileAddedEventSummary extends SparkEventSummary {

        public SparkListenerResourceProfileAdded event;

        public SparkResourceProfileAddedEventSummary(int eventNum, SparkListenerResourceProfileAdded event) {
            super(eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseResourceProfileAdded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerEnvironmentUpdate}
     */
    public static class SparkEnvironmentUpdateEventSummary extends SparkEventSummary {

        public SparkListenerEnvironmentUpdate event;

        public SparkEnvironmentUpdateEventSummary(int eventNum, SparkListenerEnvironmentUpdate event) {
            super(eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseEnvironmentUpdate(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerBlockManagerAdded}
     */
    public static class SparkBlockManagerAddedEventSummary extends SparkEventSummary {

        public SparkListenerBlockManagerAdded event;

        public SparkBlockManagerAddedEventSummary(int eventNum, SparkListenerBlockManagerAdded event) {
            super(eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseBlockManagerAdded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerBlockManagerRemoved}
     */
    public static class SparkBlockManagerRemovedEventSummary extends SparkEventSummary {

        public SparkListenerBlockManagerRemoved event;

        public SparkBlockManagerRemovedEventSummary(int eventNum, SparkListenerBlockManagerRemoved event) {
            super(eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseBlockManagerRemoved(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerJobStart} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerJobEnd}
     */
    public static class SparkJobExecEventSummary extends SparkEventSummary {

        // fields from SparkListenerJobStart event:
        public int jobId;
        public long submitTime;
        public Map<String, Object> propOverrides;

        // computed from tracking activeStages + stageSubmitted/completed events + task start/end events
        public List<SparkStageExecSummary> stageExecs;

        // fields from SparkListenerJobEnd event:
        public int endEventNum;
        public int duration; // => public long endTime = submitTime + duration;
        // fields from JobResult jobResult;
        public String result;
        public SparkException resultEx;

        public SparkJobExecEventSummary(
                int startEventNum, SparkListenerJobStart startEvent, Map<String,String> baseAppProps, //
                // List<IdentifiedSparkEvent> stageAndTaskEvents, //
                List<SparkStageExecSummary> stageExecs, //
                int endEventNum, SparkListenerJobEnd endEvent //
        ) {
            super(startEventNum);
            this.jobId = startEvent.jobId; // assert startEvent.jobId == endEvent.jobId
            this.submitTime = startEvent.time;
            // TODO
            // this.stageInfos = stageInfos;

            Map<String, Object> propOverrides = new LinkedHashMap<>();
            if (startEvent.properties != null) {
                for (Map.Entry<String,Object> e : startEvent.properties.entrySet()) {
                    String k = e.getKey();
                    Object v = e.getValue();
                    Object baseV = baseAppProps.get(k);
                    if (baseV == null || !v.equals(baseV)) {
                        propOverrides.put(k, v);
                    }
                }
            }
            if (! propOverrides.isEmpty()) {
                this.propOverrides = propOverrides;
            }

            this.stageExecs = stageExecs;

            this.endEventNum = endEventNum;
            this.duration = (int) (endEvent.time - startEvent.time);
            val jobRes = endEvent.jobResult;
            if (jobRes != null) {
                this.result = jobRes.result;
                this.resultEx = jobRes.exception;
            }
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseJobExec(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerStageSubmitted} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerStageCompleted}
     */
    public static class SparkStageExecSummary {
        public int stageId;
        public int submitEventNum;
        public int submitTime;
        public int completedEventNum;
        public int duration; // => public long completionTime = submitTime + duration;
        // failure + retry attempts => see optional list
        public List<StageFailureAndRetryAttempt> failAndRetries;
    }

    public static class StageFailureAndRetryAttempt {
        public int retryAttempt;
        public String failureReason;
        public int nextSubmitEventNum;
        public int nextSubmitTime;
        public int nextDuration; // => public long completionTime = submitTime + duration;
    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorAdded}
     */
    public static class SparkExecutorAddedEventSummary extends SparkEventSummary {

        // public SparkListenerExecutorAdded event;
        @JsonProperty("t")
        public long time;

        @JsonProperty("execId")
        public String executorId;

        @JsonProperty("executorInfo")
        public ExecutorInfo executorInfo;

        public SparkExecutorAddedEventSummary(int eventNum, SparkListenerExecutorAdded event) {
            super(eventNum);
            // this.event = event;
            this.time = event.time;
            this.executorId = event.executorId;
            this.executorInfo = event.executorInfo;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseExecutorAdded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorRemoved}
     */
    public static class SparkExecutorRemovedEventSummary extends SparkEventSummary {

        // public SparkListenerExecutorRemoved event;
        @JsonProperty("t")
        public long t;

        @JsonProperty("execId")
        public String executorId;

        public String reason;

        public SparkExecutorRemovedEventSummary(int eventNum, SparkListenerExecutorRemoved event) {
            super(eventNum);
            // this.event = event;
            this.t = event.time;
            this.executorId = event.executorId;
            this.reason = event.reason;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseExecutorRemoved(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorExcluded}
     */
    public static class SparkExecutorExcludedEventSummary extends SparkEventSummary {

        // public SparkListenerExecutorExcluded event;
        @JsonProperty("t")
        public long time;

        @JsonProperty("execId")
        public String executorId;

        public int taskFailures;


        public SparkExecutorExcludedEventSummary(int eventNum, SparkListenerExecutorExcluded event) {
            super(eventNum);
            // this.event = event;
            this.time = event.time;
            this.executorId = event.executorId;
            this.taskFailures = event.taskFailures;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseExecutorExcluded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorExcludedForStage}
     */
    public static class SparkExecutorExcludedForStageEventSummary extends SparkEventSummary {

        // public SparkListenerExecutorExcludedForStage event;
        @JsonProperty("t")
        public long time;

        @JsonProperty("execId")
        public String executorId;

        public int taskFailures;
        public int stageId;
        public int stageAttemptId;

        public SparkExecutorExcludedForStageEventSummary(int eventNum, SparkListenerExecutorExcludedForStage event) {
            super(eventNum);
            // this.event = event;
            this.time = event.time;
            this.executorId = event.executorId;
            this.taskFailures = event.taskFailures;
            this.stageId = event.stageId;
            this.stageAttemptId = event.stageAttemptId;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseExecutorExcludedForStage(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorUnexcluded}
     */
    public static class SparkExecutorUnexcludedEventSummary extends SparkEventSummary {

        // public SparkListenerExecutorUnexcluded event;
        @JsonProperty("t")
        public long time;
        @JsonProperty("execId")
        public String executorId;

        public SparkExecutorUnexcludedEventSummary(int eventNum, SparkListenerExecutorUnexcluded event) {
            super(eventNum);
            // this.event = event;
            this.time = event.time;
            this.executorId = event.executorId;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseExecutorUnexcluded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerNodeExcluded}
     */
    public static class SparkNodeExcludedEventSummary extends SparkEventSummary {

        // public SparkListenerNodeExcluded event;
        @JsonProperty("t")
        public long time;
        public String hostId;
        public int executorFailures;

        public SparkNodeExcludedEventSummary(int eventNum, SparkListenerNodeExcluded event) {
            super(eventNum);
            // this.event = event;
            this.time = event.time;
            this.hostId = event.hostId;
            this.executorFailures = event.executorFailures;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseNodeExcluded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerNodeExcludedForStage}
     */
    public static class SparkNodeExcludedForStageEventSummary extends SparkEventSummary {

        // public SparkListenerNodeExcludedForStage event;
        @JsonProperty("t")
        public long time;
        public String hostId;
        public int executorFailures;
        public int stageId;
        public int stageAttemptId;

        public SparkNodeExcludedForStageEventSummary(int eventNum, SparkListenerNodeExcludedForStage event) {
            super(eventNum);
            // this.event = event;
            this.time = event.time;
            this.hostId = event.hostId;
            this.executorFailures = event.executorFailures;
            this.stageId = event.stageId;
            this.stageAttemptId = event.stageAttemptId;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseNodeExcludedForStage(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerNodeUnexcluded}
     */
    public static class SparkNodeUnexcludedEventSummary extends SparkEventSummary {

        // public SparkListenerNodeUnexcluded event;
        @JsonProperty("t")
        public long time;
        public String hostId;

        public SparkNodeUnexcludedEventSummary(int eventNum, SparkListenerNodeUnexcluded event) {
            super(eventNum);
            // this.event = event;
            this.time = event.time;
            this.hostId = event.hostId;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseNodeUnexcluded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLExecutionStart} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLExecutionEnd} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLAdaptiveExecutionUpdate} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLAdaptiveSQLMetricUpdates}
     *
     */
    public static class SparkSQLExecutionEventSummary extends SparkEventSummary {

        public long execId;

        // TODO templatize, avoid full json serialization
        // public SparkListenerSQLExecutionStart startEvent;
        public long startTime;
        public String description;
        public String details;
        public Map<String, String> modifiedConfigs;

        // TODO templatize, avoid full json serialization
        // public List<SparkListenerSQLAdaptiveExecutionUpdate> updateEvents;
        public String lastPhysicalPlanDescription;
        public SparkPlanInfoSummary plan;

        // TODO compute and save final metric result values only, avoid full json serialization
        // public List<SparkListenerSQLAdaptiveSQLMetricUpdates> metricUpdateEvents;

        public List<SparkJobExecEventSummary> jobExecs;

        public int endEventNum;
        // TODO templatize, avoid full json serialization
        // public SparkListenerSQLExecutionEnd endEvent;
        public int duration; // => public long endTime = startTime + duration;

        public SparkSQLExecutionEventSummary(
                int startEventNum,
                SparkListenerSQLExecutionStart startEvent,
                List<SparkListenerSQLAdaptiveExecutionUpdate> updateEvents,
                List<SparkListenerSQLAdaptiveSQLMetricUpdates> metricUpdateEvents,
                List<SparkJobExecEventSummary> jobExecs,
                List<IdentifiedSparkEvent> detailedJobStageTaskEvents,
                int endEventNum,
                SparkListenerSQLExecutionEnd endEvent
        ) {
            super(startEventNum);
            this.startTime = startEvent.time;
            this.execId = startEvent.executionId;
            this.description = startEvent.description;
            this.details = startEvent.details;
            this.modifiedConfigs = startEvent.modifiedConfigs;

            // this.updateEvents = updateEvents;
            String lastPlanDescription = startEvent.physicalPlanDescription;
            SparkPlanInfo lastPlanInfo = startEvent.sparkPlanInfo;
            if (updateEvents != null) {
                for (SparkListenerSQLAdaptiveExecutionUpdate ue : updateEvents) {
                    lastPlanDescription = ue.physicalPlanDescription;
                    lastPlanInfo = ue.sparkPlanInfo;
                }
            }
            this.lastPhysicalPlanDescription = lastPlanDescription;
            Map<Integer, MetricValueHolderSummary> resultMetricByAccId = new HashMap<>();
            this.plan = new SparkPlanInfoSummary(lastPlanInfo, resultMetricByAccId);

            // this.metricUpdateEvents = metricUpdateEvents;
            if (metricUpdateEvents != null) {
                // compute and save metric result values into summary
                for (SparkListenerSQLAdaptiveSQLMetricUpdates mu : metricUpdateEvents) {
                    for (SQLPlanMetric m : mu.sqlPlanMetrics) {
                        // TODO accumulate ?
                        //m.
                    }
                }
            }
            if (detailedJobStageTaskEvents != null) {
                for (val detailIdentifiedEvent: detailedJobStageTaskEvents) {
                    SparkEvent detailedEvent = detailIdentifiedEvent.event;
                    if (detailedEvent instanceof SparkListenerJobStart) {
                        // TODO
                    } else if (detailedEvent instanceof SparkListenerJobEnd) {
                        // TODO
                    } else if (detailedEvent instanceof SparkListenerStageSubmitted) {
                        // TODO
                    } else if (detailedEvent instanceof SparkListenerStageCompleted) {
                        // TODO
                    } else if (detailedEvent instanceof SparkListenerTaskStart) {
                        // TODO
                    } else if (detailedEvent instanceof SparkListenerTaskEnd taskEndEvent) {
                        // TODO
                        TaskInfo taskInfo = taskEndEvent.taskInfo;
                        val accumulables = taskInfo.accumulables;
                        if (accumulables != null) {
                            for (AccumulableInfo accumulable : taskInfo.accumulables) {
                                val accId = accumulable.id;
                                MetricValueHolderSummary mvhs = resultMetricByAccId.get(accId);
                                if (mvhs != null) {
                                    mvhs.valuesUpdateCount++;
                                    mvhs.lastValue = accumulable.value;
                                    long update = accumulable.update;
                                    // keep min,max
                                    if (mvhs.valuesUpdateCount == 1) {
                                        mvhs.min = update;
                                        mvhs.max = update;
                                    } else {
                                        if (update < mvhs.min) {
                                            mvhs.min = update;
                                        }
                                        if (update > mvhs.max) {
                                            mvhs.max = update;
                                        }
                                    }
                                    // TOADD: resolve updates from jobId,stageId ...
                                    // need to have lineage Task->stage->Job, which is available only if tracking activeStages
                                    val taskId = taskInfo.taskId;
                                    // mvhs.fromStageId =
                                    // mvhs.fromJobId =
                                }
                            }
                        }
                    }
                }
            }

            this.jobExecs = jobExecs;

            // this.endEvent = endEvent;
            this.endEventNum = endEventNum;
            this.duration = (int) (endEvent.time - startEvent.time);
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.caseSQLExec(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkPlanInfo}
     */
    public static class SparkPlanInfoSummary {
        public String nodeName;
        public String simpleString;
        public List<SparkPlanInfoSummary> children;

        public Map<String,Object> metadata;

        public static class MetricValueHolderSummary {
            public String name;
            public int accId;
            public String metricType;
            public int valuesUpdateCount;
            public long lastValue;
            public long min;
            public long max;
            // may be super explicit: long[] values;  per rdd partition/taskIndex
            public int fromJobId;
            public int fromStageId;
        }
        public List<MetricValueHolderSummary> metrics;

        // useless
        // public long time;

        public SparkPlanInfoSummary(SparkPlanInfo planInfo, Map<Integer,MetricValueHolderSummary> resultMetricByAccId) {
            this.nodeName = planInfo.nodeName;
            this.simpleString = planInfo.simpleString;
            if (planInfo.children != null) {
                this.children = planInfo.children.stream().map(childPlan -> new SparkPlanInfoSummary(childPlan, resultMetricByAccId)).toList();
            }
            this.metadata = planInfo.metadata;
            if (planInfo.metrics != null) {
                this.metrics = planInfo.metrics.stream().map(m -> {
                    MetricValueHolderSummary ms = new MetricValueHolderSummary();
                    ms.name = m.name;
                    ms.accId = m.accumulatorId;
                    ms.metricType = m.metricType;
                    return ms;
                }).toList();
            }
            // this.time = planInfo.time;
        }
    }

}
