import {Injectable} from '@angular/core';
import {SparkEventFilter} from '../model/SparkEventFilter';
import {SparkClusterFilter} from '../model/summary/SparkClusterFilter';
import {SparkAppSummaryFilter} from '../model/summary/SparkAppSummaryFilter';
import {SparkEventSummaryFilter} from '../model/summary/SparkEventSummaryFilter';

@Injectable()
export class SparkGlobalSettingsService {

  sparkClusterFilter = new SparkClusterFilter();

  sparkEventFilter: SparkEventFilter = new SparkEventFilter();
  sparkEventSummaryFilter: SparkEventSummaryFilter = new SparkEventSummaryFilter();

  sparkAppSummaryFilter = new SparkAppSummaryFilter();

  showPhysicalPlan = false;
  showCallSite = true;
  showStageInfo = true;

  showProperties = true;

  showJson = true;


  enableDebug = false;
  showCurrentPlanInfo = false;
  showJobsTimeline = false;
  showTasks = false;

}
