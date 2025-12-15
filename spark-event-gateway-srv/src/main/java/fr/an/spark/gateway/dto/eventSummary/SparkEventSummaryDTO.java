package fr.an.spark.gateway.dto.eventSummary;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.*;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.SparkPlanInfoSummaryDTO.MetricValueHolderSummary;
import fr.an.spark.gateway.eventSummary.TemplateDictionariesToSummaryBuilder;
import fr.an.spark.gateway.eventTrackers.JobTracker;
import fr.an.spark.gateway.eventTrackers.SqlExecTracker;
import fr.an.spark.gateway.eventlog.model.ExecutorInfo;
import fr.an.spark.gateway.eventlog.model.SparkCallSite;
import fr.an.spark.gateway.eventlog.model.SparkEvent.*;
import fr.an.spark.gateway.eventlog.model.SparkException;
import fr.an.spark.gateway.eventlog.model.SparkPlanInfo;
import lombok.NoArgsConstructor;
import lombok.val;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AST class hierarchy for Spark Event Summary DTOs
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = As.PROPERTY, property = "type")
@JsonSubTypes({ //
        @Type(value = SparkApplicationStartEventSummaryDTO.class, name = "ApplicationStart"), //
        @Type(value = SparkApplicationEndEventSummaryDTO.class, name = "ApplicationEnd"), //
        @Type(value = SparkLogStartEventSummaryDTO.class, name = "LogStart"), //
        @Type(value = SparkResourceProfileAddedEventSummaryDTO.class, name = "ResourceProfileAdded"), //
        @Type(value = SparkEnvironmentUpdateEventSummaryDTO.class, name = "EnvUpdate"), //

        @Type(value = SparkBlockManagerAddedEventSummaryDTO.class, name = "BlockManagerAdded"), //
        @Type(value = SparkBlockManagerRemovedEventSummaryDTO.class, name = "BlockManagerRemoved"), //
        @Type(value = SparkExecutorAddedEventSummaryDTO.class, name = "ExecutorAdded"), //
        @Type(value = SparkExecutorRemovedEventSummaryDTO.class, name = "ExecutorRemoved"), //
        @Type(value = SparkExecutorExcludedEventSummaryDTO.class, name = "ExecutorExcluded"), //
        @Type(value = SparkExecutorExcludedForStageEventSummaryDTO.class, name = "ExecutorExcludedForStage"), //
        @Type(value = SparkExecutorUnexcludedEventSummaryDTO.class, name = "ExecutorUnexcluded"), //
        @Type(value = SparkNodeExcludedEventSummaryDTO.class, name = "NodeExcluded"), //
        @Type(value = SparkNodeExcludedForStageEventSummaryDTO.class, name = "NodeExcludedForStage"), //
        @Type(value = SparkNodeUnexcludedEventSummaryDTO.class, name = "NodeUnexcluded"), //

        // @Type(value = SparkBlockUpdatedEventSummaryDTO.class, name = "BlockUpdated"), //
        // @Type(value = SparkUnpersistRDDEventSummaryDTO.class, name = "UnpersistRDD"), //

        @Type(value = SparkTopLevelJobExecEventSummaryDTO.class, name = "TopLevelJobExec"), //

        // --------------------------------------------------------------------------------------------

        @Type(value = SparkSQLExecutionEventSummaryDTO.class, name = "SQLExec"), //

        // internal summary pseudo-events
        // -----------------------------------------------------------------------------------------------------------------
        @Type(value = NewCallSiteShortTemplateEventSummaryDTO.class, name = "NewCallSiteShortTemplate"), //
        @Type(value = NewCallSiteLongTemplateEventSummaryDTO.class, name = "NewCallSiteLongTemplate"), //
        @Type(value = NewPlanDescriptionTemplateEventSummaryDTO.class, name = "NewPlanDescriptionTemplate") //

        // ADD more event summary types here
        // @Type(value = SparkStreamingEventSummaryDTO.class, name = "StreamingEvent") //
        // ...


})
@NoArgsConstructor
public abstract class SparkEventSummaryDTO {

    /**
     *
     */
    @JsonProperty("n")
    public int eventNum;

    public SparkEventSummaryDTO(int eventNum) {
        this.eventNum = eventNum;
    }

    public abstract void accept(SparkEventSummaryVisitor visitor);


    // -----------------------------------------------------------------------------------------------------------------

    /**
     * see {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerApplicationStart}
     */
    @NoArgsConstructor
    public static class SparkApplicationStartEventSummaryDTO extends SparkEventSummaryDTO {

