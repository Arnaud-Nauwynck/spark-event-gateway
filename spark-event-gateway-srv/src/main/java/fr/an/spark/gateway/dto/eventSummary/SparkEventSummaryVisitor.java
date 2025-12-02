package fr.an.spark.gateway.dto.eventSummary;

import fr.an.spark.gateway.dto.eventSummary.SparkEventSummary.*;

public abstract class SparkEventSummaryVisitor {

    public abstract void caseApplicationStart(SparkApplicationStartEventSummary event);

    public abstract void caseApplicationEnd(SparkApplicationEndEventSummary event);

    public abstract void caseLogStart(SparkLogStartEventSummary event);

    public abstract void caseResourceProfileAdded(SparkResourceProfileAddedEventSummary event);

    public abstract void caseEnvironmentUpdate(SparkEnvironmentUpdateEventSummary event);

    public abstract void caseBlockManagerAdded(SparkBlockManagerAddedEventSummary event);

    public abstract void caseBlockManagerRemoved(SparkBlockManagerRemovedEventSummary event);

    public abstract void caseJobExec(SparkJobExecEventSummary event);

    public abstract void caseExecutorAdded(SparkExecutorAddedEventSummary event);

    public abstract void caseExecutorRemoved(SparkExecutorRemovedEventSummary event);

    public abstract void caseExecutorExcluded(SparkExecutorExcludedEventSummary event);

    public abstract void caseExecutorExcludedForStage(SparkExecutorExcludedForStageEventSummary event);

    public abstract void caseExecutorUnexcluded(SparkExecutorUnexcludedEventSummary event);

    public abstract void caseNodeExcluded(SparkNodeExcludedEventSummary event);

    public abstract void caseNodeExcludedForStage(SparkNodeExcludedForStageEventSummary event);

    public abstract void caseNodeUnexcluded(SparkNodeUnexcludedEventSummary event);

    public abstract void caseSQLExec(SparkSQLExecutionEventSummary event);
}
