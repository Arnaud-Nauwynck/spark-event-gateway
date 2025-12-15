package fr.an.spark.gateway.templates;

import fr.an.spark.gateway.dto.eventSummary.DefaultSparkEventSummaryVisitor;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.NewCallSiteLongTemplateEventSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.NewCallSiteShortTemplateEventSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.NewPlanDescriptionTemplateEventSummaryDTO;
import fr.an.spark.gateway.templates.TemplateStringDictionary.TemplatedString;
import lombok.Getter;

@Getter
public class TemplateDictionariesRegistry {

    private final TemplateStringDictionary callSiteShortDictionary = new TemplateStringDictionary();
    private final TemplateStringDictionary callSiteLongDictionary = new TemplateStringDictionary();
    private final TemplateStringDictionary planDescriptionDictionary = new TemplateStringDictionary();


    // -----------------------------------------------------------------------------------------------------------------

    public TemplatedString templatedFromCallSiteShortDic(String text) {
        return callSiteShortDictionary.templated(text);
    }

    public TemplatedString templatedFromCallSiteLongDic(String text) {
        return callSiteLongDictionary.templated(text);
    }

    public TemplatedString templatedFromPlanDescriptionDic(String text) {
        return planDescriptionDictionary.templated(text);
    }



    // -----------------------------------------------------------------------------------------------------------------

    public DefaultSparkEventSummaryVisitor createRegisterTemplateEventSummaryVisitor() {
        return new InnerReplayToTemplateDictionariesEventSummaryVisitor(this);
    }

    protected static class InnerReplayToTemplateDictionariesEventSummaryVisitor extends DefaultSparkEventSummaryVisitor {

        private final TemplateDictionariesRegistry delegate;

        public InnerReplayToTemplateDictionariesEventSummaryVisitor(TemplateDictionariesRegistry delegate) {
            this.delegate = delegate;
        }


        @Override
        public void onNewCallSiteShortTemplate(NewCallSiteShortTemplateEventSummaryDTO event) {
            delegate.callSiteShortDictionary.registerTemplateEntry(event.templateEntry);
        }

        @Override
        public void onNewCallSiteLongTemplate(NewCallSiteLongTemplateEventSummaryDTO event) {
            delegate.callSiteLongDictionary.registerTemplateEntry(event.templateEntry);
        }

        @Override
        public void onNewPlanDescription(NewPlanDescriptionTemplateEventSummaryDTO event) {
            delegate.planDescriptionDictionary.registerTemplateEntry(event.templateEntry);
        }
    }


}
