package fr.an.spark.gateway.rest;

import fr.an.spark.gateway.clusters.SparkClustersService;
import fr.an.spark.gateway.dto.clusters.SparkClusterDTO;
import fr.an.spark.gateway.dto.clusters.SqlExecutionEventsDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkAppSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO;
import fr.an.spark.gateway.dto.sql.NodeDuplicatesWithinSqlExecAnalysisDTO;
import fr.an.spark.gateway.utils.DtoMapper;
import fr.an.spark.gateway.utils.LsUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/spark-apps")
@RequiredArgsConstructor
@Slf4j
public class SparkAppsRestController {

    private final SparkClustersService sparkAppsDiscoveryService;
    private final DtoMapper dtoMapper;

    @GetMapping("/clusters")
    public List<SparkClusterDTO> listClusters() {
        val tmpres = sparkAppsDiscoveryService.listClusters();
        return dtoMapper.map(tmpres, SparkClusterDTO.class);
    }

    @GetMapping("/cluster/{clusterName}")
    public SparkClusterDTO getCluster(@PathVariable("clusterName") String clusterName) {
        val tmpres = sparkAppsDiscoveryService.getCluster(clusterName);
        return dtoMapper.map(tmpres, SparkClusterDTO.class);
    }

    @GetMapping("/cluster/{clusterName}/spark-apps")
    public List<SparkAppSummaryDTO> listClusterSparkAppSummaries(@PathVariable("clusterName") String clusterName) {
        val cluster = sparkAppsDiscoveryService.getCluster(clusterName);
        val apps = cluster.listApps();
        return LsUtils.map(apps, app -> app.toAppSummaryDTO());
    }

    @GetMapping("/cluster/{clusterName}/spark-app/{sparkAppName}/event-summaries")
    public List<SparkEventSummaryDTO> sparkAppEventSummaries(
            @PathVariable("clusterName") String clusterName,
            @PathVariable("sparkAppName") String sparkAppName,
            @RequestParam(name="from", required = false) int from,
            @RequestParam(name="limit", required = false, defaultValue = "1000") int limit
            ) {
        val app = sparkAppsDiscoveryService.getClusterApp(clusterName, sparkAppName);
        return app.listSparkEventSummaryDTOs(from, limit);
    }

    @GetMapping(path = "/cluster/{clusterName}/spark-app/{sparkAppName}/sql/{sqlId}/events")
    public SqlExecutionEventsDTO getSqlExecutionEvents(
            @PathVariable("clusterName") String clusterName,
            @PathVariable("sparkAppName") String sparkAppName,
            @PathVariable("sqlId") long sqlId) {
        val app = sparkAppsDiscoveryService.getClusterApp(clusterName, sparkAppName);
        return app.getSqlExecutionEvents(sqlId);
    }

    @GetMapping(path = "/cluster/{clusterName}/spark-app/{sparkAppName}/sql/{sqlId}/node-duplicates-analysis")
    public NodeDuplicatesWithinSqlExecAnalysisDTO analyseNodeDuplicatesWithinSqlExec(
            @PathVariable("clusterName") String clusterName,
            @PathVariable("sparkAppName") String sparkAppName,
            @PathVariable("sqlId") long sqlId) {
        val app = sparkAppsDiscoveryService.getClusterApp(clusterName, sparkAppName);
        return app.analyseNodeDuplicatesWithinSqlExec(sqlId);
    }

}
