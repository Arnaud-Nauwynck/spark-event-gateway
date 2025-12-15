package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.Map;

public class ExecutorMetrics {

    @JsonProperty("JVMHeapMemory")
    public long JVMHeapMemory;

    @JsonProperty("JVMOffHeapMemory")
    public long JVMOffHeapMemory;

    @JsonProperty("OnHeapExecutionMemory")
    public long OnHeapExecutionMemory;

    @JsonProperty("OffHeapExecutionMemory")
    public long OffHeapExecutionMemory;

    @JsonProperty("OnHeapStorageMemory")
    public long OnHeapStorageMemory;

    @JsonProperty("OffHeapStorageMemory")
    public long OffHeapStorageMemory;

    @JsonProperty("OnHeapUnifiedMemory")
    public long OnHeapUnifiedMemory;

    @JsonProperty("OffHeapUnifiedMemory")
    public long OffHeapUnifiedMemory;

    @JsonProperty("DirectPoolMemory")
    public long DirectPoolMemory;

    @JsonProperty("MappedPoolMemory")
    public long MappedPoolMemory;

    @JsonProperty("ProcessTreeJVMVMemory")
    public long ProcessTreeJVMVMemory;

    @JsonProperty("ProcessTreeJVMRSSMemory")
    public long ProcessTreeJVMRSSMemory;

    @JsonProperty("ProcessTreePythonVMemory")
    public long ProcessTreePythonVMemory;

    @JsonProperty("ProcessTreePythonRSSMemory")
    public long ProcessTreePythonRSSMemory;

    @JsonProperty("ProcessTreeOtherVMemory")
    public long ProcessTreeOtherVMemory;

    @JsonProperty("ProcessTreeOtherRSSMemory")
    public long ProcessTreeOtherRSSMemory;

    @JsonProperty("MinorGCCount")
    public long MinorGCCount;

    @JsonProperty("MinorGCTime")
    public long MinorGCTime;

    @JsonProperty("MajorGCCount")
    public long MajorGCCount;

    @JsonProperty("MajorGCTime")
    public long MajorGCTime;

    @JsonProperty("TotalGCTime")
    public long TotalGCTime;

    public Map<String,Long> otherMetrics;
    public Map<String,Object> otherProps;

    @JsonAnySetter
    public void handleUnknown(String key, Object value) {
        // should not occur
        if (value instanceof Number valueNum) {
            if (otherMetrics == null) {
                otherMetrics = new HashMap<>();
            }
            otherMetrics.put(key, valueNum.longValue());
        } else {
            if (otherProps == null) {
                otherProps = new HashMap<>();
            }
            otherProps.put(key, value);
        }
    }


    // public long[] metrics;

    public boolean compareAndUpdatePeakValues(ExecutorMetrics other) {
        boolean updated = false;
//        int count = Math.min(this.metrics.length, other.metrics.length);
//        for(int idx = 0; idx < count; idx++) {
//            if (other.metrics[idx] > this.metrics[idx]) {
//                updated = true;
//                this.metrics[idx] = other.metrics[idx];
//            }
//        }

        // TODO

        return updated;
    }

}
