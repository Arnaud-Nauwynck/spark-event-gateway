package fr.an.spark.gateway.templates;

import fr.an.spark.gateway.dto.eventSummary.TemplateStringEntryDTO;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.val;

import java.util.LinkedHashMap;
import java.util.Map;

public class TemplateStringDictionary {

    @RequiredArgsConstructor
    @Getter
    public static class TemplateStringEntry {
        private final int templateId;
        private final String template;
        // TODO no templatization logic yet
        // List<TemplateStringParameterDescription> paramsDescriptions;

        private int usedCount;
        private int incrUsedCount() { return ++usedCount; }

        public TemplateStringEntryDTO toDTO() {
            return new TemplateStringEntryDTO(templateId, template);
        }
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

        public int toDTO() {
            // TODO no templatization logic yet
            return templateEntry.getTemplateId();
        }
    }


    private int nextTemplateId = 1;
    private final Map<Integer, TemplateStringEntry> entryById = new LinkedHashMap<>();
    private final Map<String, TemplateStringEntry> entryByTemplateKey = new LinkedHashMap<>();

    // -----------------------------------------------------------------------------------------------------------------

    public String getTemplateById(int id) {
        val entry = entryById.get(id);
        if (entry == null) {
            return null; // should not occur
        }
        return entry.getTemplate();
    }


    public TemplateStringEntry getOrAddTemplate(String template) {
        TemplateStringEntry entry = entryByTemplateKey.get(template);
        if (entry == null) {
            int templateId = nextTemplateId++;
            entry = new TemplateStringEntry(templateId, template);
            entryByTemplateKey.put(template, entry);
            entryById.put(templateId, entry);
        }
        return entry;
    }

    public TemplatedString templated(String text) {
        // TODO no templatization logic yet
        TemplateStringEntry templateEntry = getOrAddTemplate(text);
        int usedCountIndex = templateEntry.incrUsedCount();
        return new TemplatedString(text, templateEntry, usedCountIndex);
    }

    public void registerTemplateEntry(TemplateStringEntryDTO src) {
        int id = src.id;
        String text = src.text;
        TemplateStringEntry found = entryById.get(id);
        if (found == null) {
            val entry = new TemplateStringEntry(id, text);
            entryById.put(id, entry);
            entryByTemplateKey.put(text, entry);
        }
        this.nextTemplateId = Math.max(nextTemplateId, id+1);
    }

}
