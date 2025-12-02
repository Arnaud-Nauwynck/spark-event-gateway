package fr.an.spark.gateway.eventlog.model;

import java.util.UUID;

/**
 * AST class for Spark BlockId, parsed from text.
 * see {@Link BlockIdParser}
 */
public abstract class BlockId {

    public abstract String name();

    public RDDBlockId asRDDId() {
        return (this instanceof RDDBlockId) ? (RDDBlockId) this : null;
    }

    public boolean isRDD() {
        return this instanceof RDDBlockId;
    }

    public boolean isShuffle() {
        return this instanceof ShuffleBlockId ||
                this instanceof ShuffleBlockBatchId ||
                this instanceof ShuffleDataBlockId ||
                this instanceof ShuffleIndexBlockId;
    }

    public boolean isShuffleChunk() {
        return this instanceof ShuffleBlockChunkId;
    }

    public boolean isBroadcast() {
        return this instanceof BroadcastBlockId;
    }

    @Override
    public String toString() {
        return name();
    }

    // BlockId subclasses
    //---------------------------------------------------------------------------------------------

    public static final class RDDBlockId extends BlockId {
        public final int rddId;
        public final int splitIndex;

        public RDDBlockId(int rddId, int splitIndex) {
            this.rddId = rddId;
            this.splitIndex = splitIndex;
        }

        @Override
        public String name() {
            return "rdd_" + rddId + "_" + splitIndex;
        }
    }


    public static final class ShuffleBlockId extends BlockId {
        public final int shuffleId;
        public final long mapId;
        public final int reduceId;

        public ShuffleBlockId(int shuffleId, long mapId, int reduceId) {
            this.shuffleId = shuffleId;
            this.mapId = mapId;
            this.reduceId = reduceId;
        }

        @Override
        public String name() {
            return "shuffle_" + shuffleId + "_" + mapId + "_" + reduceId;
        }
    }

    public static final class ShuffleBlockBatchId extends BlockId {
        public final int shuffleId;
        public final long mapId;
        public final int startReduceId;
        public final int endReduceId;

        public ShuffleBlockBatchId(int shuffleId, long mapId, int startReduceId, int endReduceId) {
            this.shuffleId = shuffleId;
            this.mapId = mapId;
            this.startReduceId = startReduceId;
            this.endReduceId = endReduceId;
        }

        @Override
        public String name() {
            return "shuffle_" + shuffleId + "_" + mapId + "_" + startReduceId + "_" + endReduceId;
        }
    }

    /** @Since("3.2.0") */
    public static final class ShuffleBlockChunkId extends BlockId {
        public final int shuffleId;
        public final int shuffleMergeId;
        public final int reduceId;
        public final int chunkId;

        public ShuffleBlockChunkId(int shuffleId, int shuffleMergeId, int reduceId, int chunkId) {
            this.shuffleId = shuffleId;
            this.shuffleMergeId = shuffleMergeId;
            this.reduceId = reduceId;
            this.chunkId = chunkId;
        }

        @Override
        public String name() {
            return "shuffleChunk_" + shuffleId + "_" + shuffleMergeId + "_" + reduceId + "_" + chunkId;
        }
    }

    public static final class ShuffleDataBlockId extends BlockId {
        public final int shuffleId;
        public final long mapId;
        public final int reduceId;

        public ShuffleDataBlockId(int shuffleId, long mapId, int reduceId) {
            this.shuffleId = shuffleId;
            this.mapId = mapId;
            this.reduceId = reduceId;
        }

        @Override
        public String name() {
            return "shuffle_" + shuffleId + "_" + mapId + "_" + reduceId + ".data";
        }
    }

    public static final class ShuffleIndexBlockId extends BlockId {
        public final int shuffleId;
        public final long mapId;
        public final int reduceId;

        public ShuffleIndexBlockId(int shuffleId, long mapId, int reduceId) {
            this.shuffleId = shuffleId;
            this.mapId = mapId;
            this.reduceId = reduceId;
        }

        @Override
        public String name() {
            return "shuffle_" + shuffleId + "_" + mapId + "_" + reduceId + ".index";
        }
    }

