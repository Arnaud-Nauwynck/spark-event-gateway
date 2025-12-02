package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

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

    /**
     * see <a href="https://github.com/apache/spark/blob/master/common/utils/src/main/scala/org/apache/spark/storage/StorageLevel.scala">github</a>
     */
    @NoArgsConstructor @AllArgsConstructor
    public static class StorageLevel {

        @JsonProperty("Use Disk")
        boolean useDisk;

        @JsonProperty("Use Memory")
        public boolean useMemory;

        @JsonProperty("Use OffHeap") // TOCHECK
        public boolean useOffHeap;

        @JsonProperty("Deserialized")
        public boolean deserialized;

        @JsonProperty("Replication")
        public int replication;

        public String description() {
            String res = "";
            if (useDisk) {
                res +=  "Disk ";
            }
            if (useMemory) {
                res += (useOffHeap)? "Memory (off heap) " : "Memory ";
            }
            res += (deserialized)? "Deserialized " : "Serialized ";
            res += replication + "x Replicated";
            return res;
        }

        public boolean isValid() {
            return (useMemory || useDisk) && (replication > 0);
        }

    }

    @JsonProperty("Storage Level")
    public RDDInfo.StorageLevel storageLevel;

    @JsonProperty("Barrier")
    public boolean barrier;

  // TODO PATCH ARNAUD
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
