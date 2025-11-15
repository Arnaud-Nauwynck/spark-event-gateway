package fr.an.spark.gateway;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.val;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class NDJsonToPrettyFilesWriteMain {

    private static final ObjectMapper jsonMapper = new ObjectMapper();
    static {
        jsonMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    public static void main(String[] args) {
        val inputArg = // args[0]; 
                "C:/arn/devPerso/spark-event-gateway/spark-event-gateway-srv/data/exec1-insertInto/event-log.ndjson";
        Path inputPath = Paths.get(inputArg);
        Path outputDir = inputPath.getParent().resolve("events");
        if (! Files.exists(outputDir)) {
            //mkdirs()
        }
        try(val reader = Files.newBufferedReader(inputPath)) {
            int lineNum = 1;
            for(;; lineNum++) {
                String line = reader.readLine();
                if (line == null) {
                    break;
                }
                val tree = jsonMapper.readTree(line);
                val eventPath = outputDir.resolve("event"+lineNum +".json");
                try(val writer = Files.newBufferedWriter(eventPath)) {
                    jsonMapper.writeValue(writer, tree);
                } catch(Exception ex) {
                    System.out.println();
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
