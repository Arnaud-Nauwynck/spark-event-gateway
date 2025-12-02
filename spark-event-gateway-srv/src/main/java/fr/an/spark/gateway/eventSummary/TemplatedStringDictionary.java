package fr.an.spark.gateway.eventSummary;

import lombok.RequiredArgsConstructor;

import java.util.LinkedHashMap;
import java.util.Map;

public class TemplatedStringDictionary {

    @RequiredArgsConstructor
    public static class TemplateStringEntry {
        private final int templateId;
        private final String template;
        // TODO no templatization logic yet
        // List<TemplateStringParameterDescription> paramsDescriptions;

        private int usedCount;
        private int incrUsedCount() { return ++usedCount; }
    }

    @RequiredArgsConstructor
    public static class TemplateStringParameterDescription {
        // implicit.. public final TemplateStringEntry parentTemplate;
        public final String name;
    }

    @RequiredArgsConstructor
    public static class TemplatedString {
        public final String text;
        public final TemplateStringEntry templateEntry;
        public final int templateUsedCountIndex;
        // TODO no templatization logic yet
        // Map<String,String> paramsValues;
    }


    private int nextTemplateId = 1;
    private final Map<String, TemplateStringEntry> entryByTemplateKey = new LinkedHashMap<>();

    // -----------------------------------------------------------------------------------------------------------------

    public TemplateStringEntry getOrAddTemplate(String template) {
        TemplateStringEntry entry = entryByTemplateKey.get(template);
        if (entry == null) {
            int templateId = nextTemplateId++;
            entry = new TemplateStringEntry(templateId, template);
            entryByTemplateKey.put(template, entry);
        }
        return entry;
    }

    public TemplatedString templated(String text) {
        // TODO no templatization logic yet
        TemplateStringEntry templateEntry = getOrAddTemplate(text);
        int usedCountIndex = templateEntry.incrUsedCount();
        return new TemplatedString(text, templateEntry, usedCountIndex);
    }

}
