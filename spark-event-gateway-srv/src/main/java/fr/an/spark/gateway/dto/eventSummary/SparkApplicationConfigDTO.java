package fr.an.spark.gateway.dto.eventSummary;

import fr.an.spark.gateway.eventlog.model.SparkContextConstants;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerEnvironmentUpdate;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerLogStart;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerResourceProfileAdded;
import jakarta.annotation.Nullable;
import lombok.val;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Summary of Spark environment + configuration
 */
public class SparkApplicationConfigDTO {

    /** from SparkListenerLogStart event */
    public String sparkVersion; // SPARK_VERSION

    /** from SparkListenerEnvironmentUpdate jvmInformation */
    // SparkListenerEnvironmentUpdate environmentUpdateEvent;
    public String javaVersion;
    public String javaHome;
    public String scalaVersion;

    public Map<String, String> jvmInformation; // TODO redundant with javaVersion/javaHome..

    public Map<String, String> sparkProperties;
    public Map<String, String> hadoopProperties;
    public Map<String, String> systemProperties;

    /** key = jar file, value = "System Classpath", or other? */
    public Map<String, String> classpathEntries;

    @Nullable
    public Map<String, String> metricsProperties;

    @Nullable
    public Map<String, Map<String,String>> otherEnvironmentDetails;

    public int executorCore = 1;
    public int defaultCpusPerTask = 1;

    // TOADD
    public int coresGranted;
    public int maxCores;
    public int coresPerExecutor;
    public int memoryPerExecutorMB;

    // -----------------------------------------------------------------------------------------------------------------

    public void fillFromOnLogStart(SparkListenerLogStart event) {
        this.sparkVersion = event.version;
    }

    public void fillFromOnResourceProfileAdded(SparkListenerResourceProfileAdded event) {
        // TOADD ?
    }

    public void fillFromOnEnvironmentUpdate(SparkListenerEnvironmentUpdate event) {
        // this.environmentUpdateEvent = event;
        this.jvmInformation = new LinkedHashMap<>(event.jvmInformation);
        this.sparkProperties = new LinkedHashMap<>(event.sparkProperties);
        this.hadoopProperties = new LinkedHashMap<>(event.hadoopProperties);
        this.systemProperties = new LinkedHashMap<>(event.systemProperties);
        this.classpathEntries = new LinkedHashMap<>(event.classpathEntries);
        this.metricsProperties = (event.metricsProperties != null)? new LinkedHashMap<>(event.metricsProperties) : null;
        this.otherEnvironmentDetails = (otherEnvironmentDetails != null)? new LinkedHashMap<>(event.otherEnvironmentDetails) : null;

        // TODO remove dynamic properties properties, retained only "config" ones

        val jvmInfo = event.jvmInformation;
        this.javaVersion = jvmInfo.get("Java Version");
        this.javaHome = jvmInfo.get("Java Home");
        this.scalaVersion = jvmInfo.get("Scala Version");
        this.defaultCpusPerTask = SparkContextConstants.cpusPerTaskOf(sparkProperties, defaultCpusPerTask, true);
        this.executorCore = SparkContextConstants.sparkExecutorCoresOf(sparkProperties, executorCore, true);
    }

}
