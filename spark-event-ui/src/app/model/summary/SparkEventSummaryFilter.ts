import {SparkEventSummary} from './SparkEventSummary';
import {CallSiteTemplated} from '../templates/TemplateDictionariesRegistry';


export class SparkEventSummaryFilter {

  acceptPseudoEvents = false;
  acceptAppLifecycleEvents = true;
  acceptExecutorEvents = true;
  acceptSqlExecs = true;
  acceptTopLevelJobExecs = true;
  minDurationMs = 0;
  maxDurationMs = -1;
  callSiteShortMessageContains: string|undefined;
  callSiteShortMessageNotContains: string|undefined;
  callSiteLongMessageContains: string|undefined;
  callSiteLongMessageNotContains: string|undefined;


  accept(data: SparkEventSummary): boolean {
    const type = data.getType();
    let filterDuration = false;
    let duration:number = 0;
    let callSite: CallSiteTemplated|undefined = undefined;
    switch (type) {
      case 'ApplicationStart':
      case 'ApplicationEnd':
      case 'LogStart':
      case 'ResourceProfileAdded':
      case 'EnvUpdate':
        if (!this.acceptAppLifecycleEvents) {
          return false;
        }
        break;
      case 'BlockManagerAdded':
      case 'BlockManagerRemoved':
      case 'ExecutorAdded':
      case 'ExecutorRemoved':
      case 'ExecutorExcluded':
      case 'ExecutorExcludedForStage':
      case 'ExecutorUnexcluded':
      case 'NodeExcluded':
      case 'NodeExcludedForStage':
      case 'NodeUnexcluded':
        if (!this.acceptExecutorEvents) {
          return false;
        }
        break;
      case 'SQLExec': {
        const sqlExec = data.asSqlExecEvent()!;
        if (!this.acceptSqlExecs) {
          return false;
        }
        filterDuration= true;
        duration = sqlExec.duration;
        callSite = sqlExec.callSite;
      } break;
      case 'TopLevelJobExec': {
        const jobExec = data.asTopLevelJobExecEvent()!;
        if (!this.acceptTopLevelJobExecs) {
          return false;
        }
        filterDuration= true;
        duration = jobExec.duration;
        callSite = jobExec.callSite;
      } break;

      case 'NewCallSiteShortTemplate':
      case 'NewCallSiteLongTemplate':
      case 'NewPlanDescriptionTemplate':
        if (!this.acceptPseudoEvents) {
          return false;
        }
        break;
    }

    if (filterDuration) {
      if (duration < this.minDurationMs || (this.maxDurationMs !== -1 && this.maxDurationMs < duration)) {
        return false;
      }
    }
    if (callSite) {
      const shortMsg = callSite.shortMessage;
      const longMsg = callSite.longMessage;
      if (this.callSiteShortMessageContains && !shortMsg.includes(this.callSiteShortMessageContains)) {
        return false;
      }
      if (this.callSiteShortMessageNotContains && shortMsg.includes(this.callSiteShortMessageNotContains)) {
        return false;
      }
      if (this.callSiteLongMessageContains && !longMsg.includes(this.callSiteLongMessageContains)) {
        return false;
      }
      if (this.callSiteLongMessageNotContains && longMsg.includes(this.callSiteLongMessageNotContains)) {
        return false;
      }
    }

    return true;
  }
}

