package fr.an.spark.gateway.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import fr.an.spark.gateway.dto.SparkEvent;
import lombok.val;
import lombok.extern.slf4j.Slf4j;

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
            for(;;) {
                String line = reader.readLine();
                if (line == null) {
                    break;
                }
                try {
                    val sparkEvent = om.readValue(line, SparkEvent.class);
                    res.add(sparkEvent);
                } catch(com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException ex) {
                    System.out.println("unrecognized json prop:");
                    System.out.println(line);
                    System.out.println("ex:" + ex.getMessage());
                    System.out.println();
                } catch(Exception ex) {
                    System.out.println("Failed to read line :");
                    System.out.println(line);

                    log.warn("Failed to read SparkEvent from " + line + " .." + ex.getMessage());
                }
            }
        } catch(IOException ex) {
            throw new RuntimeException("Failed to read " + ndjsonFile, ex);
        }
        return res;
    }

}
