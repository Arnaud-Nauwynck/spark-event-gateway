package fr.an.spark.gateway.eventlog.model;

import fr.an.spark.gateway.utils.LsUtils;
import lombok.val;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SparkContextConstants {


    public static final String SPARK_JOB_DESCRIPTION = "spark.job.description";
    public static final String SPARK_JOB_GROUP_ID = "spark.jobGroup.id";
    public static final String SPARK_JOB_INTERRUPT_ON_CANCEL = "spark.job.interruptOnCancel";
    public static final String SPARK_JOB_TAGS = "spark.job.tags";
    public static final String SPARK_SCHEDULER_POOL = "spark.scheduler.pool";
    public static final String RDD_SCOPE_KEY = "spark.rdd.scope";
    public static final String RDD_SCOPE_NO_OVERRIDE_KEY = "spark.rdd.scope.noOverride";

    /**
     * Executor id for the driver.  In earlier versions of Spark, this was `<driver>`
     */
    public static final String DRIVER_IDENTIFIER = "driver";

    /** Separator of tags in SPARK_JOB_TAGS property */
    public static final String SPARK_JOB_TAGS_SEP = ",";

    public static final String DEFAULT_POOL_NAME = "default";


    public static String jobDescriptionOf(Map<String,Object> props) {
        if (props == null) {
            return null;
        }
        val found = props.get(SPARK_JOB_DESCRIPTION);
        return (found != null)? found.toString() : null;
    }

    public static String jobGroupIdOf(Map<String,Object> props) {
        if (props == null) {
            return null;
        }
        val found = props.get(SPARK_JOB_GROUP_ID);
        return (found != null) ? found.toString() : null;
    }

    public static List<String> jobTagsOf(Map<String,Object> props) {
        if (props == null) {
            return null;
        }
        val found = props.get(SPARK_JOB_TAGS);
        if (found == null) {
            return new ArrayList<>();
        }
        val split = found.toString().split(SPARK_JOB_TAGS_SEP);
        val tmp = LsUtils.filter(List.of(split), x -> !x.isEmpty());
        tmp.sort(String::compareTo);
        return tmp;
    }

    public static final String SQL_EXECUTION_ID_KEY = "spark.sql.execution.id";
    public static Long sqlExecutionIdOfOpt(Map<String,Object> props) {
        if (props == null) {
            return null;
        }
        Object v = props.get(SQL_EXECUTION_ID_KEY);
        if (v == null) {
            return null;
        }
        if (v instanceof Number vNum) {
            return vNum.longValue();
        } else if (v instanceof String vText) {
            try {
                return Long.parseLong(vText);
            } catch (NumberFormatException ex) {
                return null;
            }
        }
        return null;
    }

    public static String sparkSchedulerPoolOfOpt(Map<String, Object> props) {
        if (props == null) {
            return null;
        }
        Object v = props.get(SPARK_SCHEDULER_POOL);
        if (v == null) {
            return null;
        }
        if (v instanceof String vText) {
            return vText;
        }
        return v.toString();
    }

}
