package fr.an.spark.gateway.rest;

import fr.an.spark.gateway.dto.clusters.SqlExecutionEventsDTO;
import fr.an.spark.gateway.eventlog.model.SparkEvent;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerApplicationStart;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerEnvironmentUpdate;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLExecutionEnd;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLExecutionStart;
import fr.an.spark.gateway.service.SparkEventsReader;
import fr.an.spark.gateway.service.SparkEventsUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping(path = "/api/spark-event")
@RequiredArgsConstructor
public class SparkEventRestController {

    protected List<SparkEvent> cachedEvents;

    // -----------------------------------------------------------------------------------------------------------------

    private List<SparkEvent> getCachedEvents() {
        List<SparkEvent> res = cachedEvents;
        if (res == null) {
            res = readDataEventLogFileEvents();
            this.cachedEvents = res;
        }
        return res;
    }

    public List<SparkEvent> readDataEventLogFileEvents() {
        List<SparkEvent> res;
        File dataDir = new File("data");
        File ndjsonFile = new File(dataDir, "event-log.ndjson");
        try(val reader = new BufferedReader(new InputStreamReader(new FileInputStream(ndjsonFile)))) {
            res = SparkEventsReader.readEvents(1, reader);
        } catch(IOException ex) {
            throw new RuntimeException("Failed to read " + ndjsonFile, ex);
        }
        return res;
    }

    @PostConstruct
    public void preload() {
        new Thread(() -> {
            System.out.println("Preloading Spark Events in cache...");
            getCachedEvents();
        }).start();
    }

    @GetMapping(path = "/all")
    public List<SparkEvent> list() {
        List<SparkEvent> res = getCachedEvents();
        return res;
    }

    @GetMapping(path = "/{eventNum}")
    public SparkEvent findByNum(@PathVariable("eventNum") int eventNum) {
        val ls = getCachedEvents();
        val res = (0 < eventNum && eventNum <= ls.size())? ls.get(eventNum - 1) : null;
        return res;
    }

    /**
     * return an extract of spark events, starting at "SQLExecutionStart" for given sqlId, up to "SQLExecutionEnd" (if found)
     * this may include many other events, unrelated to this sql execution
     * @param sqlId
     * @return
     */
    @GetMapping(path = "/sql/{sqlId}/events")
    public SqlExecutionEventsDTO findSqlExecutionEvent(@PathVariable("sqlId") long sqlId) {
        val ls = getCachedEvents();
        return SparkEventsUtil.eventsIterToSqlExecutionEventsDTO(ls.iterator(), sqlId);
    }


}
