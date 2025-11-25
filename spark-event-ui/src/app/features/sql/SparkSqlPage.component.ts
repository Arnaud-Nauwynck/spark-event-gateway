import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SparkEvent} from '../../model/sparkevents/SparkEvent';
import {SparkPlanInfo} from '../../model/sparkevents/SparkPlanInfo';
import SparkApiService from '../../services/SparkApiService';
import {SparkPlanInfoTreeComponent} from './spark-plan/spark-plan-info-tree.component';
import {SqlExecTracker} from '../../model/trackers/SqlExecTracker';
import {LabelCheckboxComponent} from '../../shared/label-checkbox/label-checkbox.component';
import {SparkGlobalSettingsService} from '../../services/SparkGlobalSettingsService';
import {SparkPlanInfoTree} from '../../model/trackers/SparkPlanNode';
import {JobsTimelineComponent} from '../job/jobs-timeline.component';

@Component({
  selector: 'app-spark-sql-page',
  imports: [
    SparkPlanInfoTreeComponent,
    LabelCheckboxComponent,
    JobsTimelineComponent
  ],
  templateUrl: './SparkSqlPage.component.html',
})
export class SparkSqlPageComponent {

  sqlId: number|undefined;
  upToEventNumOpt: number|undefined;

  sqlExec: SqlExecTracker|undefined;
  sparkPlanTree: SparkPlanInfoTree|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService,
              protected globalSettings: SparkGlobalSettingsService) {
    activatedRoute.params.subscribe(params => {
      this.sqlId = +params['sqlId'];
      this.upToEventNumOpt = params['upToEventNum'] ? +params['upToEventNum'] : undefined;
      sparkApi.sqlExecTracker(this.sqlId, this.upToEventNumOpt).subscribe(sqlExec => {
        this.sqlExec = sqlExec;
        this.sparkPlanTree = sqlExec?.currPlanInfoTree;
      });
    });
  }

  protected dump() {
    console.log('SQL Exec:', this.sqlExec);
  }
}
