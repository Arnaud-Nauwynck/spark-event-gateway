package fr.an.spark.gateway.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.an.spark.gateway.eventlog.model.SparkEvent;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class SparkEventsReader {

    private static ObjectMapper om = createJsonMapper();

    private static ObjectMapper createJsonMapper() {
        val res = new ObjectMapper();
        res.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES); // strict json !!
        return res;
    }

    public static List<SparkEvent> readEvents(int startNum, BufferedReader lineReader) throws IOException {
        val res = new ArrayList<SparkEvent>(1000);
        val startTime = System.currentTimeMillis();
        int lineNum = startNum;
        for (; ; lineNum++) {
            String line = lineReader.readLine();
            if (line == null) {
                break;
            }
            val sparkEvent = readEvent(line, lineNum);
            if (sparkEvent != null) {
                res.add(sparkEvent);
            }

            if (0 == (lineNum % 100_000)) {
                System.out.println(".. read line #" + lineNum);
            }
        }

        val millis = System.currentTimeMillis() - startTime;
        log.info("finished read event-log: " + res.size() + ", took " + millis);
        return res;
    }

    public static SparkEvent readEvent(String line, int lineNum) {
        try {
            val sparkEvent = om.readValue(line, SparkEvent.class);

            sparkEvent.setEventNum(lineNum);
            return sparkEvent;
        } catch (com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException ex) {
            System.out.println("Failed read event-log line #" + lineNum);
            System.out.println("unrecognized json prop:" + ex.getPropertyName());
            System.out.println("in path:" + ex.getPathReference());
            System.out.println(line);
            System.out.println("ex:" + ex.getMessage());
            System.out.println();
        } catch (com.fasterxml.jackson.databind.exc.InvalidTypeIdException ex) {
            System.out.println("Failed read event-log line #" + lineNum);
            System.out.println("invalid type id:" + ex.getTypeId() + " baseType:" + ex.getBaseType());
            System.out.println(line);
            System.out.println("ex:" + ex.getMessage());
            System.out.println();
        } catch (Exception ex) {
            System.out.println("Failed to read event-log line #" + lineNum);
            System.out.println(line);

            log.warn("Failed to read SparkEvent from " + line + " .." + ex.getMessage());
        }
        return null;
    }

}
