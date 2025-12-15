package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.val;

import java.util.Collection;
import java.util.List;

import static fr.an.spark.gateway.eventlog.model.InternalAccumulator.UPDATED_BLOCK_STATUSES;

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
    public InputMetrics inputMetrics = new InputMetrics();

    @JsonProperty("Output Metrics")
    public OutputMetrics outputMetrics = new OutputMetrics();

    @JsonProperty("Shuffle Read Metrics")
    public ShuffleReadMetrics shuffleReadMetrics = new ShuffleReadMetrics();

    @JsonProperty("Shuffle Write Metrics")
    public ShuffleWriteMetrics shuffleWriteMetrics = new ShuffleWriteMetrics();

    @JsonProperty("Updated Blocks")
    public List<BlockIdStatus> updatedBlockStatuses;

    // -----------------------------------------------------------------------------------------------------------------

    public void setUpdatedBlockStatuses(List<BlockIdStatus> value) {
        this.updatedBlockStatuses = value;
    }

    public void incrMetrics(TaskMetrics other) {
        this.executorDeserializeTime += other.executorDeserializeTime;
        this.executorDeserializeCpuTime += other.executorDeserializeCpuTime;
        this.executorRunTime += other.executorRunTime;
        this.executorCpuTime += other.executorCpuTime;
        this.resultSize += other.resultSize;
        this.jvmGcTime += other.jvmGcTime;
        this.resultSerializationTime += other.resultSerializationTime;
        this.memoryBytesSpilled += other.memoryBytesSpilled;
        this.diskBytesSpilled += other.diskBytesSpilled;
        this.peakExecutionMemory = Math.max(this.peakExecutionMemory, other.peakExecutionMemory);
        if (other.inputMetrics != null) {
            if (this.inputMetrics == null) {
                this.inputMetrics = new InputMetrics();
            }
            inputMetrics.incrMetrics(other.inputMetrics);
        }
        if (other.outputMetrics != null) {
            if (this.outputMetrics == null) {
                this.outputMetrics = new OutputMetrics();
            }
            outputMetrics.incrMetrics(other.outputMetrics);
        }
        if (other.shuffleReadMetrics != null) {
            if (this.shuffleReadMetrics == null) {
                this.shuffleReadMetrics = new ShuffleReadMetrics();
            }
            shuffleReadMetrics.incrMetrics(other.shuffleReadMetrics);
        }
        if (other.shuffleWriteMetrics != null) {
            if (this.shuffleWriteMetrics == null) {
                this.shuffleWriteMetrics = new ShuffleWriteMetrics();
            }
            shuffleWriteMetrics.incrMetrics(other.shuffleWriteMetrics);
        }
        // ?? updatedBlockStatuses;
    }

    // -----------------------------------------------------------------------------------------------------------------

    @NoArgsConstructor @AllArgsConstructor
    public static class InputMetrics {
        @JsonProperty("Bytes Read")
        public long bytesRead;

        @JsonProperty("Records Read")
        public long recordsRead;

        public void incrMetrics(InputMetrics other) {
            this.bytesRead += other.bytesRead;
            this.recordsRead += other.recordsRead;
        }
    }

    @NoArgsConstructor @AllArgsConstructor
    public static class OutputMetrics {
        @JsonProperty("Bytes Written")
        public long bytesWritten;

        @JsonProperty("Records Written")
        public long recordsWritten;

        public void incrMetrics(OutputMetrics other) {
            this.bytesWritten += other.bytesWritten;
            this.recordsWritten += other.recordsWritten;
        }
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

        public void incrMetrics(ShuffleReadMetrics other) {
            this.remoteBlocksFetched += other.remoteBlocksFetched;
            this.localBlocksFetched += other.localBlocksFetched;
            this.fetchWaitTime += other.fetchWaitTime;
            this.remoteBytesRead += other.remoteBytesRead;
            this.remoteBytesReadToDisk += other.remoteBytesReadToDisk;
            this.localBytesRead += other.localBytesRead;
            this.recordsRead += other.recordsRead;
            this.remoteReqsDuration += other.remoteReqsDuration;
            if (other.shufflePushReadMetrics != null) {
                if (this.shufflePushReadMetrics == null) {
                    this.shufflePushReadMetrics = new ShufflePushReadMetrics();
                }
                this.shufflePushReadMetrics.incrMetrics(other.shufflePushReadMetrics);
            }
        }
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

        public void incrMetrics(ShufflePushReadMetrics other) {
            this.corruptMergedBlockChunks += other.corruptMergedBlockChunks;
            this.mergedFetchFallbackCount += other.mergedFetchFallbackCount;
            this.remoteMergedBlocksFetched += other.remoteMergedBlocksFetched;
            this.localMergedBlocksFetched += other.localMergedBlocksFetched;
            this.remoteMergedChunksFetched += other.remoteMergedChunksFetched;
            this.localMergedChunksFetched += other.localMergedChunksFetched;
            this.remoteMergedBytesRead += other.remoteMergedBytesRead;
            this.localMergedBytesRead += other.localMergedBytesRead;
            this.remoteMergedReqsDuration += other.remoteMergedReqsDuration;
        }
    }

    @NoArgsConstructor @AllArgsConstructor
    public static class ShuffleWriteMetrics {
    	@JsonProperty("Shuffle Bytes Written")
	    public long bytesWritten;
	    
	    @JsonProperty("Shuffle Write Time")
	    public long writeTime;

	    @JsonProperty("Shuffle Records Written")
	    public long recordsWritten;

        public void incrMetrics(ShuffleWriteMetrics other) {
            this.bytesWritten += other.bytesWritten;
            this.writeTime += other.writeTime;
            this.recordsWritten += other.recordsWritten;
        }
    }

    @NoArgsConstructor @AllArgsConstructor
    public static class BlockIdStatus {
        @JsonProperty("Block ID")
        public String blockId;

        @JsonProperty("Status")
        public String status;
    }





    /**
     * Construct a [[TaskMetrics]] object from a list of [[AccumulableInfo]], called on driver only.
     * The returned [[TaskMetrics]] is only used to get some internal metrics, we don't need to take
     * care of external accumulator info passed in.
     */
    public static TaskMetrics fromAccumulatorInfos(Collection<AccumulableInfo> infos) {
        val tm = new TaskMetrics();
        for(val info : infos) {
            if (info.name != null && info.update != null) {
                val name = info.name;
                val value = info.update;
                if (name.equals(UPDATED_BLOCK_STATUSES)) {
                    @SuppressWarnings({"unchecked", "rawtypes"})
                    val valueLs = (List<BlockIdStatus>) (List) value;
                    tm.setUpdatedBlockStatuses(valueLs);
                } else {
                    // TOADD accumulators on spark-side only ?
                    // tm.nameToAccums.get(name).foreach(
                    //        _.asInstanceOf[LongAccumulator].setValue(value.asInstanceOf[Long])
                    // )
                }
            }
        }
        return tm;
    }


//    /**
//     * Construct a [[TaskMetrics]] object from a list of accumulator updates, called on driver only.
//     */
//    def fromAccumulators(accums: Seq[AccumulatorV2[_, _]]): TaskMetrics = {
//        val tm = new TaskMetrics
//        for (acc <- accums) {
//            val name = acc.name
//            if (name.isDefined && tm.nameToAccums.contains(name.get)) {
//                val tmAcc = tm.nameToAccums(name.get).asInstanceOf[AccumulatorV2[Any, Any]]
//                tmAcc.metadata = acc.metadata
//                tmAcc.merge(acc.asInstanceOf[AccumulatorV2[Any, Any]])
//            } else {
//                tm._externalAccums += acc
//            }
//        }
//        tm
//    }



}
