package fr.an.spark.gateway.eventTrackers;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class SpeculationStageSummary {

    public final int stageId;
    public final int attemptId;

    public int numTasks = 0;
    public int numActiveTasks = 0;
    public int numCompletedTasks = 0;
    public int numFailedTasks = 0;
    public int numKilledTasks = 0;

}
