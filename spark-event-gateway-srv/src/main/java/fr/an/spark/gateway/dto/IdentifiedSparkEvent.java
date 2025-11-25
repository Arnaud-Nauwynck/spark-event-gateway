package fr.an.spark.gateway.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class IdentifiedSparkEvent {
    public int num;
    public SparkEvent event;
}
