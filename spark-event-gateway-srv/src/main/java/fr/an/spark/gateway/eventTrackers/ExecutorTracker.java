package fr.an.spark.gateway.eventTrackers;

import fr.an.spark.gateway.eventlog.model.ExecutorInfo.ResourceInformation;
import fr.an.spark.gateway.eventlog.model.ExecutorMetrics;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerBlockManagerAdded;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerBlockManagerRemoved;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerTaskStart;
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

    SparkListenerBlockManagerAdded blockManagerAddedEvent;
    SparkListenerBlockManagerRemoved blockManagerRemovedEvent;

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

    // peak values for executor level metrics

    public ExecutorMetrics peakExecutorMetrics = new ExecutorMetrics();

    // -----------------------------------------------------------------------------------------------------------------

    public void onTaskStartEvent(TaskTracker task, SparkListenerTaskStart event) {
        this.activeTasks += 1;
        this.totalTasks += 1;
    }

    public void onBlockManagerAdded(SparkListenerBlockManagerAdded event) {
        this.blockManagerAddedEvent = event;
        this.hostPort = event.blockManagerId.host;
        if (null != event.maxOnHeapMem) {
            this.totalOnHeap = event.maxOnHeapMem;
            this.totalOffHeap = (event.maxOffHeapMem != null)? event.maxOffHeapMem : 0;
            // SPARK-30594: whenever(first time or re-register) a BlockManager added, all blocks
            // from this BlockManager will be reported to driver later. So, we should clean up
            // used memory to avoid overlapped count.
            this.usedOnHeap = 0;
            this.usedOffHeap = 0;
        }
        this.isActive = true;
        this.maxMemory = event.maxMem;

    }
    public void onBlockManagerRemoved(SparkListenerBlockManagerRemoved event) {
        this.blockManagerRemovedEvent = event;
    }


    public boolean hasMemoryInfo() { return totalOnHeap >= 0L; }

    // def hostname:String =if(host !=null)host else Utils.parseHostPort(hostPort)._1

    public void addExcludedInStage(int stageId) {
        this.excludedInStages.add(stageId);
    }
    public void removeExcludedInStage(int stageId) {
        this.excludedInStages.remove(stageId);
    }

}
