package fr.an.spark.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Sparkapi {

    @AllArgsConstructor
    public static class AppSummaryDTO {
        public int numCompletedJobs;
        public int numCompletedStages;
    }

    @AllArgsConstructor
    public static class ApplicationInfoDTO {
        public String id;
        public String name;
        public int coresGranted;
        public int maxCores;
        public int coresPerExecutor;
        public int memoryPerExecutorMB;
        public List<ApplicationAttemptInfoDTO> attempts = new ArrayList<>();
    }

    @AllArgsConstructor
    public static class ApplicationAttemptInfoDTO {
        public String attemptId;
        public long startTime;
        public long endTime;
        public long lastUpdated;
        public long duration;
        public String sparkUser;
        public boolean completed = false;
        public String appSparkVersion;
    }

    @AllArgsConstructor
    public static class RuntimeInfoDTO {
        public String javaVersion;
        public String javaHome;
        public String scalaVersion;
    }

    @AllArgsConstructor
    public static class ApplicationEnvironmentInfoDTO {
        public RuntimeInfoDTO runtime;
        public Map<String,String> sparkProperties;
        public Map<String,String> hadoopProperties;
        public Map<String,String> systemProperties;
        public Map<String,String> metricsProperties;
        public Map<String,String> classpathEntries;
        // TOADD List<ResourceProfileInfo> resourceProfiles;
    }


    @RequiredArgsConstructor
    public static class RDDStorageInfoDTO {
        public final int id;
        public final String name;
        public final int numPartitions;
        public final int numCachedPartitions;
        public final String storageLevel;
        public final long memoryUsed;
        public final long diskUsed;
        public final List<RDDDataDistributionDTO> dataDistribution;
        public final List<RDDPartitionInfoDTO> partitions;

    }

    @RequiredArgsConstructor
    public static class RDDDataDistributionDTO {
        public final String address;
        public final long memoryUsed;
        public final long memoryRemaining;
        public final long diskUsed;

        public Long onHeapMemoryUsed = null;
        public Long  offHeapMemoryUsed = null;
        public Long  onHeapMemoryRemaining = null;
        public Long  offHeapMemoryRemaining = null;
    }

    @RequiredArgsConstructor
    public static class RDDPartitionInfoDTO {
        public final String blockName;
        public final String storageLevel;
        public final Long memoryUsed;
        public final Long diskUsed;
        public final Set<String> executors;
    }

    public enum EnumStageStatus {
        ACTIVE,
        COMPLETE,
        FAILED,
        PENDING,
        SKIPPED;

        public boolean isCompleteOrFailed() {
            return EnumStageStatus.COMPLETE.equals(this) ||
                   EnumStageStatus.FAILED.equals(this);
        }
    }
}
