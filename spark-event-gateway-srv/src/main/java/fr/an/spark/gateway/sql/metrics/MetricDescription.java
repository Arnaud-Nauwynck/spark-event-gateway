package fr.an.spark.gateway.sql.metrics;

import lombok.Getter;

@Getter
public abstract class MetricDescription {

    public final String name;

    public enum EnumMetricType {
        SUM,
        SIZE,
        TIMING,
        NS_TIMING,
        AVERAGE
    }

    public final EnumMetricType type;

    public enum EnumMetricUnit {
        BYTES,
        RECORDS,
        PARTITIONS,
        BLOCKS,
        FILES,
        BATCHES,
        TASKS,
        COUNT,
        MILLIS,
        CHUNKS, UNKNOWN_UNIT
    }

    public final EnumMetricUnit unit;

    // -----------------------------------------------------------------------------------------------------------------

    public MetricDescription(String name, EnumMetricType type, EnumMetricUnit unit) {
        this.name = name;
        this.type = type;
        this.unit = unit;
    }

    // -----------------------------------------------------------------------------------------------------------------


    public static class GenericMetricDescription extends MetricDescription {
        public GenericMetricDescription(String name, EnumMetricType type) {
            super(name, type, EnumMetricUnit.UNKNOWN_UNIT);
        }
    }

}
