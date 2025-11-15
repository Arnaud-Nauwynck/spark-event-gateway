package fr.an.spark.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TaskEndReason {

    @JsonProperty("Reason")
    public String reason;
    
    // TODO cf JsonProtocol.java..
    
}
