package fr.an.spark.gateway.eventlog.model;

import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class SparkPlanInfo {

    public String nodeName;
    public String simpleString;
    public List<SparkPlanInfo> children;

    public Map<String,Object> metadata;

    @Getter
    public static class Metrics {
        public String name;
        public int accumulatorId;
        public String metricType;
    }

    public List<Metrics> metrics;
    
    public long time;
    
}
