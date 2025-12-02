package fr.an.spark.gateway.eventlog.model;

import fr.an.spark.gateway.eventlog.model.ExecutorMetricType.*;
import lombok.val;

import java.util.*;

public class ExecutorMetricTypeRegistry {

    public static final List<ExecutorMetricType> METRIC_GETTERS = Arrays.asList(
            JVMHeapMemoryExecutorMetricType.INSTANCE,
            JVMOffHeapMemoryExecutorMetricType.INSTANCE,
            OnHeapExecutionMemoryExecutorMetricType.INSTANCE,
            OffHeapExecutionMemoryExecutorMetricType.INSTANCE,
            OnHeapStorageMemoryExecutorMetricType.INSTANCE,
            OffHeapStorageMemoryExecutorMetricType.INSTANCE,
            OnHeapUnifiedMemoryExecutorMetricType.INSTANCE,
            OffHeapUnifiedMemoryExecutorMetricType.INSTANCE,
            DirectPoolMemoryExecutorMetricType.INSTANCE,
            MappedPoolMemoryExecutorMetricType.INSTANCE,
            ProcessTreeExecutorMetricType.INSTANCE,
            GarbageCollectionExecutorMetricType.INSTANCE
    );

    public static final Map<String, Integer> metricToOffset;
    public static final int numMetrics;

    static {
        int numberOfMetrics = 0;
        val metricToOffsetMap = new LinkedHashMap<String, Integer>();
        for (ExecutorMetricType m : METRIC_GETTERS) {
            List<String> names = m.names();
            for (int idx = 0; idx < names.size(); idx++) {
                metricToOffsetMap.put(names.get(idx), idx + numberOfMetrics);
            }
            numberOfMetrics += names.size();
        }
        numMetrics = numberOfMetrics;
        metricToOffset = Collections.unmodifiableMap(metricToOffsetMap);
    }


}
