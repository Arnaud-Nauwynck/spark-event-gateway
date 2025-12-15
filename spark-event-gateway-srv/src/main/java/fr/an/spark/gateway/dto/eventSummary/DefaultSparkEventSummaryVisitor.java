package fr.an.spark.gateway.dto.eventSummary;

import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.*;


public class DefaultSparkEventSummaryVisitor extends SparkEventSummaryVisitor {

    @Override
    public void onApplicationStart(SparkApplicationStartEventSummaryDTO event) {
    }

    @Override
    public void onApplicationEnd(SparkApplicationEndEventSummaryDTO event) {
    }

    @Override
    public void onLogStart(SparkLogStartEventSummaryDTO event) {
    }

    @Override
    public void onResourceProfileAdded(SparkResourceProfileAddedEventSummaryDTO event) {
    }

    @Override
    public void onEnvironmentUpdate(SparkEnvironmentUpdateEventSummaryDTO event) {
    }

    @Override
    public void onBlockManagerAdded(SparkBlockManagerAddedEventSummaryDTO event) {
    }

    @Override
    public void onBlockManagerRemoved(SparkBlockManagerRemovedEventSummaryDTO event) {
    }

    @Override
    public void onExecutorAdded(SparkExecutorAddedEventSummaryDTO event) {
    }

    @Override
    public void onExecutorRemoved(SparkExecutorRemovedEventSummaryDTO event) {
    }

    @Override
    public void onExecutorExcluded(SparkExecutorExcludedEventSummaryDTO event) {
    }

    @Override
    public void onExecutorExcludedForStage(SparkExecutorExcludedForStageEventSummaryDTO event) {
    }

    @Override
    public void onExecutorUnexcluded(SparkExecutorUnexcludedEventSummaryDTO event) {
    }

    @Override
    public void onNodeExcluded(SparkNodeExcludedEventSummaryDTO event) {
    }

    @Override
    public void onNodeExcludedForStage(SparkNodeExcludedForStageEventSummaryDTO event) {
    }

    @Override
    public void onNodeUnexcluded(SparkNodeUnexcludedEventSummaryDTO event) {
    }

    @Override
    public void onSQLExec(SparkSQLExecutionEventSummaryDTO event) {
    }

    @Override
    public void onTopLevelJobExec(SparkTopLevelJobExecEventSummaryDTO event) {
    }

    @Override
    public void onNewCallSiteShortTemplate(NewCallSiteShortTemplateEventSummaryDTO event) {
    }

    @Override
    public void onNewCallSiteLongTemplate(NewCallSiteLongTemplateEventSummaryDTO event) {
    }

    @Override
    public void onNewPlanDescription(NewPlanDescriptionTemplateEventSummaryDTO event) {
    }

}
