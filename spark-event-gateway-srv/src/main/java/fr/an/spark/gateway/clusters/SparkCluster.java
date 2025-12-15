package fr.an.spark.gateway.clusters;

import fr.an.spark.gateway.config.SparkEventAppConfigurationProperties.SparkClusterConfProperties;
import fr.an.spark.gateway.utils.LsUtils;
import lombok.Getter;
import lombok.val;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public abstract class SparkCluster {

    public final String clusterName;

    protected final Object appListLock = new Object();

    // @GuardedBy("appListLock")
    protected final Map<String, SparkClusterApp> _cachedApps = new LinkedHashMap<>();

    @Getter
    protected final TopEventSummariesRetainConf topEventSummariesRetainPolicy = new TopEventSummariesRetainConf();

    // -----------------------------------------------------------------------------------------------------------------

    public SparkCluster(SparkClusterConfProperties src) {
        this.clusterName = src.getName();
    }

    // -----------------------------------------------------------------------------------------------------------------

    public abstract List<SparkClusterApp> listApps();

    public SparkClusterApp getApp(String appName) {
        val ls = listApps();
        val found = LsUtils.findFirst(ls, app -> app.appName.equals(appName));
        if (found == null) {
            throw new IllegalArgumentException("No App with name: " + appName + " in Cluster: " + clusterName);
        }
        return found;
    }
}
