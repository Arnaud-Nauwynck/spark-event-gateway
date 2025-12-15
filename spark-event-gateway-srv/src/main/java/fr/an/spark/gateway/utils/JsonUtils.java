package fr.an.spark.gateway.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.val;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;

public class JsonUtils {

    public static final ObjectMapper jsonWriter = createJsonMapper();
    public static final ObjectMapper jsonReader = createJsonReader();

    private static ObjectMapper createJsonMapper() {
        val res = new ObjectMapper();
        return res;
    }
    private static ObjectMapper createJsonReader() {
        val res = new ObjectMapper();
        // res.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES); // strict json !!
        return res;
    }


    public static <T> T readJson(Reader reader, Class<T> clss) {
        try {
            return jsonReader.readValue(reader, clss);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> T parseJson(String json, Class<T> clss) {
        try {
            return jsonReader.readValue(json, clss);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> void writeJson(Writer writer, T src) {
        try {
            jsonWriter.writeValue(writer, src);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
