import {Component} from '@angular/core';
import {SparkEvent} from '../../../model/sparkevents/SparkEvent';
import {ActivatedRoute} from '@angular/router';
import {SparkPlanInfo} from '../../../model/sparkevents/SparkPlanInfo';
import SparkApiService from '../../../services/SparkApiService';
import {SparkPlanInfoComponent} from './SparkPlanInfo.component';

@Component({
  selector: 'app-spark-sql-plan-page',
  imports: [
    SparkPlanInfoComponent
  ],
  templateUrl: './SparkSqlPlanPage.component.html',
})
export class SparkSqlPlanPageComponent {

  sqlId: number|undefined;

  sparkEvent: SparkEvent|undefined;
  sparkPlan: SparkPlanInfo|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sqlId = +params['sqlId'];
      sparkApi.findLastSqlEventWithPlanInfoBySqlEventId(this.sqlId).subscribe(sparkEvent => {
        this.sparkEvent = sparkEvent;
        this.sparkPlan = sparkEvent?.getSparkPlanInfoOpt();
      });
    })
  }

}
