package fr.an.spark.gateway.service;

import fr.an.spark.gateway.dto.clusters.SqlExecutionEventsDTO;
import fr.an.spark.gateway.eventTrackers.SparkContextTracker;
import fr.an.spark.gateway.eventTrackers.SqlExecTracker;
import fr.an.spark.gateway.eventlog.model.SparkEvent;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerApplicationStart;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerEnvironmentUpdate;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLExecutionEnd;
import fr.an.spark.gateway.eventlog.model.SparkEvent.SparkListenerSQLExecutionStart;
import fr.an.spark.gateway.sql.SparkPlanTree;
import lombok.val;

import java.util.ArrayList;
import java.util.Iterator;

public class SparkEventsUtil {

    public static SqlExecutionEventsDTO eventsIterToSqlExecutionEventsDTO(Iterator<SparkEvent> eventsIter, long sqlId) {
        val resEvents = new ArrayList<SparkEvent>(100);
        val startAppEvents = new ArrayList<SparkEvent>();
        int eventNum = 1;
        int startSqlEventNum = -1;
        int endSqlEventNum = -1;
        SparkListenerSQLExecutionStart foundSqlStartEvent = null;
        for(; eventsIter.hasNext(); eventNum++) {
            SparkEvent ev = eventsIter.next();
            if (ev instanceof SparkListenerEnvironmentUpdate
                    || ev instanceof SparkListenerApplicationStart
                // || ev instanceof SparkListenerExecutorAdded || ev instanceof SparkListenerExecutorRemoved
            ) {
                startAppEvents.add(ev);
            }
            if (ev instanceof SparkListenerSQLExecutionStart sqlStartEvent) {
                if (sqlStartEvent.executionId == sqlId) {
                    foundSqlStartEvent = sqlStartEvent;
                    startSqlEventNum = eventNum;
                    // found start of sql execution events
                    break;
                }
            }
        }
        if (foundSqlStartEvent != null) {
            // now take all events, up to SQLExecutionEnd, if any
            resEvents.add(foundSqlStartEvent);
            for(; eventsIter.hasNext(); eventNum++) {
                SparkEvent ev = eventsIter.next();
                resEvents.add(ev);
                if (ev instanceof SparkListenerSQLExecutionEnd sqlEndEvent
                        && sqlEndEvent.executionId == sqlId) {
                    endSqlEventNum = eventNum;
                    break;
                }
            }
        }
        return new SqlExecutionEventsDTO(sqlId, startAppEvents, startSqlEventNum, resEvents, endSqlEventNum);
    }


    public static SqlExecTracker replayEventsIterUpToSqlExec(Iterator<SparkEvent> eventsIter, SparkContextTracker sparkContextTracker, long sqlId) {
        SparkListenerSQLExecutionStart foundSqlStartEvent = null;
        for(; eventsIter.hasNext(); ) {
            SparkEvent ev = eventsIter.next();

            if (ev instanceof SparkListenerSQLExecutionStart sqlStartEvent) {
                if (sqlStartEvent.executionId == sqlId) {
                    ev.accept(sparkContextTracker);
                    foundSqlStartEvent = sqlStartEvent;
                    // found start of sql execution events
                    break;
                }
            }

            // TODO could ignore all Sql/Job/Stage/Task events before SQLExecutionStart
            ev.accept(sparkContextTracker);
        }

        if (foundSqlStartEvent != null) {
            // now continue replay all events, up to SQLExecutionEnd, if any
            for(; eventsIter.hasNext(); ) {
                SparkEvent ev = eventsIter.next();
                // TODO could ignore all others Job/Stage/Task events not related to sqlId
                ev.accept(sparkContextTracker);

                if (ev instanceof SparkListenerSQLExecutionEnd sqlEndEvent
                        && sqlEndEvent.executionId == sqlId) {
                    break;
                }
            }
        }
        return sparkContextTracker.getRetainSqlExec(sqlId);
    }

    public static SqlExecTracker replayEventsIter_ForSqlExec(
            Iterator<SparkEvent> eventsIter, long sqlId) {
        val sparkContextTracker = new SparkContextTracker(sqlExec -> sqlExec.sqlId == sqlId, null, null);
        return replayEventsIterUpToSqlExec(eventsIter, sparkContextTracker, sqlId);
    }

}
