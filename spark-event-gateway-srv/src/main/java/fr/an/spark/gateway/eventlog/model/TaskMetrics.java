package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor @AllArgsConstructor
public class TaskMetrics {

    @JsonProperty("Executor Deserialize Time")
    public long executorDeserializeTime;
    
    @JsonProperty("Executor Deserialize CPU Time")
    public long executorDeserializeCpuTime;

    @JsonProperty("Executor Run Time")
    public long executorRunTime;
    
    @JsonProperty("Executor CPU Time")
    public long executorCpuTime;
                            
    @JsonProperty("Result Size")
    public long resultSize;
                           
    @JsonProperty("JVM GC Time")
    public long jvmGcTime;
                          
    @JsonProperty("Result Serialization Time")
    public long resultSerializationTime;

    @JsonProperty("Memory Bytes Spilled")
    public long memoryBytesSpilled;
                  
    @JsonProperty("Disk Bytes Spilled")
    public long diskBytesSpilled;

    @JsonProperty("Peak Execution Memory")
    public long peakExecutionMemory;

    @JsonProperty("Input Metrics")
    public InputMetrics inputMetrics;

    @JsonProperty("Output Metrics")
    public OutputMetrics outputMetrics;

    @JsonProperty("Shuffle Read Metrics")
    public ShuffleReadMetrics shuffleReadMetrics;

    @JsonProperty("Shuffle Write Metrics")
    public ShuffleWriteMetrics shuffleWriteMetrics;

    @JsonProperty("Updated Blocks")
    public List<BlockIdStatus> updatedBlockStatuses;


    // -----------------------------------------------------------------------------------------------------------------

    @NoArgsConstructor @AllArgsConstructor
    public static class InputMetrics {
        @JsonProperty("Bytes Read")
        public long bytesRead;

        @JsonProperty("Records Read")
        public long recordsRead;
    }

    @NoArgsConstructor @AllArgsConstructor
    public static class OutputMetrics {
        @JsonProperty("Bytes Written")
        public long bytesWritten;

        @JsonProperty("Records Written")
        public long recordsWritten;
    }



    @NoArgsConstructor @AllArgsConstructor
    public static class ShuffleReadMetrics {
	    @JsonProperty("Remote Blocks Fetched")
	    public long remoteBlocksFetched;
	    
	    @JsonProperty("Local Blocks Fetched")
	    public long localBlocksFetched;
	    
	    @JsonProperty("Fetch Wait Time")
	    public long fetchWaitTime;
	    
	    @JsonProperty("Remote Bytes Read")
	    public long remoteBytesRead;
	    
	    @JsonProperty("Remote Bytes Read To Disk")
	    public long remoteBytesReadToDisk;
	    
	    @JsonProperty("Local Bytes Read")
	    public long localBytesRead;
	    
	    @JsonProperty("Total Records Read")
	    public long recordsRead;

        @JsonProperty("Remote Requests Duration")
        public long remoteReqsDuration;

        @JsonProperty("Push Based Shuffle")
        public ShufflePushReadMetrics shufflePushReadMetrics;
    }


    @NoArgsConstructor @AllArgsConstructor
    public static class ShufflePushReadMetrics {

        @JsonProperty("Corrupt Merged Block Chunks")
        public long corruptMergedBlockChunks;

        @JsonProperty("Merged Fetch Fallback Count")
        public long mergedFetchFallbackCount;

        @JsonProperty("Merged Remote Blocks Fetched")
        public long remoteMergedBlocksFetched;

        @JsonProperty("Merged Local Blocks Fetched")
        public long localMergedBlocksFetched;

        @JsonProperty("Merged Remote Chunks Fetched")
        public long remoteMergedChunksFetched;

        @JsonProperty("Merged Local Chunks Fetched")
        public long localMergedChunksFetched;

        @JsonProperty("Merged Remote Bytes Read")
        public long remoteMergedBytesRead;

        @JsonProperty("Merged Local Bytes Read")
        public long localMergedBytesRead;

        @JsonProperty("Merged Remote Requests Duration")
        public long remoteMergedReqsDuration;
    }

    @NoArgsConstructor @AllArgsConstructor
    public static class ShuffleWriteMetrics {
    	@JsonProperty("Shuffle Bytes Written")
	    public long bytesWritten;
	    
	    @JsonProperty("Shuffle Write Time")
	    public long writeTime;

	    @JsonProperty("Shuffle Records Written")
	    public long recordsWritten;
    }

    @NoArgsConstructor @AllArgsConstructor
    public static class BlockIdStatus {
        @JsonProperty("Block ID")
        public String blockId;

        @JsonProperty("Status")
        public String status;
    }

}
