package fr.an.spark.gateway.dto;

import fr.an.spark.gateway.eventlog.model.SparkEvent;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class IdentifiedSparkEvent {
    public int num;
    public SparkEvent event;
}
