package fr.an.spark.gateway.eventTrackers.model;

import fr.an.spark.gateway.dto.Sparkapi.RDDPartitionInfoDTO;
import fr.an.spark.gateway.eventlog.model.RDDInfo;
import fr.an.spark.gateway.eventlog.model.RDDInfo.StorageLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.format.annotation.DurationFormat.Unit;

import java.util.*;

/**
 * Tracker for data related to a persisted RDD.
 *
 * The RDD storage level is immutable, following the current behavior of `RDD.persist()`, even
 * though it is mutable in the `RDDInfo` structure. Since the listener does not track unpersisted
 * RDDs, this covers the case where an early stage is run on the unpersisted RDD, and a later stage
 * it started after the RDD is marked for caching.
 */
@RequiredArgsConstructor
public class RDDTracker {

    public final RDDInfo info;

    public StorageLevel storageLevel;


    public long memoryUsed = 0L;
    public long diskUsed = 0L;

    @Getter
    private Map<String,RDDPartitionTracker> partitions = new HashMap<>();

    private Map<String, RDDDistributionTracker> distributions = new HashMap<>();

    // -----------------------------------------------------------------------------------------------------------------

    public RDDTracker(RDDInfo info, StorageLevel storageLevel) {
        this.info = info;
        this.storageLevel = storageLevel;
    }

    public RDDPartitionTracker partition(String blockName) {
        return partitions.computeIfAbsent(blockName, bn -> new RDDPartitionTracker(bn, storageLevel)
                // part.update(null, 0L, 0L)
        );
    }

    public void removePartition(String blockName) {
        partitions.remove(blockName);
    }

    public Collection<RDDDistributionTracker> getDistributions() {
        return distributions.values();
    }

    public RDDDistributionTracker distribution(ExecutorTracker exec) {
        return distributions.computeIfAbsent(exec.executorId, e -> new RDDDistributionTracker(exec));
    }

    public void removeDistribution(ExecutorTracker exec) {
        distributions.remove(exec.executorId);
    }

    public RDDDistributionTracker distributionOpt(ExecutorTracker exec) {
        return distributions.get(exec.executorId);
    }


    /**
     * Data about a single partition of a cached RDD. The RDD storage level is used to compute the
     * effective storage level of the partition, which takes into account the storage actually being
     * used by the partition in the executors, and thus may differ from the storage level requested
     * by the application.
     */
    @RequiredArgsConstructor
    public static class RDDPartitionTracker {
        public final String blockName;
        public final StorageLevel rddLevel;

        public RDDPartitionInfoDTO value = null;

        public Set<String> executors() { return value.executors; }
        public long memoryUsed() { return value.memoryUsed; }
        public long diskUsed() { return value.diskUsed; }

        public void update(Collection<String> executors, long memoryUsed, long diskUsed) {
            val level = new StorageLevel(diskUsed > 0, memoryUsed > 0, rddLevel.useOffHeap,
                    memoryUsed() > 0 && rddLevel.deserialized, executors.size());
            this.value = new RDDPartitionInfoDTO(
                    blockName,
                    level.description(),
                    memoryUsed, diskUsed,
                    new HashSet<>(executors));
        }
    }

    /**
     *
     */
    public static class RDDDistributionTracker {
        public final String executorId;

        public long memoryUsed = 0L;
        public long diskUsed = 0L;
        public long onHeapUsed = 0L;
        public long offHeapUsed = 0L;

        // TOADD RDDDataDistribution lastUpdate;

        public RDDDistributionTracker(ExecutorTracker exec) {
            this.executorId = exec.executorId;
        }


    }
}
