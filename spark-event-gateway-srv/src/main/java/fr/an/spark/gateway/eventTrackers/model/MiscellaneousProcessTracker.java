package fr.an.spark.gateway.eventTrackers.model;

import java.util.LinkedHashMap;
import java.util.Map;

public class MiscellaneousProcessTracker {

    public final String processId;

    public long creationTime;

    public String hostPort;
    public boolean isActive = true;
    public int totalCores = 0;
    // public long addTime;
    public Map<String, String> processLogs = new LinkedHashMap<>();

    // -----------------------------------------------------------------------------------------------------------------

    public MiscellaneousProcessTracker(String processId) {
        this.processId = processId;
    }
}
