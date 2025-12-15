package fr.an.spark.gateway.templates;

import fr.an.spark.gateway.dto.eventSummary.TemplateStringEntryDTO;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class TemplateStringEntryDTOBuilder {

    private final Map<Integer, TemplateStringEntryDTO> resultEntries = new LinkedHashMap<>();

    public List<TemplateStringEntryDTO> toDTOs() {
        return new ArrayList<>(resultEntries.values());
    }

    public void addEntryFor(int id, TemplateStringDictionary dic) {
        resultEntries.computeIfAbsent(id, k -> new TemplateStringEntryDTO(k, dic.getTemplateById(k)));
    }

}
