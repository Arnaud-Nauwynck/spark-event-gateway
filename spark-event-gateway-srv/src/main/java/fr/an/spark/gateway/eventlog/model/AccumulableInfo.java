package fr.an.spark.gateway.eventlog.model;

import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import com.fasterxml.jackson.annotation.JsonProperty;

@NoArgsConstructor
public class AccumulableInfo {

    @JsonProperty("ID")
    public int id;

    @JsonProperty("Name")
    public String name;

    @JsonProperty("Update")
    public Long update;

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


    public AccumulableInfo(int id, String name, Long update, Long value) {
        this.id = id;
        this.name = name;
        this.update = update;
        this.value = value;
    }

}
