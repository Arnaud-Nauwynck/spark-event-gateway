package fr.an.spark.gateway.dto.eventSummary;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor @AllArgsConstructor
public class TemplateDictionariesEntriesDTO {

    public List<TemplateStringEntryDTO> callSiteShortEntries = new ArrayList<>();
    public List<TemplateStringEntryDTO> callSiteLongEntries = new ArrayList<>();
    public List<TemplateStringEntryDTO> planDescriptionEntries = new ArrayList<>();

}
