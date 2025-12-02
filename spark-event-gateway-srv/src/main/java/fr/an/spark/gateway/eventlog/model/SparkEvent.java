package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.*;
import fr.an.spark.gateway.eventlog.model.SparkEvent.*;
import fr.an.spark.gateway.utils.LsUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;

import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * AST class hierarchy for Spark events.
 * cf code: JsonProtocol.scala
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = As.PROPERTY, property = "Event")
@JsonSubTypes({ //
        @Type(value = SparkListenerStageSubmitted.class, name = "SparkListenerStageSubmitted"), //
        @Type(value = SparkListenerStageCompleted.class, name = "SparkListenerStageCompleted"), //
        @Type(value = SparkListenerTaskStart.class, name = "SparkListenerTaskStart"), //
        @Type(value = SparkListenerTaskGettingResult.class, name = "SparkListenerTaskGettingResult"), //
        @Type(value = SparkListenerSpeculativeTaskSubmitted.class, name = "SparkListenerSpeculativeTaskSubmitted"), //
        @Type(value = SparkListenerTaskEnd.class, name = "SparkListenerTaskEnd"), //
        @Type(value = SparkListenerJobStart.class, name = "SparkListenerJobStart"), //
        @Type(value = SparkListenerJobEnd.class, name = "SparkListenerJobEnd"), //
        @Type(value = SparkListenerEnvironmentUpdate.class, name = "SparkListenerEnvironmentUpdate"), //
        @Type(value = SparkListenerBlockManagerAdded.class, name = "SparkListenerBlockManagerAdded"), //
        @Type(value = SparkListenerBlockManagerRemoved.class, name = "SparkListenerBlockManagerRemoved"), //
        @Type(value = SparkListenerUnpersistRDD.class, name = "SparkListenerUnpersistRDD"), //
        @Type(value = SparkListenerExecutorAdded.class, name = "SparkListenerExecutorAdded"), //
        @Type(value = SparkListenerExecutorRemoved.class, name = "SparkListenerExecutorRemoved"), //
        @Type(value = SparkListenerExecutorBlacklisted.class, name = "SparkListenerExecutorBlacklisted"), //
        @Type(value = SparkListenerExecutorExcluded.class, name = "SparkListenerExecutorExcluded"), //
        @Type(value = SparkListenerExecutorBlacklistedForStage.class, name = "SparkListenerExecutorBlacklistedForStage"), //
        @Type(value = SparkListenerExecutorExcludedForStage.class, name = "SparkListenerExecutorExcludedForStage"), //
        @Type(value = SparkListenerNodeBlacklistedForStage.class, name = "SparkListenerNodeBlacklistedForStage"), //
        @Type(value = SparkListenerNodeExcludedForStage.class, name = "SparkListenerNodeExcludedForStage"), //
        @Type(value = SparkListenerExecutorUnblacklisted.class, name = "SparkListenerExecutorUnblacklisted"), //
        @Type(value = SparkListenerExecutorUnexcluded.class, name = "SparkListenerExecutorUnexcluded"), //
        @Type(value = SparkListenerNodeBlacklisted.class, name = "SparkListenerNodeBlacklisted"), //
        @Type(value = SparkListenerNodeExcluded.class, name = "SparkListenerNodeExcluded"), //
        @Type(value = SparkListenerNodeUnblacklisted.class, name = "SparkListenerNodeUnblacklisted"), //
        @Type(value = SparkListenerNodeUnexcluded.class, name = "SparkListenerNodeUnexcluded"), //
        @Type(value = SparkListenerUnschedulableTaskSetAdded.class, name = "SparkListenerUnschedulableTaskSetAdded"), //
        @Type(value = SparkListenerUnschedulableTaskSetRemoved.class, name = "SparkListenerUnschedulableTaskSetRemoved"), //
        @Type(value = SparkListenerBlockUpdated.class, name = "SparkListenerBlockUpdated"), //
        @Type(value = SparkListenerExecutorMetricsUpdate.class, name = "SparkListenerExecutorMetricsUpdate"), //
        @Type(value = SparkListenerStageExecutorMetrics.class, name = "SparkListenerStageExecutorMetrics"), //
        @Type(value = SparkListenerApplicationStart.class, name = "SparkListenerApplicationStart"), //
        @Type(value = SparkListenerApplicationEnd.class, name = "SparkListenerApplicationEnd"), //
        @Type(value = SparkListenerLogStart.class, name = "SparkListenerLogStart"), //
        @Type(value = SparkListenerResourceProfileAdded.class, name = "SparkListenerResourceProfileAdded"), //
        // --------------------------------------------------------------------------------------------
        @Type(value = SparkListenerSQLAdaptiveExecutionUpdate.class, name = "org.apache.spark.sql.execution.ui.SparkListenerSQLAdaptiveExecutionUpdate"), //
        @Type(value = SparkListenerSQLAdaptiveSQLMetricUpdates.class, name = "org.apache.spark.sql.execution.ui.SparkListenerSQLAdaptiveSQLMetricUpdates"), //
        @Type(value = SparkListenerSQLExecutionStart.class, name = "org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionStart"), //
        @Type(value = SparkListenerSQLExecutionEnd.class, name = "org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionEnd"), //
        @Type(value = SparkListenerDriverAccumUpdates.class, name = "org.apache.spark.sql.execution.ui.SparkListenerDriverAccumUpdates") //

})
@Slf4j
public abstract class SparkEvent {

