package fr.an.spark.gateway.eventSummary;

import fr.an.spark.gateway.dto.eventSummary.CallSiteTemplatedStringDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.NewCallSiteLongTemplateEventSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.NewCallSiteShortTemplateEventSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.NewPlanDescriptionTemplateEventSummaryDTO;
import fr.an.spark.gateway.eventlog.model.SparkCallSite;
import fr.an.spark.gateway.templates.TemplateDictionariesRegistry;
import fr.an.spark.gateway.templates.TemplateStringDictionary.TemplatedString;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.val;

import java.util.function.Consumer;

@RequiredArgsConstructor
public class TemplateDictionariesToSummaryBuilder {

    private final Consumer<SparkEventSummaryDTO> delegate;

    private final TemplateDictionariesRegistry dictionariesRegistry;

    // -----------------------------------------------------------------------------------------------------------------

    @NoArgsConstructor @AllArgsConstructor
    public static class CallSiteTemplatedString {
        public TemplatedString shortForm;
        public TemplatedString longForm;

        public CallSiteTemplatedStringDTO toDTO() {
            return new CallSiteTemplatedStringDTO(
                shortForm != null ? shortForm.toDTO() : 0,
                longForm != null ? longForm.toDTO() : 0
            );
        }
    }

    public CallSiteTemplatedString templatedFromCallSiteDic(SparkCallSite callSite) {
        return templatedFromCallSiteDic(callSite.shortForm, callSite.longForm);
    }

    public CallSiteTemplatedString templatedFromCallSiteDic(String shortForm, String longForm) {
        val shortFormTemplated = templatedFromCallSiteShortDic(shortForm);
        val longFormTemplated = templatedFromCallSiteLongDic(longForm);
        return new CallSiteTemplatedString(shortFormTemplated, longFormTemplated);
    }

    public TemplatedString templatedFromCallSiteShortDic(String text) {
        if (text == null) {
            return null;
        }
        val res = dictionariesRegistry.templatedFromCallSiteShortDic(text);
        if (res.templateUsedCountIndex == 1) {
            delegate.accept(new NewCallSiteShortTemplateEventSummaryDTO(res.templateEntry.toDTO()));
        }
        return res;
    }

    public TemplatedString templatedFromCallSiteLongDic(String text) {
        if (text == null) {
            return null;
        }
        val res = dictionariesRegistry.templatedFromCallSiteLongDic(text);
        if (res.templateUsedCountIndex == 1) {
            delegate.accept(new NewCallSiteLongTemplateEventSummaryDTO(res.templateEntry.toDTO()));
        }
        return res;
    }

    public TemplatedString templatedFromPlanDescriptionDic(String text) {
        val res = dictionariesRegistry.templatedFromPlanDescriptionDic(text);
        if (res.templateUsedCountIndex == 1) {
            delegate.accept(new NewPlanDescriptionTemplateEventSummaryDTO(res.templateEntry.toDTO()));
        }
        return res;
    }

}
