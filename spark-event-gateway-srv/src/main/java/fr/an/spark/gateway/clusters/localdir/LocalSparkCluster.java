package fr.an.spark.gateway.clusters.localdir;

import fr.an.spark.gateway.clusters.SparkCluster;
import fr.an.spark.gateway.clusters.SparkClusterApp;
import fr.an.spark.gateway.clusters.SparkEventFileSummary;
import fr.an.spark.gateway.clusters.TopEventSummariesRetainConf;
import fr.an.spark.gateway.config.SparkEventAppConfigurationProperties.SparkClusterConfProperties;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import java.io.File;
import java.io.FilenameFilter;
import java.util.*;

/**
 *
 */
@Slf4j
public class LocalSparkCluster extends SparkCluster {

    protected final File sourceLocalDir;
    protected final File destSummaryLocalDir;

    // @GuardedBy("appListLock")
    protected long lastScanAppListsTime;
    // @GuardedBy("appListLock")
    protected long maxCachedAppsAgeMillis = 60_000;

    // -----------------------------------------------------------------------------------------------------------------

    public LocalSparkCluster(SparkClusterConfProperties src) {
        super(src);
        this.sourceLocalDir = new File(src.getSourceLocalDir());
        this.destSummaryLocalDir = new File(src.getDestSummaryLocalDir());

        if (! sourceLocalDir.exists()) {
            sourceLocalDir.mkdirs();
        }
        if (! destSummaryLocalDir.exists()) {
            destSummaryLocalDir.mkdirs();
        }
    }

    // -----------------------------------------------------------------------------------------------------------------

    @Override
    public List<SparkClusterApp> listApps() {
        long now = System.currentTimeMillis();
        synchronized (appListLock) {
            if (lastScanAppListsTime == 0 || (now - lastScanAppListsTime) > maxCachedAppsAgeMillis) {
                // rescan list of spark app names
                File[] appDirs = sourceLocalDir.listFiles();
                if (appDirs == null) {
                    appDirs = new File[0]; // should not occur
                }
                Set<String> remainAppNames = new HashSet<>(_cachedApps.keySet());
                for (File appDir : appDirs) {
                    String sparkAppName = appDir.getName();
                    remainAppNames.remove(sparkAppName);
                    val app = _cachedApps.computeIfAbsent(sparkAppName, k -> new LocalSparkClusterApp(this, sparkAppName, appDir));
                    app.toAppSummaryDTO(); // eager load
                }

                // maybe remove cachedApp that are no longer present
                if (!remainAppNames.isEmpty()) {
                    for (val remainAppName : remainAppNames) {
                        _cachedApps.remove(remainAppName);
                    }
                }
                this.lastScanAppListsTime = now;
            }
            return new ArrayList<>(_cachedApps.values());
        }
    }

}