    public void accept(SparkEventListener visitor) {
        visitor.onOtherEvent(this);
    }

    public static class SparkListenerStageSubmitted extends SparkEvent {
        @JsonProperty("Stage Info")
        public StageInfo stageInfo;
        
        @JsonProperty("Properties")
        public Map<String, Object> properties;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onStageSubmitted(this);
        }

    }

    public static class SparkListenerStageCompleted extends SparkEvent {
        @JsonProperty("Stage Info")
        public StageInfo stageInfo;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onStageCompleted(this);
        }
    }

    public static class SparkListenerTaskStart extends SparkEvent {
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;

        @JsonProperty("Task Info")
        public TaskInfo taskInfo;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onTaskStart(this);
        }
    }

    public static class SparkListenerTaskGettingResult extends SparkEvent {
        @JsonProperty("Task Info")
        public TaskInfo taskInfo;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onTaskGettingResult(this);
        }
    }

    public static class SparkListenerSpeculativeTaskSubmitted extends SparkEvent {
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onSpeculativeTaskSubmitted(this);
        }
    }

    public static class SparkListenerTaskEnd extends SparkEvent {
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
        
        @JsonProperty("Task Type")
        public String taskType;
        
        @JsonProperty("Task End Reason")
        public TaskEndReason reason;
        
        @JsonProperty("Task Info")
        public TaskInfo taskInfo;
        
        @JsonProperty("Task Executor Metrics")
        public ExecutorMetrics taskExecutorMetrics;
        
        // may be null if the task has failed
        @JsonProperty("Task Metrics")
        @Nullable
        public TaskMetrics taskMetrics;
        
        @JsonProperty("Metadata")
        @Nullable
        public Map<String, Object> metadata;


        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onTaskEnd(this);
        }
    }

    public static class SparkListenerJobStart extends SparkEvent {

        @JsonProperty("Job ID")
        public int jobId;
        
        @JsonProperty("Submission Time")
        public long time;
        
        @JsonProperty("Stage Infos")
        public List<StageInfo> stageInfos;

        @JsonProperty("Stage IDs")
        public List<Integer> stageIds; // redundant with stageInfos

        @JsonProperty("Properties")
        public Map<String, Object> properties;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onJobStart(this);
        }
    }

    public static class SparkListenerJobEnd extends SparkEvent {
        @JsonProperty("Job ID")
        public int jobId;

        @JsonProperty("Completion Time")
        public long time;
        
        @JsonProperty("Job Result")
        public JobResult jobResult;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onJobEnd(this);
        }
    }

    /**
     * case class SparkListenerEnvironmentUpdate(
     *     environmentDetails: Map[String, collection.Seq[(String, String)]])
     */
    public static class SparkListenerEnvironmentUpdate extends SparkEvent {
        
        @JsonProperty("JVM Information")
        public Map<String, String> jvmInformation;

        @JsonProperty("Spark Properties")
        public Map<String, String> sparkProperties;

        @JsonProperty("Hadoop Properties")
        public Map<String, String> hadoopProperties;
        
        @JsonProperty("System Properties")
        public Map<String, String> systemProperties;
        
        @JsonProperty("Classpath Entries")
        public Map<String, String> classpathEntries;

        @JsonProperty("Metrics Properties")
        public Map<String, String> metricsProperties;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onEnvironmentUpdate(this);
        }

        public Map<String, Map<String,String>> otherEnvironmentDetails = new HashMap<>();
        @JsonAnySetter
        public void setOtherEnvironmentDetails(String key, Object value) {
            try {
                @SuppressWarnings({"unchecked", "rawtypes"})
                Map<String, String> valueMap = (Map<String, String>) (Map) value;
                otherEnvironmentDetails.put(key, valueMap);
            } catch(Exception ex) {
                log.warn("Cannot handle unknown environment detail key=" + key + " value=" + value, ex);
            }
        }

        @JsonAnyGetter
        public Map<String, Map<String,String>> getOtherEnvironmentDetails() {
            return otherEnvironmentDetails;
        }
    }

    /**
     * 
     */
    public static class SparkListenerBlockManagerAdded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;

        @JsonProperty("Block Manager ID")
        public BlockManagerId blockManagerId;
        
        @JsonProperty("Maximum Memory")
        public long maxMem;
        
        @JsonProperty("Maximum Onheap Memory")
        public @Nullable Long maxOnHeapMem;
        
        @JsonProperty("Maximum Offheap Memory")
        public @Nullable Long maxOffHeapMem;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onBlockManagerAdded(this);
        }
    }

    /**
     * 
     */
    public static class SparkListenerBlockManagerRemoved extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Block Manager ID")
        public BlockManagerId blockManagerId;
        
        @JsonProperty("Maximum Memory")
        public long maxMem;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onBlockManagerRemoved(this);
        }
    }

    /**
     * 
     */
    public static class SparkListenerUnpersistRDD extends SparkEvent {
        @JsonProperty("RDD ID")
        public int rddId;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onUnpersistRDD(this);
        }
    }

    /**
     * 
     */
    public static class SparkListenerExecutorAdded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;

        @JsonProperty("Executor ID")
        public String executorId;
        
        @JsonProperty("Executor Info")
        public ExecutorInfo executorInfo;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onExecutorAdded(this);
        }
    }

    public static class SparkListenerExecutorRemoved extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public String executorId;

        @JsonProperty("Removed Reason")
        public String reason;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onExecutorRemoved(this);
        }
    }

    /**
     * 
     */
    // @Deprecated("use SparkListenerExecutorExcluded instead", "3.1.0")
    public static class SparkListenerExecutorBlacklisted extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public String executorId;
        
        public int taskFailures;

        public SparkListenerExecutorExcluded replaceByEvent() {
            return new SparkListenerExecutorExcluded(time, executorId, taskFailures);
        }

        @Override
        @SuppressWarnings("deprecation")
        public void accept(SparkEventListener visitor) {
            visitor.onExecutorBlacklisted(this);
        }
    }

    /**
     * 
     */
    // @Since("3.1.0")
    @NoArgsConstructor @AllArgsConstructor
    public static class SparkListenerExecutorExcluded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public String executorId;
        
        public int taskFailures;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onExecutorExcluded(this);
        }
    }

    /**
     * 
     */
    // @Deprecated("use SparkListenerExecutorExcludedForStage instead", "3.1.0")
    public static class SparkListenerExecutorBlacklistedForStage extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public String executorId;
        
        public int taskFailures;
        
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;

        public SparkListenerExecutorExcludedForStage replaceByEvent() {
            return new SparkListenerExecutorExcludedForStage(time, executorId, taskFailures, stageId, stageAttemptId);
        }

        @Override
        @SuppressWarnings("deprecation")
        public void accept(SparkEventListener visitor) {
            visitor.onExecutorBlacklistedForStage(this);
        }

    }

    // @Since("3.1.0")
    @NoArgsConstructor @AllArgsConstructor
    public static class SparkListenerExecutorExcludedForStage extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public String executorId;
        
        public int taskFailures;
        
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onExecutorExcludedForStage(this);
        }
    }

    // @Deprecated("use SparkListenerNodeExcludedForStage instead", "3.1.0")
    public static class SparkListenerNodeBlacklistedForStage extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;
        public int executorFailures;
        
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;

        @Override
        @SuppressWarnings("deprecation")
        public void accept(SparkEventListener visitor) {
            visitor.onNodeBlacklistedForStage(this);
        }

        public SparkListenerNodeExcludedForStage replaceByEvent() {
            return new SparkListenerNodeExcludedForStage(time, hostId, executorFailures, stageId, stageAttemptId);
        }
    }

    // @Since("3.1.0")
    @NoArgsConstructor @AllArgsConstructor
    public static class SparkListenerNodeExcludedForStage extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;
        public int executorFailures;
        
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onNodeExcludedForStage(this);
        }
    }

    // @deprecated("use SparkListenerExecutorUnexcluded instead", "3.1.0")
    public static class SparkListenerExecutorUnblacklisted extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public String executorId;

        @Override
        @SuppressWarnings("deprecation")
        public void accept(SparkEventListener visitor) {
            visitor.onExecutorUnblacklisted(this);
        }

        public SparkListenerExecutorUnexcluded replaceByEvent() {
            return new SparkListenerExecutorUnexcluded(time, executorId);
        }
    }

    @NoArgsConstructor @AllArgsConstructor
    public static class SparkListenerExecutorUnexcluded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public String executorId;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onExecutorUnexcluded(this);
        }
    }

    // @Deprecated("use SparkListenerNodeExcluded instead", "3.1.0")
    public static class SparkListenerNodeBlacklisted extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;
        public int executorFailures;

        @Override
        @SuppressWarnings("deprecation")
        public void accept(SparkEventListener visitor) {
            visitor.onNodeBlacklisted(this);
        }

        public SparkListenerNodeExcluded replaceByEvent() {
            return new SparkListenerNodeExcluded(time, hostId, executorFailures);
        }
    }

    // @Since("3.1.0")
    @NoArgsConstructor @AllArgsConstructor
    public static class SparkListenerNodeExcluded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;
        public int executorFailures;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onNodeExcluded(this);
        }
    }

    // @deprecated("use SparkListenerNodeUnexcluded instead", "3.1.0")
    public static class SparkListenerNodeUnblacklisted extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;

        public SparkListenerNodeUnexcluded deprecatedEventReplace() {
            return new SparkListenerNodeUnexcluded(time, hostId);
        }
        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onNodeUnexcluded(deprecatedEventReplace());
        }

        public SparkListenerNodeUnexcluded replaceByEvent() {
            return new SparkListenerNodeUnexcluded(time, hostId);
        }
    }

    // @Since("3.1.0")
    @NoArgsConstructor @AllArgsConstructor
    public static class SparkListenerNodeUnexcluded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onNodeUnexcluded(this);
        }
    }

    // @Since("3.1.0")
    public static class SparkListenerUnschedulableTaskSetAdded extends SparkEvent {
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onUnschedulableTaskSetAdded(this);
        }
    }

    // @Since("3.1.0")
    public static class SparkListenerUnschedulableTaskSetRemoved extends SparkEvent {
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onUnschedulableTaskSetRemoved(this);
        }
    }

    public static class SparkListenerBlockUpdated extends SparkEvent {
        public BlockUpdatedInfo blockUpdatedInfo;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onBlockUpdated(this);
        }
    }

    public static class AccumUpdate {
        public long taskId;
        
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
        
        public List<AccumulableInfo> accumUpdates;
    }

    /**
     * Periodic updates from executors.
     */
    public static class SparkListenerExecutorMetricsUpdate extends SparkEvent {
        public String execId;
        public List<AccumUpdate> accumUpdates;
        // TODO stageId,stageAttemptId ??
        public Map<Object/* (Int, Int) */, ExecutorMetrics> executorUpdates;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onExecutorMetricsUpdate(this);
        }
    }

    /**
     * Peak metric values for the executor for the stage, written to the history log
     * at stage completion.
     */
    public static class SparkListenerStageExecutorMetrics extends SparkEvent {
        public String execId;

        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
        
        public ExecutorMetrics executorMetrics;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onStageExecutorMetrics(this);
        }
    }

    /**
     * 
     */
    public static class SparkListenerApplicationStart extends SparkEvent {
        @JsonProperty("App Name")
        public String appName;
        
        @JsonProperty("App ID")
        public @Nullable String appId;
        
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("User")
        public String sparkUser;
        
        @JsonProperty("App Attempt ID")
        public @Nullable String appAttemptId;

        @JsonProperty("Driver Logs")
        public @Nullable Map<String, String> driverLogs;
        
        @JsonProperty("Driver Attributes")
        public @Nullable Map<String, String> driverAttributes;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onApplicationStart(this);
        }
    }

    public static class SparkListenerApplicationEnd extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onApplicationEnd(this);
        }
    }

    /**
     * An internal class that describes the metadata of an event log.
     */
    public static class SparkListenerLogStart extends SparkEvent {
        @JsonProperty("Spark Version")
        public String version;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onLogStart(this);
        }
    }

    /**
     * 
     */
    public static class ExecutorResourceRequest {
        
        @JsonProperty("Resource Name")
        public String resourceName;
        
        @JsonProperty("Amount")
        public int amount;
        
        @JsonProperty("Discovery Script")
        public String discoveryScript;
        
        @JsonProperty("Vendor")
        public String vendor;
    }

    /**
     * 
     */
    public static class SparkListenerResourceProfileAdded extends SparkEvent {
        
        @JsonProperty("Resource Profile Id")
        public int resourceProfileId;
        
        public ResourceProfile resourceProfile;
        
        @JsonProperty("Executor Resource Requests")
        public Map<String, ExecutorResourceRequest> executorResourceRequests;

        @JsonProperty("Task Resource Requests")
        public Map<String, ExecutorResourceRequest> taskResourceRequests;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onResourceProfileAdded(this);
        }
    }

    /**
     * since 3.2.0
     */
    @Getter
    public static class SparkListenerMiscellaneousProcessAdded extends SparkEvent {
        public long time;
        public String processId;
        public MiscellaneousProcessDetails info;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onMiscellaneousProcessAdded(this);
        }
    }


    // cf spark source: sql/core/src/main/scala/org/apache/spark/sql/execution/ui/SQLListener.scala
    // --------------------------------------------------------------------------------------------

    /**
     *
     */
    @Getter
    public static class SparkListenerSQLAdaptiveExecutionUpdate extends SparkEvent {

        public long executionId;
        
        public String physicalPlanDescription;
        
        public SparkPlanInfo sparkPlanInfo;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onSQLAdaptiveExecutionUpdate(this);
        }
    }


    /**
     *
     */
    @Getter
    public static class SparkListenerSQLAdaptiveSQLMetricUpdates extends SparkEvent {

        public long executionId;

        public List<SQLPlanMetric> sqlPlanMetrics;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onSQLAdaptiveSQLMetricUpdates(this);
        }
    }

    /**
     *
     */
    @Getter
    public static class SparkListenerSQLExecutionStart extends SparkEvent {

          public long executionId;

          public String description;

          public String details;

          public String physicalPlanDescription;

          public SparkPlanInfo sparkPlanInfo;

          public Map<String, String> modifiedConfigs;

          public long time;

          @Override
          public void accept(SparkEventListener visitor) {
              visitor.onSQLExecutionStart(this);
          }
    }

    /**
     *
     */
    @Getter
    public static class SparkListenerSQLExecutionEnd extends SparkEvent {

        public long executionId;

        public long time;

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onSQLExecutionEnd(this);
        }
    }

    public record AccumUpdateValue(int id, long value) {
    }

    /**
     * A message used to update SQL metric value for driver-side updates (which doesn't get reflected
     * automatically).
     */
    public static class SparkListenerDriverAccumUpdates extends SparkEvent {

        public long executionId;

        // List< (accumulatorId, value) >
        public List<List<Long>> accumUpdates;

        public List<AccumUpdateValue> toAccumUpdateValues() {
            return LsUtils.map(accumUpdates, tuple -> {
                int id = ((Number) tuple.get(0)).intValue();
                long value = tuple.get(1);
                return new AccumUpdateValue(id, value);
            });
        }

        @Override
        public void accept(SparkEventListener visitor) {
            visitor.onSQLDriverAccumUpdates(this);
        }
    }

}
