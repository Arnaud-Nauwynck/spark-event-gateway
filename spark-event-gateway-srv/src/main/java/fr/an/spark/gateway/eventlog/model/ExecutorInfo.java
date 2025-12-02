package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.Map;

/**
 * https://github.com/apache/spark/blob/master/core/src/main/scala/org/apache/spark/scheduler/cluster/ExecutorInfo.scala#L28
 */
public class ExecutorInfo {

    @JsonProperty("Host")
    public String host;

    @JsonProperty("Total Cores")
    public int totalCores;

//    public static class LogUrls {
//        public String logs;
//        public String metrics;
//        public String stdout;
//        public String stderr;
//    }
    
    @JsonProperty("Log Urls")
    public Map<String,String> logUrls;

    @JsonProperty("Attributes")
    public Map<String,String> attributes;

    @JsonProperty("Resources")
    public Map<String,ResourceInformation> resourcesInfo;

    @JsonProperty("Resource Profile Id")
    public int resourceProfileId;

    public Long registrationTime;

    public Long requestTime;

    // TODO
    public static class ResourceInformation extends HashMap<String,Object> {
    }

}
