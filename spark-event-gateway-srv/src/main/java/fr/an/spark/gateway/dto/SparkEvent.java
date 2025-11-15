package fr.an.spark.gateway.dto;

import org.springframework.lang.Nullable;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;

import java.util.List;
import java.util.Map;
import java.util.Properties;

import fr.an.spark.gateway.dto.SparkEvent.SparkListenerApplicationEnd;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerApplicationStart;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerBlockManagerAdded;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerBlockManagerRemoved;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerBlockUpdated;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerDriverAccumUpdates;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerEnvironmentUpdate;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerExecutorAdded;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerExecutorBlacklisted;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerExecutorBlacklistedForStage;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerExecutorExcluded;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerExecutorExcludedForStage;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerExecutorMetricsUpdate;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerExecutorRemoved;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerExecutorUnblacklisted;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerExecutorUnexcluded;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerJobEnd;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerJobStart;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerLogStart;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerNodeBlacklisted;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerNodeBlacklistedForStage;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerNodeExcluded;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerNodeExcludedForStage;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerNodeUnblacklisted;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerNodeUnexcluded;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerResourceProfileAdded;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerSQLAdaptiveExecutionUpdate;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerSQLAdaptiveSQLMetricUpdates;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerSQLExecutionEnd;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerSQLExecutionStart;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerSpeculativeTaskSubmitted;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerStageCompleted;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerStageExecutorMetrics;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerStageSubmitted;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerTaskEnd;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerTaskGettingResult;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerTaskStart;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerUnpersistRDD;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerUnschedulableTaskSetAdded;
import fr.an.spark.gateway.dto.SparkEvent.SparkListenerUnschedulableTaskSetRemoved;

