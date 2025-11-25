import {
  SparkEvent,
  SparkListenerApplicationEnd,
  SparkListenerApplicationStart,
  SparkListenerBlockManagerAdded, SparkListenerBlockManagerRemoved, SparkListenerBlockUpdated,
  SparkListenerDriverAccumUpdates,
  SparkListenerEnvironmentUpdate, SparkListenerExecutorAdded,
  SparkListenerExecutorBlacklisted,
  SparkListenerExecutorBlacklistedForStage, SparkListenerExecutorExcluded,
  SparkListenerExecutorExcludedForStage,
  SparkListenerExecutorMetricsUpdate, SparkListenerExecutorRemoved, SparkListenerExecutorUnblacklisted,
  SparkListenerExecutorUnexcluded,
  SparkListenerJobEnd,
  SparkListenerJobStart, SparkListenerLogStart,
  SparkListenerNodeBlacklisted, SparkListenerNodeBlacklistedForStage,
  SparkListenerNodeExcluded, SparkListenerNodeExcludedForStage, SparkListenerNodeUnblacklisted,
  SparkListenerNodeUnexcluded, SparkListenerResourceProfileAdded,
  SparkListenerSpeculativeTaskSubmitted, SparkListenerSQLAdaptiveExecutionUpdate,
  SparkListenerSQLAdaptiveSQLMetricUpdates, SparkListenerSQLExecutionEnd, SparkListenerSQLExecutionStart,
  SparkListenerStageCompleted, SparkListenerStageExecutorMetrics,
  SparkListenerStageSubmitted, SparkListenerTaskEnd,
  SparkListenerTaskGettingResult,
  SparkListenerTaskStart, SparkListenerUnpersistRDD, SparkListenerUnschedulableTaskSetAdded,
  SparkListenerUnschedulableTaskSetRemoved
} from "./SparkEvent";

/**
 * Visitor "switch-case" design pattern for SparkEvent class hierarchy
 */
export abstract class SparkEventVisitor {

  caseStageSubmitted(event: SparkListenerStageSubmitted) {}
  caseStageCompleted(event: SparkListenerStageCompleted) {}
  caseTaskStart(event: SparkListenerTaskStart) {}
  caseTaskGettingResult(event: SparkListenerTaskGettingResult) {}
  caseSpeculativeTaskSubmitted(event: SparkListenerSpeculativeTaskSubmitted) {}
  caseTaskEnd(event: SparkListenerTaskEnd) {}
  caseJobStart(event: SparkListenerJobStart) {}
  caseJobEnd(event: SparkListenerJobEnd) {}
  caseEnvironmentUpdate(event: SparkListenerEnvironmentUpdate) {}
  caseBlockManagerAdded(event: SparkListenerBlockManagerAdded) {}
  caseBlockManagerRemoved(event: SparkListenerBlockManagerRemoved) {}
  caseUnpersistRDD(event: SparkListenerUnpersistRDD) {}
  caseExecutorAdded(event: SparkListenerExecutorAdded) {}
  caseExecutorRemoved(event: SparkListenerExecutorRemoved) {}
  caseExecutorBlacklisted(event: SparkListenerExecutorBlacklisted) {}
  caseExecutorExcluded(event: SparkListenerExecutorExcluded) {}
  caseExecutorBlacklistedForStage(event: SparkListenerExecutorBlacklistedForStage) {}
  caseExecutorExcludedForStage(event: SparkListenerExecutorExcludedForStage) {}
  caseNodeBlacklistedForStage(event: SparkListenerNodeBlacklistedForStage) {}
  caseNodeExcludedForStage(event: SparkListenerNodeExcludedForStage) {}
  caseExecutorUnblacklisted(event: SparkListenerExecutorUnblacklisted) {}
  caseExecutorUnexcluded(event: SparkListenerExecutorUnexcluded) {}
  caseNodeBlacklisted(event: SparkListenerNodeBlacklisted) {}
  caseNodeExcluded(event: SparkListenerNodeExcluded) {}
  caseNodeUnblacklisted(event: SparkListenerNodeUnblacklisted) {}
  caseNodeUnexcluded(event: SparkListenerNodeUnexcluded) {}
  caseUnschedulableTaskSetAdded(event: SparkListenerUnschedulableTaskSetAdded) {}
  caseUnschedulableTaskSetRemoved(event: SparkListenerUnschedulableTaskSetRemoved) {}
  caseBlockUpdated(event: SparkListenerBlockUpdated) {}
  caseExecutorMetricsUpdate(event: SparkListenerExecutorMetricsUpdate) {}
  caseStageExecutorMetrics(event: SparkListenerStageExecutorMetrics) {}
  caseApplicationStart(event: SparkListenerApplicationStart) {}
  caseApplicationEnd(event: SparkListenerApplicationEnd) {}
  caseLogStart(event: SparkListenerLogStart) {}
  caseResourceProfileAdded(event: SparkListenerResourceProfileAdded) {}

  // SQL
  //---------------------------------------------------------------------------------------------
  caseSQLAdaptiveExecutionUpdate(event: SparkListenerSQLAdaptiveExecutionUpdate) {}
  caseSQLAdaptiveSQLMetricUpdates(event: SparkListenerSQLAdaptiveSQLMetricUpdates) {}
  caseSQLExecutionStart(event: SparkListenerSQLExecutionStart) {}
  caseSQLExecutionEnd(event: SparkListenerSQLExecutionEnd) {}
  caseSQLDriverAccumUpdates(event: SparkListenerDriverAccumUpdates) {}

  caseOther(event: SparkEvent) {}

}
