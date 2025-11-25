package fr.an.spark.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ExceptionDTO {

    @JsonProperty("Message")
    public String message;

    @JsonProperty("Stack Trace")
    public List<StackTraceDTO> stackTrace;

    public static class StackTraceDTO {
        @JsonProperty("Declaring Class")
        public String declaringClass;

        @JsonProperty("Method Name")
        public String methodName;

        @JsonProperty("File Name")
        public String fileName;

        @JsonProperty("Line Number")
        public int lineNumber;
    }

}
