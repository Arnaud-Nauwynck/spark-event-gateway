package fr.an.spark.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BlockManagerId {
    
    @JsonProperty("Executor ID")
    public String executorId;
    
    @JsonProperty("Host")
    public String host;
    
    @JsonProperty("Port")
    public int port;
}
