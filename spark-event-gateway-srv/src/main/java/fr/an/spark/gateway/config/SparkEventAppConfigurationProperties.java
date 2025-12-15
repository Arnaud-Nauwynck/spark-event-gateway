package fr.an.spark.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component @ConfigurationProperties(prefix="app")
public class SparkEventAppConfigurationProperties {

    protected List<SparkClusterConfProperties> sparkClusters;

    public enum SparkClusterType {
        SparkEventLogDir_Local
    }

    @Data
    public static class SparkClusterConfProperties {
        protected String name;
        protected SparkClusterType type;
        protected String sourceLocalDir;
        protected String destSummaryLocalDir;
    }

}