        public SparkListenerApplicationStart event;

        public SparkApplicationStartEventSummaryDTO(SparkListenerApplicationStart event) {
            super(event.eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onApplicationStart(this);
        }

    }

    /**
     * see {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerApplicationEnd}
     */
    @NoArgsConstructor
    public static class SparkApplicationEndEventSummaryDTO extends SparkEventSummaryDTO {

        public SparkListenerApplicationEnd event;

        public SparkApplicationEndEventSummaryDTO(SparkListenerApplicationEnd event) {
            super(event.eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onApplicationEnd(this);
        }

    }

    /**
     * see {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerLogStart}
     */
    @NoArgsConstructor
    public static class SparkLogStartEventSummaryDTO extends SparkEventSummaryDTO {

        public SparkListenerLogStart event;

        public SparkLogStartEventSummaryDTO(SparkListenerLogStart event) {
            super(event.eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onLogStart(this);
        }

    }

    /**
     * see {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerResourceProfileAdded}
     */
    @NoArgsConstructor
    public static class SparkResourceProfileAddedEventSummaryDTO extends SparkEventSummaryDTO {

        public SparkListenerResourceProfileAdded event;

        public SparkResourceProfileAddedEventSummaryDTO(SparkListenerResourceProfileAdded event) {
            super(event.eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onResourceProfileAdded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerEnvironmentUpdate}
     */
    @NoArgsConstructor
    public static class SparkEnvironmentUpdateEventSummaryDTO extends SparkEventSummaryDTO {

        public SparkListenerEnvironmentUpdate event;

        public SparkEnvironmentUpdateEventSummaryDTO(SparkListenerEnvironmentUpdate event) {
            super(event.eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onEnvironmentUpdate(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerBlockManagerAdded}
     */
    @NoArgsConstructor
    public static class SparkBlockManagerAddedEventSummaryDTO extends SparkEventSummaryDTO {

        public SparkListenerBlockManagerAdded event;

        public SparkBlockManagerAddedEventSummaryDTO(SparkListenerBlockManagerAdded event) {
            super(event.eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onBlockManagerAdded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerBlockManagerRemoved}
     */
    @NoArgsConstructor
    public static class SparkBlockManagerRemovedEventSummaryDTO extends SparkEventSummaryDTO {

        public SparkListenerBlockManagerRemoved event;

        public SparkBlockManagerRemovedEventSummaryDTO(SparkListenerBlockManagerRemoved event) {
            super(event.eventNum);
            this.event = event;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onBlockManagerRemoved(this);
        }

    }


    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorAdded}
     */
    @NoArgsConstructor
    public static class SparkExecutorAddedEventSummaryDTO extends SparkEventSummaryDTO {

        // public SparkListenerExecutorAdded event;
        @JsonProperty("t")
        public long time;

        @JsonProperty("execId")
        public String executorId;

        @JsonProperty("executorInfo")
        public ExecutorInfo executorInfo;

        public SparkExecutorAddedEventSummaryDTO(SparkListenerExecutorAdded event) {
            super(event.eventNum);
            // this.event = event;
            this.time = event.time;
            this.executorId = event.executorId;
            this.executorInfo = event.executorInfo;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onExecutorAdded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorRemoved}
     */
    @NoArgsConstructor
    public static class SparkExecutorRemovedEventSummaryDTO extends SparkEventSummaryDTO {

        // public SparkListenerExecutorRemoved event;
        @JsonProperty("t")
        public long t;

        @JsonProperty("execId")
        public String executorId;

        public String reason;

        public SparkExecutorRemovedEventSummaryDTO(SparkListenerExecutorRemoved event) {
            super(event.eventNum);
            // this.event = event;
            this.t = event.time;
            this.executorId = event.executorId;
            this.reason = event.reason;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onExecutorRemoved(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorExcluded}
     */
    @NoArgsConstructor
    public static class SparkExecutorExcludedEventSummaryDTO extends SparkEventSummaryDTO {

        // public SparkListenerExecutorExcluded event;
        @JsonProperty("t")
        public long time;

        @JsonProperty("execId")
        public String executorId;

        public int taskFailures;


        public SparkExecutorExcludedEventSummaryDTO(SparkListenerExecutorExcluded event) {
            super(event.eventNum);
            // this.event = event;
            this.time = event.time;
            this.executorId = event.executorId;
            this.taskFailures = event.taskFailures;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onExecutorExcluded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorExcludedForStage}
     */
    @NoArgsConstructor
    public static class SparkExecutorExcludedForStageEventSummaryDTO extends SparkEventSummaryDTO {

        // public SparkListenerExecutorExcludedForStage event;
        @JsonProperty("t")
        public long time;

        @JsonProperty("execId")
        public String executorId;

        public int taskFailures;
        public int stageId;
        public int stageAttemptId;

        public SparkExecutorExcludedForStageEventSummaryDTO(SparkListenerExecutorExcludedForStage event) {
            super(event.eventNum);
            // this.event = event;
            this.time = event.time;
            this.executorId = event.executorId;
            this.taskFailures = event.taskFailures;
            this.stageId = event.stageId;
            this.stageAttemptId = event.stageAttemptId;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onExecutorExcludedForStage(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerExecutorUnexcluded}
     */
    @NoArgsConstructor
    public static class SparkExecutorUnexcludedEventSummaryDTO extends SparkEventSummaryDTO {

        // public SparkListenerExecutorUnexcluded event;
        @JsonProperty("t")
        public long time;
        @JsonProperty("execId")
        public String executorId;

        public SparkExecutorUnexcludedEventSummaryDTO(SparkListenerExecutorUnexcluded event) {
            super(event.eventNum);
            // this.event = event;
            this.time = event.time;
            this.executorId = event.executorId;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onExecutorUnexcluded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerNodeExcluded}
     */
    @NoArgsConstructor
    public static class SparkNodeExcludedEventSummaryDTO extends SparkEventSummaryDTO {

        // public SparkListenerNodeExcluded event;
        @JsonProperty("t")
        public long time;
        public String hostId;
        public int executorFailures;

        public SparkNodeExcludedEventSummaryDTO(SparkListenerNodeExcluded event) {
            super(event.eventNum);
            // this.event = event;
            this.time = event.time;
            this.hostId = event.hostId;
            this.executorFailures = event.executorFailures;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onNodeExcluded(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerNodeExcludedForStage}
     */
    @NoArgsConstructor
    public static class SparkNodeExcludedForStageEventSummaryDTO extends SparkEventSummaryDTO {

        // public SparkListenerNodeExcludedForStage event;
        @JsonProperty("t")
        public long time;
        public String hostId;
        public int executorFailures;
        public int stageId;
        public int stageAttemptId;

        public SparkNodeExcludedForStageEventSummaryDTO(SparkListenerNodeExcludedForStage event) {
            super(event.eventNum);
            // this.event = event;
            this.time = event.time;
            this.hostId = event.hostId;
            this.executorFailures = event.executorFailures;
            this.stageId = event.stageId;
            this.stageAttemptId = event.stageAttemptId;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onNodeExcludedForStage(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerNodeUnexcluded}
     */
    @NoArgsConstructor
    public static class SparkNodeUnexcludedEventSummaryDTO extends SparkEventSummaryDTO {

        // public SparkListenerNodeUnexcluded event;
        @JsonProperty("t")
        public long time;
        public String hostId;

        public SparkNodeUnexcludedEventSummaryDTO(SparkListenerNodeUnexcluded event) {
            super(event.eventNum);
            // this.event = event;
            this.time = event.time;
            this.hostId = event.hostId;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onNodeUnexcluded(this);
        }

    }

    // Event Summaries for TopLevel Job Execution (and Stage ?)
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerJobStart} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerJobEnd}
     */
    @NoArgsConstructor
    public static class SparkTopLevelJobExecEventSummaryDTO extends SparkEventSummaryDTO {

        public int jobId;

        // fields from SparkListenerJobStart event:
        public long submitTime;
        public Map<String,String> propOverrides;

        public CallSiteTemplatedStringDTO callSiteTemplated;

        // fields from SparkListenerJobEnd event:
        public int duration; // => public long endTime = submitTime + duration;
        // fields from JobResult jobResult;
        public String result;
        public SparkException resultEx;

        public SparkTopLevelJobExecEventSummaryDTO(
                SparkListenerJobEnd endEvent,
                JobTracker job,
                TemplateDictionariesToSummaryBuilder templateDictionariesBuilder) {
            super(endEvent.eventNum);
            this.jobId = job.jobId;
            this.submitTime = job.submissionTime;
            this.propOverrides = job.getStartPropOverrides();

            // lookup callSite Short / Long in last Stage or Stage.rdd
            SparkCallSite callSite = job.callSiteFromStartStage();
            if (callSite != null) {
                this.callSiteTemplated = templateDictionariesBuilder.templatedFromCallSiteDic(callSite).toDTO();
            } else {
                this.callSiteTemplated = null;
            }

            // this.stageExecs = stageExecs;

            this.duration = (int) (endEvent.time - job.submissionTime);
            val jobRes = endEvent.jobResult;
            if (jobRes != null) {
                this.result = jobRes.result;
                this.resultEx = jobRes.exception;
            }
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onTopLevelJobExec(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerStageSubmitted} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerStageCompleted}
     */
    @NoArgsConstructor
    public static class SparkStageExecSummary {
        public int stageId;
        public int submitEventNum;
        public int submitTime;
        public int completedEventNum;
        public int duration; // => public long completionTime = submitTime + duration;
        // failure + retry attempts => see optional list
        public List<StageFailureAndRetryAttempt> failAndRetries;
    }

    @NoArgsConstructor
    public static class StageFailureAndRetryAttempt {
        public int retryAttempt;
        public String failureReason;
        public int nextSubmitEventNum;
        public int nextSubmitTime;
        public int nextDuration; // => public long completionTime = submitTime + duration;
    }


    // Spark SQL
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLExecutionStart} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLExecutionEnd} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLAdaptiveExecutionUpdate} and
     * {@link fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLAdaptiveSQLMetricUpdates}
     *
     */
    @NoArgsConstructor
    public static class SparkSQLExecutionEventSummaryDTO extends SparkEventSummaryDTO {

        public long execId;

        // TODO templatize, avoid full json serialization
        // public SparkListenerSQLExecutionStart startEvent;
        public long startTime;
        public CallSiteTemplatedStringDTO callSiteTemplated;
        public Map<String, String> modifiedConfigs;

        // TODO templatize, avoid full json serialization
        // public List<SparkListenerSQLAdaptiveExecutionUpdate> updateEvents;
        public SparkListenerSQLAdaptiveExecutionUpdate lastSQLAdaptiveExecutionUpdateEvent;

        // public String physicalPlanDescription;
        public int physicalPlanDescriptionTemplateId;

        public SparkPlanInfoSummaryDTO plan;

        // TODO compute and save final metric result values only, avoid full json serialization
        // public List<SparkListenerSQLAdaptiveSQLMetricUpdates> metricUpdateEvents;
        // public List<SparkJobExecEventSummary> jobExecs;

        public int endEventNum;
        // public SparkListenerSQLExecutionEnd endEvent;
        public int duration; // => public long endTime = startTime + duration;
        public String endErrorMessage;

        public SparkSQLExecutionEventSummaryDTO(
                SparkListenerSQLExecutionEnd endEvent,
                SqlExecTracker sqlExec,
                TemplateDictionariesToSummaryBuilder templateDictionariesBuilder) {
            super(endEvent.eventNum);
            this.execId = sqlExec.sqlId;

            val startEvent = sqlExec.getStartEvent();
            this.startTime = startEvent.time;
            this.execId = startEvent.executionId;

            val callSiteTemplatedString = templateDictionariesBuilder.templatedFromCallSiteDic(startEvent.description, startEvent.details);
            this.callSiteTemplated = callSiteTemplatedString.toDTO();
            this.modifiedConfigs = startEvent.modifiedConfigs;

            // this.updateEvents = updateEvents;
            String lastPlanDescription = startEvent.physicalPlanDescription;
            SparkPlanInfo lastPlanInfo = sqlExec.getCurrPlanInfo();

            val physicalPlanDescriptionTemplated = templateDictionariesBuilder.templatedFromPlanDescriptionDic(lastPlanDescription);
            this.physicalPlanDescriptionTemplateId = physicalPlanDescriptionTemplated.templateEntry.getTemplateId();

            Map<Integer, MetricValueHolderSummary> resultMetricByAccId = new HashMap<>();
            this.plan = new SparkPlanInfoSummaryDTO(lastPlanInfo, resultMetricByAccId);

//            // this.metricUpdateEvents = metricUpdateEvents;
//            if (metricUpdateEvents != null) {
//                // compute and save metric result values into summary
//                for (SparkListenerSQLAdaptiveSQLMetricUpdates mu : metricUpdateEvents) {
//                    for (SQLPlanMetric m : mu.sqlPlanMetrics) {
//                        // TODO accumulate ?
//                        //m.
//                    }
//                }
//            }
//            if (detailedJobStageTaskEvents != null) {
//                for (val detailIdentifiedEvent: detailedJobStageTaskEvents) {
//                    SparkEvent detailedEvent = detailIdentifiedEvent.event;
//                    if (detailedEvent instanceof SparkListenerJobStart) {
//                        // TODO
//                    } else if (detailedEvent instanceof SparkListenerJobEnd) {
//                        // TODO
//                    } else if (detailedEvent instanceof SparkListenerStageSubmitted) {
//                        // TODO
//                    } else if (detailedEvent instanceof SparkListenerStageCompleted) {
//                        // TODO
//                    } else if (detailedEvent instanceof SparkListenerTaskStart) {
//                        // TODO
//                    } else if (detailedEvent instanceof SparkListenerTaskEnd taskEndEvent) {
//                        // TODO
//                        TaskInfo taskInfo = taskEndEvent.taskInfo;
//                        val accumulables = taskInfo.accumulables;
//                        if (accumulables != null) {
//                            for (AccumulableInfo accumulable : taskInfo.accumulables) {
//                                val accId = accumulable.id;
//                                MetricValueHolderSummary mvhs = resultMetricByAccId.get(accId);
//                                if (mvhs != null) {
//                                    mvhs.valuesUpdateCount++;
//                                    if (accumulable.value instanceof Number accValueNum) {
//                                        mvhs.lastValue = accValueNum.longValue();
//                                        long update = ((Number) accumulable.update).longValue();
//                                        // keep min,max
//                                        if (mvhs.valuesUpdateCount == 1) {
//                                            mvhs.min = update;
//                                            mvhs.max = update;
//                                        } else {
//                                            if (update < mvhs.min) {
//                                                mvhs.min = update;
//                                            }
//                                            if (update > mvhs.max) {
//                                                mvhs.max = update;
//                                            }
//                                        }
//
//                                    }
//                                    // TOADD: resolve updates from jobId,stageId ...
//                                    // need to have lineage Task->stage->Job, which is available only if tracking activeStages
//                                    val taskId = taskInfo.taskId;
//                                    // mvhs.fromStageId =
//                                    // mvhs.fromJobId =
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//
//            this.jobExecs = jobExecs;

            // this.endEvent = endEvent;
            this.endEventNum = endEvent.eventNum;
            this.duration = (int) (endEvent.time - sqlExec.getStartTime());
            this.endErrorMessage = endEvent.errorMessage;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onSQLExec(this);
        }

    }

    /**
     * {@link fr.an.spark.gateway.eventlog.model.SparkPlanInfo}
     */
    @NoArgsConstructor
    public static class SparkPlanInfoSummaryDTO {
        public String nodeName;
        public String simpleString;
        public List<SparkPlanInfoSummaryDTO> children;

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

        public SparkPlanInfoSummaryDTO(SparkPlanInfo planInfo, Map<Integer,MetricValueHolderSummary> resultMetricByAccId) {
            this.nodeName = planInfo.nodeName;
            this.simpleString = planInfo.simpleString;
            if (planInfo.children != null) {
                this.children = planInfo.children.stream().map(childPlan -> new SparkPlanInfoSummaryDTO(childPlan, resultMetricByAccId)).toList();
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

    // Internal pseudo events, for Summary
    // -----------------------------------------------------------------------------------------------------------------

    /**
     *
     */
    @NoArgsConstructor
    public static class NewCallSiteShortTemplateEventSummaryDTO extends SparkEventSummaryDTO {
        public TemplateStringEntryDTO templateEntry;

        public NewCallSiteShortTemplateEventSummaryDTO(TemplateStringEntryDTO templateEntry) {
            this.templateEntry = templateEntry;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onNewCallSiteShortTemplate(this);
        }

    }

    /**
     *
     */
    @NoArgsConstructor
    public static class NewCallSiteLongTemplateEventSummaryDTO extends SparkEventSummaryDTO {
        public TemplateStringEntryDTO templateEntry;

        public NewCallSiteLongTemplateEventSummaryDTO(TemplateStringEntryDTO templateEntry) {
            this.templateEntry = templateEntry;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onNewCallSiteLongTemplate(this);
        }

    }

    /**
     *
     */
    @NoArgsConstructor
    public static class NewPlanDescriptionTemplateEventSummaryDTO extends SparkEventSummaryDTO {
        public TemplateStringEntryDTO templateEntry;

        public NewPlanDescriptionTemplateEventSummaryDTO(TemplateStringEntryDTO templateEntry) {
            this.templateEntry = templateEntry;
        }

        @Override
        public void accept(SparkEventSummaryVisitor visitor) {
            visitor.onNewPlanDescription(this);
        }

    }

}

