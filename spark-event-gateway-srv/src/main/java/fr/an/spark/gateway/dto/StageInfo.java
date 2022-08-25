package fr.an.spark.gateway.dto;

import org.springframework.lang.Nullable;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class StageInfo {

    @JsonProperty("Stage ID")
    public int stageId;
    
    @JsonProperty("Stage Attempt ID")
    public int attemptId;
    
    @JsonProperty("Stage Name")
    public String name;
    
    @JsonProperty("Number of Tasks")
    public int numTasks;
    
    @JsonProperty("RDD Info")
    public List<RDDInfo> rddInfos;
    
    @JsonProperty("Parent IDs")
    public List<Integer> parentIds;
    
    @JsonProperty("Details")
    public String details;
    
    @JsonProperty("Task Metrics")
    public TaskMetrics taskMetrics;
    
    @JsonProperty("Resource Profile Id")
    public int resourceProfileId;
    
    /** When this stage was submitted from the DAGScheduler to a TaskScheduler. */
    @JsonProperty("Submission Time")
    public @Nullable Long submissionTime;
    
    /** Time when all tasks in the stage completed or when the stage was cancelled. */
    @JsonProperty("Completion Time")
    public @Nullable Long completionTime;
    
    /** If the stage failed, the reason why. */
    @JsonProperty("Failure Reason")
    public @Nullable String failureReason;

    /** Terminal values of accumulables updated during this stage, including all the user-defined accumulators. */
    @JsonProperty("Accumulables")
    public List<AccumulableInfo> accumulables;

}
