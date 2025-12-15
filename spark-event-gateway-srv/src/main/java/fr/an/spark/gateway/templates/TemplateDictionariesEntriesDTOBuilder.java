package fr.an.spark.gateway.templates;

import fr.an.spark.gateway.dto.eventSummary.CallSiteTemplatedStringDTO;
import fr.an.spark.gateway.dto.eventSummary.TemplateDictionariesEntriesDTO;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TemplateDictionariesEntriesDTOBuilder {

    private final TemplateDictionariesRegistry dics;

    private final TemplateStringEntryDTOBuilder callSiteShortEntries = new TemplateStringEntryDTOBuilder();
    private final TemplateStringEntryDTOBuilder callSiteLongEntries = new TemplateStringEntryDTOBuilder();
    private final TemplateStringEntryDTOBuilder planDescriptionEntries = new TemplateStringEntryDTOBuilder();

    // -----------------------------------------------------------------------------------------------------------------

    public TemplateDictionariesEntriesDTO toTemplateDictionariesEntriesDTO() {
        return new TemplateDictionariesEntriesDTO(callSiteShortEntries.toDTOs(), callSiteLongEntries.toDTOs(), //
                planDescriptionEntries.toDTOs());
    }


    public void addEntriesForCallSite(CallSiteTemplatedStringDTO src) {
        callSiteShortEntries.addEntryFor(src.shortTemplateId, dics.getCallSiteShortDictionary());
        callSiteLongEntries.addEntryFor(src.longTemplateId, dics.getCallSiteLongDictionary());
    }

    public void addEntriesForPlan(int templatedId) {
        planDescriptionEntries.addEntryFor(templatedId, dics.getPlanDescriptionDictionary());
    }

}
