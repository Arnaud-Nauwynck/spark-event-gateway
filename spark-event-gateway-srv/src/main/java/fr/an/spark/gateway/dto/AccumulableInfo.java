package fr.an.spark.gateway.dto;

import org.springframework.lang.Nullable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AccumulableInfo {

    @JsonProperty("ID")
    public int id;

    @JsonProperty("Name")
    public String name;

    @JsonProperty("Update")
    public long update;

    @JsonProperty("Value")
    public Long value;

    @JsonProperty("Internal")
    public boolean internal;

    @JsonProperty("Count Failed Values")
    public boolean countFailedValues;

    @JsonProperty("Metadata")
    @Nullable
    // public Map<String,Object> metadata;
    // public String metadata;
    public Object metadata;

}
