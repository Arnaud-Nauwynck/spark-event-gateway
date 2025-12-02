package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.JsonProperty;

// TO CHANGE?  class JobSucceeded extends JobResult {};   class JobFailed extends JobResult { public Exception exception;}
public class JobResult {

    @JsonProperty("Result")
    public String result;

    // TODO PATCH ARNAUD
    @JsonProperty("Exception")
    public SparkException exception;
}
