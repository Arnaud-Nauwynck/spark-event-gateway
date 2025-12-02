package fr.an.spark.gateway.eventTrackers.model;

import fr.an.spark.gateway.eventlog.model.ExecutorInfo.ResourceInformation;
import fr.an.spark.gateway.eventlog.model.ExecutorMetrics;
import lombok.RequiredArgsConstructor;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

@RequiredArgsConstructor
public class ExecutorTracker {

    public final String executorId;

    public final boolean isNotDriver() {
        return !executorId.equals("driver");
    }

    public final long addTime;

    public String hostPort;
    public String host;
    public boolean isActive = true;
    public int totalCores = 0;

    public long removeTime;
    public String removeReason;

    public int rddBlocks = 0;
    public long memoryUsed = 0L;
    public long diskUsed = 0L;
    public int maxTasks = 0;
    public long maxMemory = 0L;

    public int totalTasks = 0;
    public int activeTasks = 0;
    public int completedTasks = 0;
    public int failedTasks = 0;
    public long totalDuration = 0L;
    public long totalGcTime = 0L;
    public long totalInputBytes = 0L;
    public long totalShuffleRead = 0L;
    public long totalShuffleWrite = 0L;

    public boolean isExcluded = false;
    public Set<Integer> excludedInStages = new LinkedHashSet<>();


    public Map<String,String> executorLogs = new LinkedHashMap<>();
    public Map<String,String> attributes = new LinkedHashMap<>();
    public Map<String,ResourceInformation> resources = new LinkedHashMap<>();

    // Memory metrics. They may not be recorded (e.g. old event logs) so if totalOnHeap is not
    // initialized, the store will not contain this information.
    public long totalOnHeap = -1L;
    public long totalOffHeap = 0L;
    public long usedOnHeap = 0L;
    public long usedOffHeap = 0L;

    public int resourceProfileId = 0; // TOADD ResourceProfile.DEFAULT_RESOURCE_PROFILE_ID

    public boolean hasMemoryInfo() { return totalOnHeap >= 0L; }

    // peak values for executor level metrics
    public ExecutorMetrics peakExecutorMetrics = new ExecutorMetrics();

    // def hostname:String =if(host !=null)host else Utils.parseHostPort(hostPort)._1

    public void addExcludedInStage(int stageId) {
        this.excludedInStages.add(stageId);
    }
    public void removeExcludedInStage(int stageId) {
        this.excludedInStages.remove(stageId);
    }

}
