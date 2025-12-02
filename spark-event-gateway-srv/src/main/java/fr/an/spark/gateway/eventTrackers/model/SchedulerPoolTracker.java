package fr.an.spark.gateway.eventTrackers.model;

import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
public class SchedulerPoolTracker {

    public final String name;

    public Set<Integer> stageIds = new HashSet<>();

    public void addStageId(int stageId) { this.stageIds.add(stageId); }
    public void removeStageId(int stageId) { this.stageIds.remove(stageId); }

}
