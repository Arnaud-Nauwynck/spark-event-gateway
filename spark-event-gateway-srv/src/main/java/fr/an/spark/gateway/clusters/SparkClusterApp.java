package fr.an.spark.gateway.clusters;

import fr.an.spark.gateway.dto.clusters.SqlExecutionEventsDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkAppSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.SparkSQLExecutionEventSummaryDTO;
import fr.an.spark.gateway.dto.sql.NodeDuplicatesWithinSqlExecAnalysisDTO;
import fr.an.spark.gateway.eventlog.model.SparkEvent;
import fr.an.spark.gateway.service.SparkEventsUtil;
import fr.an.spark.gateway.sql.SparkPlanTree;
import fr.an.spark.gateway.sql.analysis.NodeDuplicatesExecAnalyser;
import fr.an.spark.gateway.utils.LsUtils;
import lombok.val;

import java.util.*;
import java.util.function.Predicate;

/**
 *
 */
public abstract class SparkClusterApp {

    public final SparkCluster cluster;
    public final String appName;

    public final String clusterName;
    public final SparkClusterAppKey appKey;

    protected SparkAppSummaryDTO cachedAppSummary;

    protected Map<Long,NodeDuplicatesWithinSqlExecAnalysisDTO> cachedNodeDuplicatesAnalysis = new HashMap<>();


    // -----------------------------------------------------------------------------------------------------------------

    public SparkClusterApp(SparkCluster cluster, String appName) {
        this.cluster = Objects.requireNonNull(cluster);
        this.appName = Objects.requireNonNull(appName);
        this.clusterName = cluster.clusterName;
        this.appKey = new SparkClusterAppKey(cluster.clusterName, appName);
    }

    // -----------------------------------------------------------------------------------------------------------------

    public abstract Iterator<SparkEvent> getSparkEventsIterator();

    public SparkAppSummaryDTO toAppSummaryDTO() {
        if (cachedAppSummary == null) {
            cachedAppSummary = buildAppSummaryDTO();
        }
        return cachedAppSummary;
    }

    protected abstract SparkAppSummaryDTO buildAppSummaryDTO();

    public abstract List<SparkEventSummaryDTO> listSparkEventSummaryDTOs(int from, int limit);

    public List<SparkEventSummaryDTO> listSparkEventSummaryDTOs(Predicate<SparkEventSummaryDTO> pred) {
        // TODO not efficient!!!
        List<SparkEventSummaryDTO> tmpAllEventSummaries = listSparkEventSummaryDTOs(0, Integer.MAX_VALUE);
        return LsUtils.filter(tmpAllEventSummaries, pred);
    }

    public List<SparkSQLExecutionEventSummaryDTO> listSparkSqlExecutionEventDTOs() {
        // TODO not efficient!!!
        List<SparkEventSummaryDTO> tmpAllEventSummaries = listSparkEventSummaryDTOs(0, Integer.MAX_VALUE);
        return LsUtils.filterMap(tmpAllEventSummaries,
                e -> e instanceof SparkSQLExecutionEventSummaryDTO,
                e -> (SparkSQLExecutionEventSummaryDTO) e);
    }

    public SparkSQLExecutionEventSummaryDTO getSqlExecSummaryEvent(long sqlId) {
        // TODO not efficient!!!
        val tmpAllSql =  listSparkSqlExecutionEventDTOs();
        return LsUtils.findFirst(tmpAllSql, sqlExec -> sqlExec.execId == sqlId);
    }


    public SqlExecutionEventsDTO getSqlExecutionEvents(long sqlId) {
        Iterator<SparkEvent> eventsIter = getSparkEventsIterator();
        return SparkEventsUtil.eventsIterToSqlExecutionEventsDTO(eventsIter, sqlId);
    }

    public NodeDuplicatesWithinSqlExecAnalysisDTO analyseNodeDuplicatesWithinSqlExec(long sqlId) {
        NodeDuplicatesWithinSqlExecAnalysisDTO res = cachedNodeDuplicatesAnalysis.get(sqlId);
        if (null == res) {
            res = doAnalyseNodeDuplicatesWithinSqlExec(sqlId);
            cachedNodeDuplicatesAnalysis.put(sqlId, res);
        }
        return res;
    }

    private NodeDuplicatesWithinSqlExecAnalysisDTO doAnalyseNodeDuplicatesWithinSqlExec(long sqlId) {
        // internally use getSqlExecutionEvents + rebuild SqlExecTracer !
        Iterator<SparkEvent> eventsIter = getSparkEventsIterator();
        // *** Slow ***
        val sqlTracker = SparkEventsUtil.replayEventsIter_ForSqlExec(eventsIter, sqlId);
        SparkPlanTree planTree = sqlTracker.getCurrPlanInfoTree();
        return NodeDuplicatesExecAnalyser.analyseNodeDuplicatesWithinSqlExec(planTree);
    }

}
