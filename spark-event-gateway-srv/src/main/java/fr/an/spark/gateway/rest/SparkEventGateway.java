package fr.an.spark.gateway.rest;

import fr.an.spark.gateway.dto.IdentifiedSparkEvent;
import fr.an.spark.gateway.dto.SparkEvent;
import fr.an.spark.gateway.dto.SparkEvent.*;
import fr.an.spark.gateway.service.SparkEventService;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping(path = "/api/spark-event")
public class SparkEventGateway {

    @Autowired
    SparkEventService delegate;

    List<SparkEvent> cachedEvents;

    private List<SparkEvent> getCachedEvents() {
        List<SparkEvent> res = cachedEvents;
        if (res == null) {
            res = delegate.listEvents();
            this.cachedEvents = res;
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

    @AllArgsConstructor
    public static class SqlExecutionEventsDTO {
        public long sqlId;
        public List<IdentifiedSparkEvent> startAppEvents;
        public int startSqlEventNum;
        public List<IdentifiedSparkEvent> events;
        public int endSqlEventNum;
    }

    /**
     * return an extract of spark events, starting at "SQLExecutionStart" for given sqlId, up to "SQLExecutionEnd" (if found)
     * this may include many other events, unrelated to this sql execution
     * @param sqlId
     * @return
     */
    @GetMapping(path = "/sql/{sqlId}/events")
    public SqlExecutionEventsDTO findSqlExecutionEvent(@PathVariable("sqlId") long sqlId) {
        val resEvents = new ArrayList<IdentifiedSparkEvent>();
        val startAppEvents = new ArrayList<IdentifiedSparkEvent>();
        val ls = getCachedEvents();
        Iterator<SparkEvent> iter = ls.iterator();
        int eventNum = 1;
        int startSqlEventNum = -1;
        int endSqlEventNum = -1;
        SparkListenerSQLExecutionStart foundSqlStartEvent = null;
        for(; iter.hasNext(); eventNum++) {
            SparkEvent ev = iter.next();
            if (ev instanceof SparkListenerEnvironmentUpdate
                || ev instanceof SparkListenerApplicationStart
                // || ev instanceof SparkListenerExecutorAdded || ev instanceof SparkListenerExecutorRemoved
            ) {
                startAppEvents.add(new IdentifiedSparkEvent(eventNum, ev));
            }
            if (ev instanceof SparkListenerSQLExecutionStart sqlStartEvent) {
                if (sqlStartEvent.executionId == sqlId) {
                    foundSqlStartEvent = sqlStartEvent;
                    startSqlEventNum = eventNum;
                    // found start of SQL execution events
                    break;
                }
            }
        }
        if (foundSqlStartEvent != null) {
            // now take all events, up to SQLExecutionEnd, if any
            resEvents.add(new IdentifiedSparkEvent(eventNum, foundSqlStartEvent));
            for(; iter.hasNext(); eventNum++) {
                SparkEvent ev = iter.next();
                resEvents.add(new IdentifiedSparkEvent(eventNum, ev));
                if (ev instanceof SparkListenerSQLExecutionEnd sqlEndEvent
                        && sqlEndEvent.executionId == sqlId) {
                    endSqlEventNum = eventNum;
                    break;
                }
            }
        }
        return new SqlExecutionEventsDTO(sqlId, startAppEvents, startSqlEventNum, resEvents, endSqlEventNum);
    }

}