    /** @Since("3.2.0") */
    public static final class ShuffleChecksumBlockId extends BlockId {
        public final int shuffleId;
        public final long mapId;
        public final int reduceId;

        public ShuffleChecksumBlockId(int shuffleId, long mapId, int reduceId) {
            this.shuffleId = shuffleId;
            this.mapId = mapId;
            this.reduceId = reduceId;
        }

        @Override
        public String name() {
            return "shuffle_" + shuffleId + "_" + mapId + "_" + reduceId + ".checksum";
        }
    }

    /** @Since("3.2.0") */
    public static final class ShufflePushBlockId extends BlockId {
        public final int shuffleId;
        public final int shuffleMergeId;
        public final int mapIndex;
        public final int reduceId;

        public ShufflePushBlockId(int shuffleId, int shuffleMergeId, int mapIndex, int reduceId) {
            this.shuffleId = shuffleId;
            this.shuffleMergeId = shuffleMergeId;
            this.mapIndex = mapIndex;
            this.reduceId = reduceId;
        }

        @Override
        public String name() {
            return "shufflePush_" + shuffleId + "_" + shuffleMergeId + "_" + mapIndex + "_" + reduceId;
        }
    }

    /** @Since("3.2.0") */
    public static final class ShuffleMergedBlockId extends BlockId {
        public final int shuffleId;
        public final int shuffleMergeId;
        public final int reduceId;

        public ShuffleMergedBlockId(int shuffleId, int shuffleMergeId, int reduceId) {
            this.shuffleId = shuffleId;
            this.shuffleMergeId = shuffleMergeId;
            this.reduceId = reduceId;
        }

        @Override
        public String name() {
            return "shuffleMerged_" + shuffleId + "_" + shuffleMergeId + "_" + reduceId;
        }
    }

    /** @Since("3.2.0") */
    public static final class ShuffleMergedDataBlockId extends BlockId {
        public final String appId;
        public final int shuffleId;
        public final int shuffleMergeId;
        public final int reduceId;

        public ShuffleMergedDataBlockId(String appId, int shuffleId, int shuffleMergeId, int reduceId) {
            this.appId = appId;
            this.shuffleId = shuffleId;
            this.shuffleMergeId = shuffleMergeId;
            this.reduceId = reduceId;
        }

        @Override
        public String name() {
            return BlockIdParser.MERGED_SHUFFLE_FILE_NAME_PREFIX + "_" +
                    appId + "_" + shuffleId + "_" + shuffleMergeId + "_" + reduceId + ".data";
        }
    }

    /** @Since("3.2.0") */
    public static final class ShuffleMergedIndexBlockId extends BlockId {
        public final String appId;
        public final int shuffleId;
        public final int shuffleMergeId;
        public final int reduceId;

        public ShuffleMergedIndexBlockId(String appId, int shuffleId, int shuffleMergeId, int reduceId) {
            this.appId = appId;
            this.shuffleId = shuffleId;
            this.shuffleMergeId = shuffleMergeId;
            this.reduceId = reduceId;
        }

        @Override
        public String name() {
            return BlockIdParser.MERGED_SHUFFLE_FILE_NAME_PREFIX + "_" +
                    appId + "_" + shuffleId + "_" + shuffleMergeId + "_" + reduceId + ".index";
        }
    }

    /** @Since("3.2.0") */
    public static final class ShuffleMergedMetaBlockId extends BlockId {
        public final String appId;
        public final int shuffleId;
        public final int shuffleMergeId;
        public final int reduceId;

        public ShuffleMergedMetaBlockId(String appId, int shuffleId, int shuffleMergeId, int reduceId) {
            this.appId = appId;
            this.shuffleId = shuffleId;
            this.shuffleMergeId = shuffleMergeId;
            this.reduceId = reduceId;
        }

        @Override
        public String name() {
            return BlockIdParser.MERGED_SHUFFLE_FILE_NAME_PREFIX + "_" +
                    appId + "_" + shuffleId + "_" + shuffleMergeId + "_" + reduceId + ".meta";
        }
    }

    public static final class BroadcastBlockId extends BlockId {
        public final long broadcastId;
        public final String field;

