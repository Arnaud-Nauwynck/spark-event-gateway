package fr.an.spark.gateway.clusters;

public class TopEventSummariesRetainConf {

    public int slowestNTopLevelJobExecSummaries = 10;
    public int slowestNSqlExecSummaries = 10;

    public int ignoreTopLevelJobMinTimeMs = 200;
    public int ignoreSQLMinTimeMs = 200;

    public int retainNRepeatedCallSite = 10;
    public int retainNExecsPerRepeatedCallSite = 3;

}
