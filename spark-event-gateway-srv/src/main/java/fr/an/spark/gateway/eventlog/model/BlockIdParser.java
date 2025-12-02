package fr.an.spark.gateway.eventlog.model;

import fr.an.spark.gateway.eventlog.model.BlockId.*;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BlockIdParser {

    public static final String MERGED_SHUFFLE_FILE_NAME_PREFIX = "shuffleMerged";

    private static final Pattern RDD = Pattern.compile("rdd_([0-9]+)_([0-9]+)");
    private static final Pattern SHUFFLE =
            Pattern.compile("shuffle_([0-9]+)_([0-9]+)_([0-9]+)");
    private static final Pattern SHUFFLE_BATCH =
            Pattern.compile("shuffle_([0-9]+)_([0-9]+)_([0-9]+)_([0-9]+)");
    private static final Pattern SHUFFLE_DATA =
            Pattern.compile("shuffle_([0-9]+)_([0-9]+)_([0-9]+)\\.data");
    private static final Pattern SHUFFLE_INDEX =
            Pattern.compile("shuffle_([0-9]+)_([0-9]+)_([0-9]+)\\.index");
    private static final Pattern SHUFFLE_PUSH =
            Pattern.compile("shufflePush_([0-9]+)_([0-9]+)_([0-9]+)_([0-9]+)");
    private static final Pattern SHUFFLE_MERGED =
            Pattern.compile("shuffleMerged_([0-9]+)_([0-9]+)_([0-9]+)");
    private static final Pattern SHUFFLE_MERGED_DATA =
            Pattern.compile("shuffleMerged_([_A-Za-z0-9]*)_([0-9]+)_([0-9]+)_([0-9]+)\\.data");
    private static final Pattern SHUFFLE_MERGED_INDEX =
            Pattern.compile("shuffleMerged_([_A-Za-z0-9]*)_([0-9]+)_([0-9]+)_([0-9]+)\\.index");
    private static final Pattern SHUFFLE_MERGED_META =
            Pattern.compile("shuffleMerged_([_A-Za-z0-9]*)_([0-9]+)_([0-9]+)_([0-9]+)\\.meta");
    private static final Pattern SHUFFLE_CHUNK =
            Pattern.compile("shuffleChunk_([0-9]+)_([0-9]+)_([0-9]+)_([0-9]+)");
    private static final Pattern BROADCAST =
            Pattern.compile("broadcast_([0-9]+)([_A-Za-z0-9]*)");
    private static final Pattern TASKRESULT =
            Pattern.compile("taskresult_([0-9]+)");
    private static final Pattern STREAM =
            Pattern.compile("input-([0-9]+)-([0-9]+)");
    private static final Pattern PYTHON_STREAM =
            Pattern.compile("python-stream-([0-9]+)-([0-9]+)");
    private static final Pattern TEMP_LOCAL =
            Pattern.compile("temp_local_([-A-Fa-f0-9]+)");
    private static final Pattern TEMP_SHUFFLE =
            Pattern.compile("temp_shuffle_([-A-Fa-f0-9]+)");
    private static final Pattern TEST =
            Pattern.compile("test_(.*)");
    private static final Pattern TEST_LOG_BLOCK =
            Pattern.compile("test_log_([0-9]+)_(.*)");
    private static final Pattern PYTHON_WORKER_LOG_BLOCK =
            Pattern.compile("python_worker_log_([0-9]+)_([^_]*)_([^_]*)_([^_]*)");


    public static BlockId apply(String name) {
        Matcher m;

        if ((m = RDD.matcher(name)).matches()) {
            return new RDDBlockId(
                    Integer.parseInt(m.group(1)),
                    Integer.parseInt(m.group(2)));
        }
        if ((m = SHUFFLE.matcher(name)).matches()) {
            return new ShuffleBlockId(
                    Integer.parseInt(m.group(1)),
                    Long.parseLong(m.group(2)),
                    Integer.parseInt(m.group(3)));
        }
        if ((m = SHUFFLE_BATCH.matcher(name)).matches()) {
            return new ShuffleBlockBatchId(
                    Integer.parseInt(m.group(1)),
                    Long.parseLong(m.group(2)),
                    Integer.parseInt(m.group(3)),
                    Integer.parseInt(m.group(4)));
        }
        if ((m = SHUFFLE_DATA.matcher(name)).matches()) {
            return new ShuffleDataBlockId(
                    Integer.parseInt(m.group(1)),
                    Long.parseLong(m.group(2)),
                    Integer.parseInt(m.group(3)));
        }
        if ((m = SHUFFLE_INDEX.matcher(name)).matches()) {
            return new ShuffleIndexBlockId(
                    Integer.parseInt(m.group(1)),
                    Long.parseLong(m.group(2)),
                    Integer.parseInt(m.group(3)));
        }
        if ((m = SHUFFLE_PUSH.matcher(name)).matches()) {
            return new ShufflePushBlockId(
                    Integer.parseInt(m.group(1)),
                    Integer.parseInt(m.group(2)),
                    Integer.parseInt(m.group(3)),
                    Integer.parseInt(m.group(4)));
        }
        if ((m = SHUFFLE_MERGED.matcher(name)).matches()) {
            return new ShuffleMergedBlockId(
                    Integer.parseInt(m.group(1)),
                    Integer.parseInt(m.group(2)),
                    Integer.parseInt(m.group(3)));
        }
        if ((m = SHUFFLE_MERGED_DATA.matcher(name)).matches()) {
            return new ShuffleMergedDataBlockId(
                    m.group(1),
                    Integer.parseInt(m.group(2)),
                    Integer.parseInt(m.group(3)),
                    Integer.parseInt(m.group(4)));
        }
        if ((m = SHUFFLE_MERGED_INDEX.matcher(name)).matches()) {
            return new ShuffleMergedIndexBlockId(
                    m.group(1),
                    Integer.parseInt(m.group(2)),
                    Integer.parseInt(m.group(3)),
                    Integer.parseInt(m.group(4)));
        }
        if ((m = SHUFFLE_MERGED_META.matcher(name)).matches()) {
            return new ShuffleMergedMetaBlockId(
                    m.group(1),
                    Integer.parseInt(m.group(2)),
                    Integer.parseInt(m.group(3)),
                    Integer.parseInt(m.group(4)));
        }
        if ((m = SHUFFLE_CHUNK.matcher(name)).matches()) {
            return new ShuffleBlockChunkId(
                    Integer.parseInt(m.group(1)),
                    Integer.parseInt(m.group(2)),
                    Integer.parseInt(m.group(3)),
                    Integer.parseInt(m.group(4)));
        }
        if ((m = BROADCAST.matcher(name)).matches()) {
            String field = m.group(2);
            if (field.startsWith("_")) field = field.substring(1);
            return new BroadcastBlockId(
                    Long.parseLong(m.group(1)),
                    field);
        }
        if ((m = TASKRESULT.matcher(name)).matches()) {
            return new TaskResultBlockId(
                    Long.parseLong(m.group(1)));
        }
        if ((m = STREAM.matcher(name)).matches()) {
            return new StreamBlockId(
                    Integer.parseInt(m.group(1)),
                    Long.parseLong(m.group(2)));
        }
        if ((m = PYTHON_STREAM.matcher(name)).matches()) {
            return new PythonStreamBlockId(
                    Integer.parseInt(m.group(1)),
                    Long.parseLong(m.group(2)));
        }
        if ((m = TEMP_LOCAL.matcher(name)).matches()) {
            return new TempLocalBlockId(
                    UUID.fromString(m.group(1)));
        }
        if ((m = TEMP_SHUFFLE.matcher(name)).matches()) {
            return new TempShuffleBlockId(
                    UUID.fromString(m.group(1)));
        }
        if ((m = TEST_LOG_BLOCK.matcher(name)).matches()) {
            return new TestLogBlockId(
                    Long.parseLong(m.group(1)),
                    m.group(2));
        }
        if ((m = PYTHON_WORKER_LOG_BLOCK.matcher(name)).matches()) {
            return new PythonWorkerLogBlockId(
                    Long.parseLong(m.group(1)),
                    m.group(2),
                    m.group(3),
                    m.group(4));
        }
        if ((m = TEST.matcher(name)).matches()) {
            return new TestBlockId(m.group(1));
        }

        throw new UnrecognizedBlockIdRuntimeException(name);
    }

    public static final class UnrecognizedBlockIdRuntimeException extends RuntimeException {
        public UnrecognizedBlockIdRuntimeException(String name) {
            super("Failed to parse " + name + " into a block ID");
        }
    }

}