        public BroadcastBlockId(long broadcastId, String field) {
            this.broadcastId = broadcastId;
            this.field = field == null ? "" : field;
        }

        @Override
        public String name() {
            return "broadcast_" + broadcastId + (field.isEmpty() ? "" : "_" + field);
        }
    }

    public static final class TaskResultBlockId extends BlockId {
        public final long taskId;

        public TaskResultBlockId(long taskId) {
            this.taskId = taskId;
        }

        @Override
        public String name() {
            return "taskresult_" + taskId;
        }
    }

    public static final class StreamBlockId extends BlockId {
        public final int streamId;
        public final long uniqueId;

        public StreamBlockId(int streamId, long uniqueId) {
            this.streamId = streamId;
            this.uniqueId = uniqueId;
        }

        @Override
        public String name() {
            return "input-" + streamId + "-" + uniqueId;
        }
    }

    public static final class PythonStreamBlockId extends BlockId {
        public final int streamId;
        public final long uniqueId;

        public PythonStreamBlockId(int streamId, long uniqueId) {
            this.streamId = streamId;
            this.uniqueId = uniqueId;
        }

        @Override
        public String name() {
            return "python-stream-" + streamId + "-" + uniqueId;
        }
    }

    //---------------------------------------------------------------------------------------------
    // LogBlockType enum

    public enum LogBlockType {
        TEST,
        PYTHON_WORKER
    }

    // LogBlockId hierarchy
    //---------------------------------------------------------------------------------------------

    public static abstract class LogBlockId extends BlockId {
        public abstract long lastLogTime();

        public abstract String executorId();

        public abstract LogBlockType logBlockType();
    }

    public static final class TestLogBlockId extends LogBlockId {
        public final long lastLogTime;
        public final String executorId;

        public TestLogBlockId(long lastLogTime, String executorId) {
            this.lastLogTime = lastLogTime;
            this.executorId = executorId;
        }

        @Override
        public long lastLogTime() {
            return lastLogTime;
        }

        @Override
        public String executorId() {
            return executorId;
        }

        @Override
        public LogBlockType logBlockType() {
            return LogBlockType.TEST;
        }

        @Override
        public String name() {
            return "test_log_" + lastLogTime + "_" + executorId;
        }
    }

    public static final class PythonWorkerLogBlockId extends LogBlockId {
        public final long lastLogTime;
        public final String executorId;
        public final String sessionId;
        public final String workerId;

        public PythonWorkerLogBlockId(long lastLogTime, String executorId,
                                      String sessionId, String workerId) {
            this.lastLogTime = lastLogTime;
            this.executorId = executorId;
            this.sessionId = sessionId;
            this.workerId = workerId;
        }

        @Override
        public long lastLogTime() {
            return lastLogTime;
        }

        @Override
        public String executorId() {
            return executorId;
        }

        @Override
        public LogBlockType logBlockType() {
            return LogBlockType.PYTHON_WORKER;
        }

        @Override
        public String name() {
            return "python_worker_log_" +
                    lastLogTime + "_" + executorId + "_" + sessionId + "_" + workerId;
        }
    }

    // Private/Test BlockIds
    //---------------------------------------------------------------------------------------------

    public static final class TempLocalBlockId extends BlockId {
        public final UUID id;

        public TempLocalBlockId(UUID id) {
            this.id = id;
        }

        @Override
        public String name() {
            return "temp_local_" + id;
        }
    }

    public static final class TempShuffleBlockId extends BlockId {
        public final UUID id;

        public TempShuffleBlockId(UUID id) {
            this.id = id;
        }

        @Override
        public String name() {
            return "temp_shuffle_" + id;
        }
    }

    public static final class TestBlockId extends BlockId {
        public final String id;

        public TestBlockId(String id) {
            this.id = id;
        }

        @Override
        public String name() {
            return "test_" + id;
        }
    }

    public static final class CacheId extends BlockId {
        public final String sessionUUID;
        public final String hash;

        public CacheId(String sessionUUID, String hash) {
            this.sessionUUID = sessionUUID;
            this.hash = hash;
        }

        @Override
        public String name() {
            return "cache_" + sessionUUID + "_" + hash;
        }
    }

}