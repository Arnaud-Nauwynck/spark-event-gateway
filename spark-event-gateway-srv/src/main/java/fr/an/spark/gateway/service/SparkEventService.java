package fr.an.spark.gateway.service;


import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.an.spark.gateway.eventlog.model.SparkEvent;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class SparkEventService {

    private ObjectMapper om = createJsonMapper();

    private ObjectMapper createJsonMapper() {
        val res = new ObjectMapper();
        res.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES); // strict json !!
        return res;
    }

    public List<SparkEvent> listEvents() {
        val res = new ArrayList<SparkEvent>();
        File dataDir = new File("data");
        File ndjsonFile = new File(dataDir, "event-log.ndjson");
        try(val reader = new BufferedReader(new InputStreamReader(new FileInputStream(ndjsonFile)))) {
            int lineNum = 1;
            for(;; lineNum++) {
                String line = reader.readLine();
                if (line == null) {
                    break;
                }
                try {
                    val sparkEvent = om.readValue(line, SparkEvent.class);
                    res.add(sparkEvent);
                } catch(com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException ex) {
                    System.out.println("Failed read event-log line #" + lineNum);
                    System.out.println("unrecognized json prop:");
                    System.out.println(line);
                    System.out.println("ex:" + ex.getMessage());
                    System.out.println();
                } catch(Exception ex) {
                    System.out.println("Failed to read event-log line #" + lineNum);
                    System.out.println(line);

                    log.warn("Failed to read SparkEvent from " + line + " .." + ex.getMessage());
                }

                if (0 == (lineNum % 100_000)) {
                    System.out.println(".. read line #" + lineNum);
                }

            }
        } catch(IOException ex) {
            throw new RuntimeException("Failed to read " + ndjsonFile, ex);
        }

        System.out.println("finished read event-log: " + res.size());
        return res;
    }

}
