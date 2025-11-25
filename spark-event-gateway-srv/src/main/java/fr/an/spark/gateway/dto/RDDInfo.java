package fr.an.spark.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class RDDInfo {

    @JsonProperty("RDD ID")
    public int rddId;

    @JsonProperty("Name")
    public String name;

    @JsonProperty("Scope")
    public String scope;
    // public Map<String,String> scope; // id, name??

    @JsonProperty("Callsite")
    public String callSite;

    @JsonProperty("Parent IDs")
    public List<Integer> parentIds;

    public static class StorageLevel {

        @JsonProperty("Use Disk")
        boolean useDisk;

        @JsonProperty("Use Memory")
        public boolean useMemory;

        @JsonProperty("Deserialized")
        public boolean deserialized;

        @JsonProperty("Replication")
        public int replication;
    }

    @JsonProperty("Storage Level")
    public StorageLevel storageLevel;

    @JsonProperty("Barrier")
    public boolean barrier;

    @JsonProperty("DeterministicLevel")
    public String deterministicLevel;

    @JsonProperty("Number of Partitions")
    public int numberOfPartitions;

    @JsonProperty("Number of Cached Partitions")
    public int numberOfCachedPartitions;

    @JsonProperty("Memory Size")
    public long memorySize;

    @JsonProperty("Disk Size")
    public long diskSize;

}
