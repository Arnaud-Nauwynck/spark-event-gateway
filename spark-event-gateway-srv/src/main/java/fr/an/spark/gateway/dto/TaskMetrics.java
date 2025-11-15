package fr.an.spark.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TaskMetrics {

    @JsonProperty("Executor Deserialize Time")
    public long executorDeseralizeTime;
    
    @JsonProperty("Executor Deserialize CPU Time")
    public long executorDeseralizeCpuTime;

    @JsonProperty("Executor Run Time")
    public long executorRunTime;
    
    @JsonProperty("Executor CPU Time")
    public long executorCpuTime;
                            
    @JsonProperty("Peak Execution Memory")
    public long peakExecutionMemory;
    
    @JsonProperty("Result Size")
    public long resultSize;
                           
    @JsonProperty("JVM GC Time")
    public long jvmGCTime;
                          
    @JsonProperty("Result Serialization Time")
    public long resultSerializationTime;
    
    @JsonProperty("Memory Bytes Spilled")
    public long memoryBytesSpilled;
                  
    @JsonProperty("Disk Bytes Spilled")
    public long diskBytesSpilled;

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
	    public long totalRecordsRead;
    }
    
    @JsonProperty("Shuffle Read Metrics")
    public ShuffleReadMetrics shuffleReadMetrics;
    

    public static class ShuffleWriteMetrics {
    	@JsonProperty("Shuffle Bytes Written")
	    public long shuffleBytesWritten;
	    
	    @JsonProperty("Shuffle Write Time")
	    public long shuffleWriteTime;

	    @JsonProperty("Shuffle Records Written")
	    public long shuffleRecordsWritten;
    }

    @JsonProperty("Shuffle Write Metrics")
    public ShuffleWriteMetrics shuffleWriteMetrics;

    
    public static class InputMetrics {
        @JsonProperty("Bytes Read")
        public long bytesRead;

        @JsonProperty("Records Read")
        public long recordsRead;
    }
    
    @JsonProperty("Input Metrics")
    public InputMetrics inputMetrics;

    
    public static class OutputMetrics {
        @JsonProperty("Bytes Written")
        public long bytesWritten;
        
        @JsonProperty("Records Written")
        public long recordsWritten;
    }

    @JsonProperty("Output Metrics")
    public OutputMetrics outputMetrics;


    public static class UpdatedBlock extends HashMap<String,String> {
        // TODO
    }

    @JsonProperty("Updated Blocks")
    public List<UpdatedBlock> updatedBlocks;

}