/**
 * cf code:
 * 
 * <PRE>
 * &#64;JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "Event")
   trait SparkListenerEvent {
     protected[spark] def logEvent: Boolean = true
   }
 * </PRE>
 *
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = As.PROPERTY, property = "Event")
@JsonSubTypes({ //
        @Type(value = SparkListenerStageSubmitted.class, name="SparkListenerStageSubmitted"), //
        @Type(value = SparkListenerStageCompleted.class, name="SparkListenerStageCompleted"), //
        @Type(value = SparkListenerTaskStart.class, name="SparkListenerTaskStart"), //
        @Type(value = SparkListenerTaskGettingResult.class, name="SparkListenerTaskGettingResult"), //
        @Type(value = SparkListenerSpeculativeTaskSubmitted.class, name="SparkListenerSpeculativeTaskSubmitted"), //
        @Type(value = SparkListenerTaskEnd.class, name="SparkListenerTaskEnd"), //
        @Type(value = SparkListenerJobStart.class, name="SparkListenerJobStart"), //
        @Type(value = SparkListenerJobEnd.class, name="SparkListenerJobEnd"), //
        @Type(value = SparkListenerEnvironmentUpdate.class, name="SparkListenerEnvironmentUpdate"), //
        @Type(value = SparkListenerBlockManagerAdded.class, name="SparkListenerBlockManagerAdded"), //
        @Type(value = SparkListenerBlockManagerRemoved.class, name="SparkListenerBlockManagerRemoved"), //
        @Type(value = SparkListenerUnpersistRDD.class, name="SparkListenerUnpersistRDD"), //
        @Type(value = SparkListenerExecutorAdded.class, name="SparkListenerExecutorAdded"), //
        @Type(value = SparkListenerExecutorRemoved.class, name="SparkListenerExecutorRemoved"), //
        @Type(value = SparkListenerExecutorBlacklisted.class, name="SparkListenerExecutorBlacklisted"), //
        @Type(value = SparkListenerExecutorExcluded.class, name="SparkListenerExecutorExcluded"), //
        @Type(value = SparkListenerExecutorBlacklistedForStage.class, name="SparkListenerExecutorBlacklistedForStage"), //
        @Type(value = SparkListenerExecutorExcludedForStage.class, name="SparkListenerExecutorExcludedForStage"), //
        @Type(value = SparkListenerNodeBlacklistedForStage.class, name="SparkListenerNodeBlacklistedForStage"), //
        @Type(value = SparkListenerNodeExcludedForStage.class, name="SparkListenerNodeExcludedForStage"), //
        @Type(value = SparkListenerExecutorUnblacklisted.class, name="SparkListenerExecutorUnblacklisted"), //
        @Type(value = SparkListenerExecutorUnexcluded.class, name="SparkListenerExecutorUnexcluded"), //
        @Type(value = SparkListenerNodeBlacklisted.class, name="SparkListenerNodeBlacklisted"), //
        @Type(value = SparkListenerNodeExcluded.class, name="SparkListenerNodeExcluded"), //
        @Type(value = SparkListenerNodeUnblacklisted.class, name="SparkListenerNodeUnblacklisted"), //
        @Type(value = SparkListenerNodeUnexcluded.class, name="SparkListenerNodeUnexcluded"), //
        @Type(value = SparkListenerUnschedulableTaskSetAdded.class, name="SparkListenerUnschedulableTaskSetAdded"), //
        @Type(value = SparkListenerUnschedulableTaskSetRemoved.class, name="SparkListenerUnschedulableTaskSetRemoved"), //
        @Type(value = SparkListenerBlockUpdated.class, name="SparkListenerBlockUpdated"), //
        @Type(value = SparkListenerExecutorMetricsUpdate.class, name="SparkListenerExecutorMetricsUpdate"), //
        @Type(value = SparkListenerStageExecutorMetrics.class, name="SparkListenerStageExecutorMetrics"), //
        @Type(value = SparkListenerApplicationStart.class, name="SparkListenerApplicationStart"), //
        @Type(value = SparkListenerApplicationEnd.class, name="SparkListenerApplicationEnd"), //
        @Type(value = SparkListenerLogStart.class, name="SparkListenerLogStart"), //
        @Type(value = SparkListenerResourceProfileAdded.class, name="SparkListenerResourceProfileAdded"), //
        // --------------------------------------------------------------------------------------------
        @Type(value = SparkListenerSQLAdaptiveExecutionUpdate.class, name="org.apache.spark.sql.execution.ui.SparkListenerSQLAdaptiveExecutionUpdate"), //
        @Type(value = SparkListenerSQLAdaptiveSQLMetricUpdates.class, name="org.apache.spark.sql.execution.ui.SparkListenerSQLAdaptiveSQLMetricUpdates"), //
        @Type(value = SparkListenerSQLExecutionStart.class, name="org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionStart"), //
        @Type(value = SparkListenerSQLExecutionEnd.class, name="org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionEnd"), //
        @Type(value = SparkListenerDriverAccumUpdates.class, name="org.apache.spark.sql.execution.ui.SparkListenerDriverAccumUpdates") //

})
public abstract class SparkEvent {

    public static class SparkListenerStageSubmitted extends SparkEvent {
        @JsonProperty("Stage Info")
        public StageInfo stageInfo;
        
        @JsonProperty("Properties")
        public Properties properties;
    }

    public static class SparkListenerStageCompleted extends SparkEvent {
        @JsonProperty("Stage Info")
        public StageInfo stageInfo;
    }

    public static class SparkListenerTaskStart extends SparkEvent {
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;

        @JsonProperty("Task Info")
        public TaskInfo taskInfo;
    }

    public static class SparkListenerTaskGettingResult extends SparkEvent {
        @JsonProperty("Task Info")
        public TaskInfo taskInfo;
    }

    public static class SparkListenerSpeculativeTaskSubmitted extends SparkEvent {
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
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
        public Map<String,Object> metadata;
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
        public Properties properties;
    }

    public static class SparkListenerJobEnd extends SparkEvent {
        @JsonProperty("Job ID")
        public int jobId;

        @JsonProperty("Completion Time")
        public long time;
        
        @JsonProperty("Job Result")
        public JobResult jobResult;
    }

    /**
     * 
     */
    public static class SparkListenerEnvironmentUpdate extends SparkEvent {
        
        @JsonProperty("JVM Information")
        public Map<String,String> jvmInformation;

        @JsonProperty("Spark Properties")
        public Map<String, String> sparkProperties;

        @JsonProperty("Hadoop Properties")
        public Map<String, String> hadoopProperties;
        
        @JsonProperty("System Properties")
        public Map<String, String> systemProperties;
        
        @JsonProperty("Classpath Entries")
        public Map<String, String> classpathEntries;
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
    }

    /**
     * 
     */
    public static class SparkListenerUnpersistRDD extends SparkEvent {
        @JsonProperty("RDD ID")
        public int rddId;
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
    }

    public static class SparkListenerExecutorRemoved extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public String executorId;
        
        public String reason;
    }

    /**
     * 
     */
    // @Deprecated("use SparkListenerExecutorExcluded instead", "3.1.0")
    public static class SparkListenerExecutorBlacklisted extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public long executorId;
        
        public int taskFailures;
    }

    /**
     * 
     */
    // @Since("3.1.0")
    public static class SparkListenerExecutorExcluded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public long executorId;
        
        public int taskFailures;
    }

    /**
     * 
     */
    // @Deprecated("use SparkListenerExecutorExcludedForStage instead", "3.1.0")
    public static class SparkListenerExecutorBlacklistedForStage extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public long executorId;
        
        public int taskFailures;
        
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
    }

    // @Since("3.1.0")
    public static class SparkListenerExecutorExcludedForStage extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public long executorId;
        
        public int taskFailures;
        
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
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
    }

    // @Since("3.1.0")
    public static class SparkListenerNodeExcludedForStage extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;
        public int executorFailures;
        
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
    }

    // @deprecated("use SparkListenerExecutorUnexcluded instead", "3.1.0")
    public static class SparkListenerExecutorUnblacklisted extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public long executorId;
    }

    public static class SparkListenerExecutorUnexcluded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        @JsonProperty("Executor ID")
        public long executorId;
    }

    // @Deprecated("use SparkListenerNodeExcluded instead", "3.1.0")
    public static class SparkListenerNodeBlacklisted extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;
        public int executorFailures;
    }

    // @Since("3.1.0")
    public static class SparkListenerNodeExcluded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;
        public int executorFailures;
    }

    // @deprecated("use SparkListenerNodeUnexcluded instead", "3.1.0")
    public static class SparkListenerNodeUnblacklisted extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;
    }

    // @Since("3.1.0")
    public static class SparkListenerNodeUnexcluded extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
        
        public String hostId;
    }

    // @Since("3.1.0")
    public static class SparkListenerUnschedulableTaskSetAdded extends SparkEvent {
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
    }

    // @Since("3.1.0")
    public static class SparkListenerUnschedulableTaskSetRemoved extends SparkEvent {
        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
    }

    public static class SparkListenerBlockUpdated extends SparkEvent {
        public BlockUpdatedInfo blockUpdatedInfo;
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
     * 
     * @param execId          executor id
     * @param accumUpdates    sequence of (taskId, stageId, stageAttemptId,
     *                        accumUpdates)
     * @param executorUpdates executor level per-stage metrics updates
     */
    public static class SparkListenerExecutorMetricsUpdate extends SparkEvent {
        public int execId;
        public List<AccumUpdate> accumUpdates;
        public Map<Object/* (Int, Int) */, ExecutorMetrics> executorUpdates;
    }

    /**
     * Peak metric values for the executor for the stage, written to the history log
     * at stage completion.
     */
    public static class SparkListenerStageExecutorMetrics extends SparkEvent {
        public int execId;

        @JsonProperty("Stage ID")
        public int stageId;
        
        @JsonProperty("Stage Attempt ID")
        public int stageAttemptId;
        
        public ExecutorMetrics executorMetrics;
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
    }

    public static class SparkListenerApplicationEnd extends SparkEvent {
        @JsonProperty("Timestamp")
        public long time;
    }

    /**
     * An internal class that describes the metadata of an event log.
     */
    public static class SparkListenerLogStart extends SparkEvent {
        @JsonProperty("Spark Version")
        public String version;
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
        
        // ?? public ResourceProfile resourceProfile;
        
        @JsonProperty("Executor Resource Requests")
        public Map<String,ExecutorResourceRequest> executorResourceRequests;
        
        @JsonProperty("Task Resource Requests") 
        public Map<String,ExecutorResourceRequest> taskResourceRequests;
    }

    // cf spark source: sql/core/src/main/scala/org/apache/spark/sql/execution/ui/SQLListener.scala
    // --------------------------------------------------------------------------------------------
    
    public static class SparkListenerSQLAdaptiveExecutionUpdate extends SparkEvent {

        public long executionId;
        
        public String physicalPlanDescription;
        
        public SparkPlanInfo sparkPlanInfo;
    }
    

      public static class SparkListenerSQLAdaptiveSQLMetricUpdates extends SparkEvent {

          public long executionId;

          public List<SQLPlanMetric> sqlPlanMetrics;
      }

      /**
       * 
       */
      public static class SparkListenerSQLExecutionStart extends SparkEvent {

          public long executionId;

          public String description;

          public String details;

          public String physicalPlanDescription;

          public SparkPlanInfo sparkPlanInfo;
          
          public long time;
      }

      public static class SparkListenerSQLExecutionEnd extends SparkEvent {

          public long executionId;

          public long time; 
    }

    /**
     * A message used to update SQL metric value for driver-side updates (which doesn't get reflected
     * automatically).
     */
    public static class SparkListenerDriverAccumUpdates extends SparkEvent {

        public long executionId;

        public List<List<Long>> accumUpdates;
    }

}
