package fr.an.spark.gateway.eventlog.model;

import java.util.List;
import java.util.Map;

public class SparkPlanInfo {

    public String nodeName;
    public String simpleString;
    public List<SparkPlanInfo> children;

    public Map<String,Object> metadata;
    
    public static class Metrics {
        public String name;
        public int accumulatorId;
        public String metricType;
    }
    public List<Metrics> metrics;
    
    public long time;
    
}
