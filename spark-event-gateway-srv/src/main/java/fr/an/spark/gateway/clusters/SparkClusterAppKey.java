package fr.an.spark.gateway.clusters;

import lombok.EqualsAndHashCode;

import java.util.Objects;

@EqualsAndHashCode
public class SparkClusterAppKey implements Comparable<SparkClusterAppKey> {

    public final String clusterName;
    public final String appName;

    public SparkClusterAppKey(String clusterName, String appName) {
        this.clusterName = Objects.requireNonNull(clusterName);
        this.appName = Objects.requireNonNull(appName);
    }

    @Override
    public String toString() {
        return clusterName + "/" + appName;
    }

    @Override
    public int compareTo(SparkClusterAppKey other) {
        int cmp = this.clusterName.compareTo(other.clusterName);
        if (cmp != 0) {
            return cmp;
        }
        return this.appName.compareTo(other.appName);
    }

}
