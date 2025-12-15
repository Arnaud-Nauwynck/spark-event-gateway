package fr.an.spark.gateway.clusters;

import fr.an.spark.gateway.clusters.localdir.LocalSparkCluster;
import fr.an.spark.gateway.config.SparkEventAppConfigurationProperties;
import fr.an.spark.gateway.config.SparkEventAppConfigurationProperties.SparkClusterConfProperties;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class SparkClustersService {

    private final Map<String, SparkCluster> clusters = new LinkedHashMap<>();

    // -----------------------------------------------------------------------------------------------------------------

    @Autowired
    public SparkClustersService(SparkEventAppConfigurationProperties appProps) {
        val clusterConfs = appProps.getSparkClusters();
        if (clusterConfs != null) {
            for (val clusterConf : clusterConfs) {
                val cluster = createCluster(clusterConf);
                clusters.put(clusterConf.getName(), cluster);
            }
        }
    }

    private SparkCluster createCluster(SparkClusterConfProperties src) {
        val type = src.getType();
        return switch (type) {
            case SparkEventLogDir_Local -> new LocalSparkCluster(src);
            default -> throw new IllegalArgumentException("Unknown Spark Cluster Type: " + type);
        };
    }

    // -----------------------------------------------------------------------------------------------------------------

    public List<SparkCluster> listClusters() {
        return new ArrayList<>(clusters.values());
    }

    public SparkCluster getCluster(String name) {
        val res = clusters.get(name);
        if (res == null) {
            throw new IllegalArgumentException("No Cluster with name: " + name);
        }
        return res;
    }

    public SparkClusterApp getClusterApp(String clusterName, String appName) {
        val cluster = getCluster(clusterName);
        return cluster.getApp(appName);
    }

}