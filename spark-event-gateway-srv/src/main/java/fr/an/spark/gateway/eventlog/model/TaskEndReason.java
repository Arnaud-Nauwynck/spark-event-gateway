package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;
import com.sun.net.httpserver.Authenticator.Success;
import fr.an.spark.gateway.eventlog.model.TaskEndReason.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.val;

import java.util.ArrayList;
import java.util.List;

/**
 * see <a href="https://github.com/apache/spark/blob/master/core/src/main/scala/org/apache/spark/TaskEndReason.scala#L39">...</a>
 *
 * see <a href="https://github.com/apache/spark/blob/master/core/src/main/scala/org/apache/spark/util/JsonProtocol.scala#L692">...</a>
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = As.PROPERTY, property = "Reason") //
@JsonSubTypes({ //
        @Type(value = Success.class, name = "Success"), //
        @Type(value = Resubmitted.class, name = "Resubmitted"), //
        @Type(value = FetchFailed.class, name = "FetchFailed"), //
        @Type(value = ExceptionFailure.class, name = "ExceptionFailure"), //
        @Type(value = TaskResultLost.class, name = "TaskResultLost"), //
        @Type(value = TaskKilled.class, name = "TaskKilled"), //
        @Type(value = TaskCommitDenied.class, name = "TaskCommitDenied"), //
        @Type(value = ExecutorLostFailure.class, name = "ExecutorLostFailure"), //
        @Type(value = UnknownReason.class, name = "UnknownReason") //
})
public abstract class TaskEndReason {

    @JsonProperty("Reason")
    public String reason;
    
    // TODO cf JsonProtocol.java..

    public String toKillSummaryKeyOpt() {
        if (this instanceof TaskKilled k) {
            return k.reason;
        } else if (this instanceof TaskCommitDenied denied) {
            return denied.toErrorString();
        } else {
            return null;
        }
    }

    // -----------------------------------------------------------------------------------------------------------------

    public static class Success extends TaskEndReason {
    }

    /**
     * Various possible reasons why a task failed.
     */
    public static abstract class TaskFailedReason extends TaskEndReason {
        public abstract String toErrorString();
        public boolean countTowardsTaskFailures() { return true; }
    }

    public static class Resubmitted extends TaskFailedReason {
        @Override
        public String toErrorString() { return "Resubmitted (resubmitted due to lost executor)"; }
    }

    /**
     * Task failed to fetch shuffle data from a remote node
     */
    @NoArgsConstructor @AllArgsConstructor
    public static class FetchFailed extends TaskFailedReason {
        public BlockManagerId bmAddress;  // Note that bmAddress can be null
        public int shuffleId;
        public long mapId;
        public int mapIndex;
        public int reduceId;
        public String message;

        @Override
        public String toErrorString() {
            val bmAddressString = (bmAddress == null)? "null" : bmAddress.toString();
            val mapIndexString = (mapIndex == Integer.MIN_VALUE)? "Unknown" : mapIndex;
            return "FetchFailed(" + bmAddressString + ", shuffleId="  + shuffleId + ", mapIndex=" + mapIndexString + ", " +
                    "mapId=" + mapId + ", reduceId=" + reduceId + ", message=\n" + message + "\n)";
        }

        @Override
        public boolean countTowardsTaskFailures() { return false; }
    }

    /**
     * Task failed due to a runtime exception. This is the most common failure case and also captures
     * user program exceptions.
     */
    @NoArgsConstructor @AllArgsConstructor
    public static class ExceptionFailure extends TaskFailedReason {
        public String className;
        public String description;
        public StackTraceElement[] stackTrace;
        public String fullStackTrace;
        // private val exceptionWrapper: Option[ThrowableSerializationWrapper],
        public List<AccumulableInfo> accumUpdates = new ArrayList<>();
        // public List<AccumulatorV2<?,?>> accums;
        // public List<Long> metricPeaks;

        @Override
        public String toErrorString() {
            return fullStackTrace;
        }

    }


    /**
     * The task finished successfully, but the result was lost from the executor's block manager before
     * it was fetched.
     */
    public static class TaskResultLost extends TaskFailedReason {
        @Override
        public String toErrorString() { return "TaskResultLost (result lost from block manager)"; }
    }

    /**
     * Task was killed intentionally and needs to be rescheduled.
     */
    @NoArgsConstructor @AllArgsConstructor
    public static class TaskKilled extends TaskFailedReason {
        public String reason;
        public List<AccumulableInfo> accumUpdates;
        // List<AccumulatorV2[_, _]> accums;
        public List<Long> metricPeaks;

        @Override
        public String toErrorString() { return "TaskKilled (" + reason + ")"; }

        @Override
        public boolean countTowardsTaskFailures() { return false; }

    }

    /**
     * Task requested the driver to commit, but was denied.
     */
    @NoArgsConstructor @AllArgsConstructor
    public static class TaskCommitDenied extends TaskFailedReason {
        public int jobId;
        public int partitionId;
        public int attemptId;

        @Override
        public String toErrorString() {
            return "TaskCommitDenied (Driver denied task commit)" +
                " for job: " + jobId + ", partition: " + partitionId + ", attemptNumber: " + attemptId;
        }

        @Override
        public boolean countTowardsTaskFailures() { return false; }
    }

    /**
     * The task failed because the executor that it was running on was lost. This may happen because
     * the task crashed the JVM.
     */
    @NoArgsConstructor @AllArgsConstructor
    public static class ExecutorLostFailure extends TaskFailedReason {
        public String execId;
        public boolean exitCausedByApp = true;
        public String reason;

        @Override
        public String toErrorString() {
            val exitBehavior = (exitCausedByApp)? "caused by one of the running tasks"
                    : "unrelated to the running tasks";
            return "ExecutorLostFailure (executor " + execId + " exited " + exitBehavior + ")" +
                    ((reason != null)? " Reason: " + reason : "");
        }

        @Override
        public boolean countTowardsTaskFailures() { return exitCausedByApp; }
    }

    /**
     * We don't know why the task ended -- for example, because of a ClassNotFound exception when
     * deserializing the task result.
     */
    public static class UnknownReason extends TaskFailedReason {
        @Override
        public String toErrorString() { return  "UnknownReason"; }
    }

}

