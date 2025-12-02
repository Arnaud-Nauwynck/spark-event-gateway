package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class TaskInfo {

    @JsonProperty("Task ID")
    public long taskId;

    @JsonProperty("Index")
    public int index;

    @JsonProperty("Attempt")
    public int attempt;

    // TODO PATCH ARNAUD
    @JsonProperty("Partition ID")
    public int partitionId;

    @JsonProperty("Launch Time")
    public long launchTime;
    
    @JsonProperty("Executor ID")
    public String executorId;
    
    @JsonProperty("Host")
    public String host;

    @JsonProperty("Locality")
    public String locality;

    @JsonProperty("Speculative")
    public boolean speculative;

    @JsonProperty("Getting Result Time")
    public long gettingResultTime;

    @JsonProperty("Finish Time")
    public long finishTime;

    public long duration() {
        return finishTime - launchTime;
    }

    @JsonProperty("Failed")
    public boolean failed;

    @JsonProperty("Killed")
    public boolean killed;

    @JsonProperty("Accumulables")
    public List<AccumulableInfo> accumulables;
    
}
