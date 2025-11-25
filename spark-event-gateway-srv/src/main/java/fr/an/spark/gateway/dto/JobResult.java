package fr.an.spark.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class JobResult {

    @JsonProperty("Result")
    public String result;

    @JsonProperty("Exception")
    public ExceptionDTO exception;
}
