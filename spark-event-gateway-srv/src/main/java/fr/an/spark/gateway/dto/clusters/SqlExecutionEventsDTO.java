package fr.an.spark.gateway.dto.clusters;

import fr.an.spark.gateway.eventlog.model.SparkEvent;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class SqlExecutionEventsDTO {
    public long sqlId;
    public List<SparkEvent> startAppEvents;
    public int startSqlEventNum; // deprecated
    public List<SparkEvent> events;
    public int endSqlEventNum; // deprecated
}
