package fr.an.spark.gateway.eventSummary;

import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO;
import fr.an.spark.gateway.dto.eventSummary.SparkEventSummaryDTO.*;
import fr.an.spark.gateway.dto.eventSummary.TopEventSummariesRetainPolicy;
import fr.an.spark.gateway.eventTrackers.SparkEventTrackerCallback;
import fr.an.spark.gateway.eventTrackers.ExecutorTracker;
import fr.an.spark.gateway.eventTrackers.JobTracker;
import fr.an.spark.gateway.eventTrackers.SqlExecTracker;
import fr.an.spark.gateway.eventlog.model.SparkEvent.*;
import fr.an.spark.gateway.templates.TemplateDictionariesRegistry;

import java.util.Objects;
import java.util.function.Consumer;

/**
 *
 */
public class SummaryBuilderSparkEventTrackerCallback extends SparkEventTrackerCallback {

    private final Consumer<SparkEventSummaryDTO> delegate;

    // private final TemplateDictionariesRegistry templateDictionariesRegistry;
    private final TemplateDictionariesToSummaryBuilder templateDictionariesBuilder;

    private final TopEventSummariesRetainPolicy topEventSummariesRetainPolicy;

    // -----------------------------------------------------------------------------------------------------------------

    public SummaryBuilderSparkEventTrackerCallback(
            TemplateDictionariesRegistry dictionariesRegistry,
            Consumer<SparkEventSummaryDTO> summaryConsumer,
            TopEventSummariesRetainPolicy topEventSummariesRetainPolicy
    ) {
        this.delegate = Objects.requireNonNull(summaryConsumer);
        // this.templateDictionariesRegistry = Objects.requireNonNull(dictionariesRegistry);
        this.templateDictionariesBuilder = new TemplateDictionariesToSummaryBuilder(summaryConsumer, dictionariesRegistry);
        this.topEventSummariesRetainPolicy = topEventSummariesRetainPolicy;
    }

    // -----------------------------------------------------------------------------------------------------------------

    @Override
    public void onApplicationStart(SparkListenerApplicationStart event) {
        delegate.accept(new SparkApplicationStartEventSummaryDTO(event));
    }

    @Override
    public void onApplicationEnd(SparkListenerApplicationEnd event) {
        delegate.accept(new SparkApplicationEndEventSummaryDTO(event));
    }

    @Override
    public void onLogStart(SparkListenerLogStart event) {
        delegate.accept(new SparkLogStartEventSummaryDTO(event));
    }

    @Override
    public void onResourceProfileAdded(SparkListenerResourceProfileAdded event) {
        delegate.accept(new SparkResourceProfileAddedEventSummaryDTO(event));
    }

    @Override
    public void onEnvironmentUpdate(SparkListenerEnvironmentUpdate event) {
        delegate.accept(new SparkEnvironmentUpdateEventSummaryDTO(event));
    }

    @Override
    public void onBlockManagerAdded(SparkListenerBlockManagerAdded event, ExecutorTracker exec) {
        delegate.accept(new SparkBlockManagerAddedEventSummaryDTO(event));
    }

    @Override
    public void onBlockManagerRemoved(SparkListenerBlockManagerRemoved event) {
        delegate.accept(new SparkBlockManagerRemovedEventSummaryDTO(event));
    }

    @Override
    public void onExecutorAdded(SparkListenerExecutorAdded event, ExecutorTracker exec) {
        delegate.accept(new SparkExecutorAddedEventSummaryDTO(event));
    }

    @Override
    public void onExecutorRemoved(SparkListenerExecutorRemoved event, ExecutorTracker exec) {
        delegate.accept(new SparkExecutorRemovedEventSummaryDTO(event));
    }

    @Override
    public void onExecutorExcluded(SparkListenerExecutorExcluded event, ExecutorTracker exec) {
        delegate.accept(new SparkExecutorExcludedEventSummaryDTO(event));
    }

    @Override
    public void onExecutorExcludedForStage(SparkListenerExecutorExcludedForStage event, ExecutorTracker exec) {
        delegate.accept(new SparkExecutorExcludedForStageEventSummaryDTO(event));
    }

    @Override
    public void onExecutorUnexcluded(SparkListenerExecutorUnexcluded event, ExecutorTracker exec) {
        delegate.accept(new SparkExecutorUnexcludedEventSummaryDTO(event));
    }

    @Override
    public void onNodeExcluded(SparkListenerNodeExcluded event) {
        delegate.accept(new SparkNodeExcludedEventSummaryDTO(event));
    }

    @Override
    public void onNodeExcludedForStage(SparkListenerNodeExcludedForStage event) {
        delegate.accept(new SparkNodeExcludedForStageEventSummaryDTO(event));
    }

    @Override
    public void onNodeUnexcluded(SparkListenerNodeUnexcluded event) {
        delegate.accept(new SparkNodeUnexcludedEventSummaryDTO(event));
    }

    @Override
    public void onTopLevelJobExecStart(SparkListenerJobStart event, JobTracker job) {
        // ignore... only care about end event for summary
    }

    @Override
    public void onTopLevelJobExecEnd(SparkListenerJobEnd event, JobTracker job) {
        if (topEventSummariesRetainPolicy.shouldRetainTopLevelJobExecEventSummary(job)) {
            delegate.accept(new SparkTopLevelJobExecEventSummaryDTO(event, job, templateDictionariesBuilder));
            return;
        }
        delegate.accept(new SparkTopLevelJobExecEventSummaryDTO(event, job, templateDictionariesBuilder));
    }

    @Override
    public void onSQLExecStart(SparkListenerSQLExecutionStart event, SqlExecTracker sqlExec) {
        // ignore... only care about end event for summary
    }

    @Override
    public void onSQLExecEnd(SparkListenerSQLExecutionEnd event, SqlExecTracker sqlExec) {
        if (topEventSummariesRetainPolicy.shouldRetainSQLExecutionEventSummary(sqlExec)) {
            delegate.accept(new SparkSQLExecutionEventSummaryDTO(event, sqlExec, templateDictionariesBuilder));
        }
    }

}
