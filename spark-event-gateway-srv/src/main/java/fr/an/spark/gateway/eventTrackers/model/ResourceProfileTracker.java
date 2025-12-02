package fr.an.spark.gateway.eventTrackers.model;

import fr.an.spark.gateway.eventlog.model.SparkEvent.ExecutorResourceRequest;
import lombok.RequiredArgsConstructor;

import java.util.LinkedHashMap;
import java.util.Map;

@RequiredArgsConstructor
public class ResourceProfileTracker {

    final int resourceProfileId;

    Map<String, ExecutorResourceRequest> executorResources = new LinkedHashMap<>();
    // TOADD Map<String, TaskResourceRequest> taskResources = new LinkedHashMap<>();
    int maxTasksPerExecutor;
}
