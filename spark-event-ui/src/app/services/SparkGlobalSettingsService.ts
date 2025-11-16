import {Injectable} from '@angular/core';
import {SparkEventFilter} from '../model/SparkEventFilter';

@Injectable()
export class SparkGlobalSettingsService {

  sparkEventFilter: SparkEventFilter = new SparkEventFilter();

  showPhysicalPlan = false;
  showCallSite = true;
  showStageInfo = true;

  showProperties = true;

  showJson = true;


  enableDebug = false;
}
