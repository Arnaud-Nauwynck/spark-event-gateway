import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SparkEvent} from '../../model/sparkevents/SparkEvent';
import {SparkPlanInfo} from '../../model/sparkevents/SparkPlanInfo';
import SparkApiService from '../../services/SparkApiService';
import {SparkPlanInfoTreeComponent} from '../../features/sql/spark-plan/spark-plan-info-tree.component';
import {SparkPlanInfoTree} from '../../model/trackers/SparkPlanNode';

/**
 * SQL plan page component
 */
@Component({
  selector: 'app-spark-sql-plan-page',
  imports: [
    SparkPlanInfoTreeComponent
  ],
  templateUrl: './spark-sql-plan-page.html',
})
export class SparkSqlPlanPage {

  sqlId: number|undefined;

  sparkEvent: SparkEvent|undefined;
  // sparkPlan: SparkPlanInfo|undefined;
  sparkPlanTree: SparkPlanInfoTree|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sqlId = +params['sqlId'];
      this.sparkPlanTree = undefined;
      sparkApi.findLastSqlEventWithPlanInfoBySqlEventId(this.sqlId).subscribe(sparkEvent => {
        this.sparkEvent = sparkEvent;
        const sparkPlanInfo = sparkEvent?.getSparkPlanInfoOpt();
        this.sparkPlanTree = sparkPlanInfo ? new SparkPlanInfoTree(sparkPlanInfo) : undefined;
      });
    });
  }

}
