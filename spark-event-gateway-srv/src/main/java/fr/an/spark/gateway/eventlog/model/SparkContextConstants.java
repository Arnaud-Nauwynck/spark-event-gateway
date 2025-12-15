package fr.an.spark.gateway.eventlog.model;

import fr.an.spark.gateway.utils.LsUtils;
import lombok.val;

import java.util.List;
import java.util.Map;

public class SparkContextConstants {

    public static final String SPARK_JOB_DESCRIPTION = "spark.job.description";
    public static final String SPARK_JOB_GROUP_ID = "spark.jobGroup.id";
    public static final String SPARK_JOB_INTERRUPT_ON_CANCEL = "spark.job.interruptOnCancel";
    public static final String SPARK_JOB_TAGS = "spark.job.tags";
    public static final String SPARK_SCHEDULER_POOL = "spark.scheduler.pool";
    public static final String SPARK_RDD_SCOPE = "spark.rdd.scope";
    public static final String SPARK_RDD_SCOPE_NO_OVERRIDE = "spark.rdd.scope.noOverride";

    public static final String SPARK_TASK_CPUS = "spark.task.cpus"; // cf https://github.com/apache/spark/blob/master/core/src/main/scala/org/apache/spark/internal/config/package.scala#L713

    public static final String SPARK_EXECUTOR_CORES = "spark.executor.cores";

    /**
     * Executor id for the driver.  In earlier versions of Spark, this was `<driver>`
     */
    public static final String DRIVER_IDENTIFIER = "driver";

    /** Separator of tags in SPARK_JOB_TAGS property */
    public static final String SPARK_JOB_TAGS_SEP = ",";

    public static final String DEFAULT_POOL_NAME = "default";

    public static final String SQL_EXECUTION_ID_KEY = "spark.sql.execution.id";


    // -----------------------------------------------------------------------------------------------------------------

    public static String jobDescriptionOf(Map<String,String> props, boolean removeFromMap) {
        return extractPropString(props, SPARK_JOB_DESCRIPTION, removeFromMap);
    }

    public static String jobGroupIdOf(Map<String,String> props, boolean removeFromMap) {
        return extractPropString(props, SPARK_JOB_GROUP_ID, removeFromMap);
    }

    public static List<String> jobTagsOf(Map<String,String> props, boolean removeFromMap) {
        val found = extractPropString(props, SPARK_JOB_TAGS, removeFromMap);
        if (found == null) {
            return null;
        }
        val tmp = LsUtils.filter(List.of(found.split(SPARK_JOB_TAGS_SEP)), x -> !x.isEmpty());
        tmp.sort(String::compareTo);
        return tmp;
    }

    public static Long sqlExecutionIdOfOpt(Map<String,String> props, boolean removeFromMap) {
        return extractPropLong(props, SQL_EXECUTION_ID_KEY, removeFromMap);
    }

    public static String rddScopeOf(Map<String,String> props, boolean removeFromMap) {
        return extractPropString(props, SPARK_RDD_SCOPE, removeFromMap);
    }

    public static Boolean rddScopeNoOverrideOf(Map<String,String> props, boolean removeFromMap) {
        return extractPropBoolean(props, SPARK_RDD_SCOPE_NO_OVERRIDE, removeFromMap);
    }

    public static String sparkSchedulerPoolOfOpt(Map<String,String> props) {
        return sparkSchedulerPoolOfOpt(props, false);
    }
    public static String sparkSchedulerPoolOfOpt(Map<String,String> props, boolean removeFromMap) {
        return extractPropString(props, SPARK_SCHEDULER_POOL, removeFromMap);
    }

    public static int sparkExecutorCoresOf(Map<String, String> props, int defaultValue, boolean removeFromMap) {
        return extractPropInt(props, SPARK_EXECUTOR_CORES, defaultValue, removeFromMap);
    }

    public static int cpusPerTaskOf(Map<String, String> props, int defaultCpusPerTask, boolean removeFromMap) {
        return extractPropInt(props, SPARK_TASK_CPUS, defaultCpusPerTask, removeFromMap);
    }

    // -----------------------------------------------------------------------------------------------------------------

    protected static String getPropString(Map<String,String> props, String key) {
        return extractPropString(props, key, false);
    }

    protected static String extractPropString(Map<String,String> props, String key, boolean removeFromMap) {
        if (props == null) {
            return null;
        }
        val found = props.get(key);
        if (removeFromMap) {
            props.remove(key);
        }
        return (found != null) ? found.toString() : null;
    }

    protected static Long getPropLong(Map<String,String> props, String key) {
        return extractPropLong(props, key, false);
    }

    protected static Long extractPropLong(Map<String,String> props, String key, boolean removeFromMap) {
        if (props == null) {
            return null;
        }
        String v = props.get(key);
        if (removeFromMap) {
            props.remove(key);
        }
        if (v == null) {
            return null;
        }
        try {
            return Long.parseLong(v);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    protected static Integer extractPropInt(Map<String,String> props, String key, Integer defaultValue, boolean removeFromMap) {
        if (props == null) {
            return null;
        }
        String v = props.get(key);
        if (removeFromMap) {
            props.remove(key);
        }
        if (v == null) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(v);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    protected static Boolean getPropBoolean(Map<String,String> props, String key) {
        return extractPropBoolean(props, key, false);
    }

    protected static Boolean extractPropBoolean(Map<String,String> props, String key, boolean removeFromMap) {
        if (props == null) {
            return null;
        }
        String v = props.get(key);
        if (removeFromMap) {
            props.remove(key);
        }
        if (v == null) {
            return null;
        }
        try {
            return Boolean.parseBoolean(v);
        } catch (Exception ex) {
            return null;
        }
    }

}
