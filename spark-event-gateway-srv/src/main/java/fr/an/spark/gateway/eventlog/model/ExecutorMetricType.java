package fr.an.spark.gateway.eventlog.model;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public abstract class ExecutorMetricType {

    public abstract List<String> names();

    // -----------------------------------------------------------------------------------------------------------------

    static abstract class SingleValueExecutorMetricType extends ExecutorMetricType {
        @Override
        public List<String> names() {
            String className = this.getClass().getSimpleName();
            if (className.endsWith("ExecutorMetricType")) {
                className = className.substring(0, className.length() - "ExecutorMetricType".length());
            } else if (className.endsWith("MetricType")) {
                className = className.substring(0, className.length() - "MetricType".length());
            }
            return Collections.singletonList(className);
        }

    }

    static class MemoryManagerExecutorMetricType extends SingleValueExecutorMetricType {
        public static final MemoryManagerExecutorMetricType INSTANCE = new MemoryManagerExecutorMetricType();
    }

    static class MBeanExecutorMetricType extends SingleValueExecutorMetricType {
        public static final MBeanExecutorMetricType INSTANCE = new MBeanExecutorMetricType();
    }

    static class JVMHeapMemoryExecutorMetricType extends SingleValueExecutorMetricType {
        protected static final JVMHeapMemoryExecutorMetricType INSTANCE = new JVMHeapMemoryExecutorMetricType();
    }

    static class JVMOffHeapMemoryExecutorMetricType extends SingleValueExecutorMetricType {
        protected static final JVMOffHeapMemoryExecutorMetricType INSTANCE = new JVMOffHeapMemoryExecutorMetricType();
    }

    static class ProcessTreeExecutorMetricType extends ExecutorMetricType {
        protected static final ProcessTreeExecutorMetricType INSTANCE = new ProcessTreeExecutorMetricType();
        private static final List<String> NAMES = Arrays.asList(
                "ProcessTreeJVMVMemory",
                "ProcessTreeJVMRSSMemory",
                "ProcessTreePythonVMemory",
                "ProcessTreePythonRSSMemory",
                "ProcessTreeOtherVMemory",
                "ProcessTreeOtherRSSMemory"
        );

        @Override
        public List<String> names() {
            return NAMES;
        }
    }


    static class GarbageCollectionExecutorMetricType extends ExecutorMetricType {
        protected static final GarbageCollectionExecutorMetricType INSTANCE = new GarbageCollectionExecutorMetricType();
        private static final List<String> NAMES = Arrays.asList(
                "MinorGCCount",
                "MinorGCTime",
                "MajorGCCount",
                "MajorGCTime",
                "TotalGCTime",
                "ConcurrentGCCount",
                "ConcurrentGCTime"
        );

        @Override
        public List<String> names() {
            return NAMES;
        }

    }

    static class OnHeapExecutionMemoryExecutorMetricType extends MemoryManagerExecutorMetricType {
        public static final OnHeapExecutionMemoryExecutorMetricType INSTANCE = new OnHeapExecutionMemoryExecutorMetricType();
    }

    static class OffHeapExecutionMemoryExecutorMetricType extends MemoryManagerExecutorMetricType {
        public static final OffHeapExecutionMemoryExecutorMetricType INSTANCE = new OffHeapExecutionMemoryExecutorMetricType();
    }

    static class OnHeapStorageMemoryExecutorMetricType extends MemoryManagerExecutorMetricType {
        public static final OnHeapStorageMemoryExecutorMetricType INSTANCE = new OnHeapStorageMemoryExecutorMetricType();
    }

    static class OffHeapStorageMemoryExecutorMetricType extends MemoryManagerExecutorMetricType {
        public static final OffHeapStorageMemoryExecutorMetricType INSTANCE = new OffHeapStorageMemoryExecutorMetricType();
    }

    static class OnHeapUnifiedMemoryExecutorMetricType extends MemoryManagerExecutorMetricType {
        public static final OnHeapUnifiedMemoryExecutorMetricType INSTANCE = new OnHeapUnifiedMemoryExecutorMetricType();
    }

    static class OffHeapUnifiedMemoryExecutorMetricType extends MemoryManagerExecutorMetricType {
        public static final OffHeapUnifiedMemoryExecutorMetricType INSTANCE = new OffHeapUnifiedMemoryExecutorMetricType();
    }

    static class DirectPoolMemoryExecutorMetricType extends MBeanExecutorMetricType {
        public static final DirectPoolMemoryExecutorMetricType INSTANCE = new DirectPoolMemoryExecutorMetricType();
        // "java.nio:type=BufferPool,name=direct"
    }

    static class MappedPoolMemoryExecutorMetricType extends MBeanExecutorMetricType {
        public static final MappedPoolMemoryExecutorMetricType INSTANCE = new MappedPoolMemoryExecutorMetricType();
        // "java.nio:type=BufferPool,name=mapped"
    }

}

