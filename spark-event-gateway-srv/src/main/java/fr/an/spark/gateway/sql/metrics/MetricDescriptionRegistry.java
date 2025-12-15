package fr.an.spark.gateway.sql.metrics;

import fr.an.spark.gateway.sql.metrics.MetricDescription.EnumMetricType;
import fr.an.spark.gateway.sql.metrics.MetricDescription.GenericMetricDescription;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MetricDescriptionRegistry {
    public static final MetricDescriptionRegistry INSTANCE = new MetricDescriptionRegistry();

    private final Map<String, MetricDescription> registry = new HashMap<>();

    private MetricDescriptionRegistry() {
        MetricDescriptions.registerStdMetricDescriptions(this);
    }

    public MetricDescription byName(String name) {
        return registry.get(name);
    }

    public void register(MetricDescription type) {
        registry.put(type.getName(), type);
    }

    public void registers(List<MetricDescription> types) {
        for (MetricDescription t : types) {
            register(t);
        }
    }

    public MetricDescription resolve(String name, String metricType) {
        MetricDescription found = byName(name);
        if (found != null) {
            return found;
        } else {
            System.out.println("public static class " + name + "MetricDescription extends MetricDescription {\n" +
                    "  public " + name + "MetricDescription() {\n" +
                    "    super(\"" + name + "\", 'EnumMetricType." + metricType.toUpperCase() + ", EnumMetricUnit.UNIT);\n" +
                    "  }\n" +
                    "}\n");
            EnumMetricType enumMetricType;
            try {
                enumMetricType = EnumMetricType.valueOf(metricType.toUpperCase());
            } catch(IllegalArgumentException ex) {
                enumMetricType = EnumMetricType.SUM; // ??
            }
            GenericMetricDescription generic = new GenericMetricDescription(name, enumMetricType);
            register(generic);
            return generic;
        }
    }
}
