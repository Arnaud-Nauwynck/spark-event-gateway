package fr.an.spark.gateway.dto.eventSummary;

import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.*;

public abstract class SparkEventSummaryVisitor {

    public abstract void onApplicationStart(SparkApplicationStartEventSummaryDTO event);
    public abstract void onApplicationEnd(SparkApplicationEndEventSummaryDTO event);
    public abstract void onLogStart(SparkLogStartEventSummaryDTO event);
    public abstract void onResourceProfileAdded(SparkResourceProfileAddedEventSummaryDTO event);

    public abstract void onEnvironmentUpdate(SparkEnvironmentUpdateEventSummaryDTO event);
    public abstract void onBlockManagerAdded(SparkBlockManagerAddedEventSummaryDTO event);
    public abstract void onBlockManagerRemoved(SparkBlockManagerRemovedEventSummaryDTO event);
    public abstract void onExecutorAdded(SparkExecutorAddedEventSummaryDTO event);
    public abstract void onExecutorRemoved(SparkExecutorRemovedEventSummaryDTO event);
    public abstract void onExecutorExcluded(SparkExecutorExcludedEventSummaryDTO event);
    public abstract void onExecutorExcludedForStage(SparkExecutorExcludedForStageEventSummaryDTO event);
    public abstract void onExecutorUnexcluded(SparkExecutorUnexcludedEventSummaryDTO event);

    public abstract void onNodeExcluded(SparkNodeExcludedEventSummaryDTO event);
    public abstract void onNodeExcludedForStage(SparkNodeExcludedForStageEventSummaryDTO event);
    public abstract void onNodeUnexcluded(SparkNodeUnexcludedEventSummaryDTO event);

    public abstract void onSQLExec(SparkSQLExecutionEventSummaryDTO event);

    public abstract void onTopLevelJobExec(SparkTopLevelJobExecEventSummaryDTO event);

    public abstract void onNewCallSiteShortTemplate(NewCallSiteShortTemplateEventSummaryDTO event);
    public abstract void onNewCallSiteLongTemplate(NewCallSiteLongTemplateEventSummaryDTO event);
    public abstract void onNewPlanDescription(NewPlanDescriptionTemplateEventSummaryDTO event);

}