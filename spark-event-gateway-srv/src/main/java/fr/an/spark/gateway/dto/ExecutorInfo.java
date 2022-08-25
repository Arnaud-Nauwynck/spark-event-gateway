package fr.an.spark.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class ExecutorInfo {

    @JsonProperty("Host")
    public String host;

    @JsonProperty("Total Cores")
    public int totalCores;

    public static class LogUrls {
        public String stdout;
        public String stderr;
    }
    
    @JsonProperty("Log Urls")
    public LogUrls logUrls;

    @JsonProperty("Attributes")
    public Map<String,String> attributes;

    @JsonProperty("Resources")
    public Map<String,String> resources;

    @JsonProperty("Resource Profile Id")
    public int resourceProfileId;

}
