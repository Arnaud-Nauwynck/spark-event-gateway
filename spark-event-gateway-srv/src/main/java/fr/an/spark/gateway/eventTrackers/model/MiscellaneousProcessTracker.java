package fr.an.spark.gateway.eventTrackers.model;

import lombok.RequiredArgsConstructor;

import java.util.LinkedHashMap;
import java.util.Map;

@RequiredArgsConstructor
public class MiscellaneousProcessTracker {

    public final String processId;

    public long creationTime;

    public String hostPort;
    public boolean isActive = true;
    public int totalCores = 0;
    // public long addTime;
    public Map<String, String> processLogs = new LinkedHashMap<>();

}
