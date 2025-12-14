import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SparkEvent} from '../../model/sparkevents/SparkEvent';
import {SparkPlanTreeComponent} from '../../features/sql/spark-plan/spark-plan-tree.component';
import {SparkApiService} from '../../services/SparkApiService';
import {SparkAppKey} from '../../model/SparkAppKey';
import {SparkPlanTree} from '../../model/sql/SparkPlanNodeTree';
import {DefaultSparkPlanInfoModelAdapter} from '../../model/sql/SparkPlanNodeBuilder';

/**
 *
 */
// TODO DEPRECATED
@Component({
  selector: 'app-spark-sql-byeventnum-plan-page',
  imports: [
    SparkPlanTreeComponent
  ],
  templateUrl: './spark-sql-byeventnum-plan-page.html',
  standalone: true
})
export class SparkSqlByEventNumPlanPage {

  sparkAppKey!: SparkAppKey;

  eventNum: number|undefined;

  sparkEvent: SparkEvent|undefined;
  sparkPlanTree: SparkPlanTree|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sparkAppKey = SparkAppKey.fromRouteParams(params);
      this.eventNum = +params['eventNum'];
      this.sparkEvent = undefined;
      this.sparkPlanTree = undefined;
      sparkApi.eventById(this.eventNum).subscribe(sparkEvent => {
        this.sparkEvent = sparkEvent;
        const sparkPlan = sparkEvent?.getSparkPlanInfoOpt();
        const modelAdapter = new DefaultSparkPlanInfoModelAdapter();
        this.sparkPlanTree = sparkPlan ? new SparkPlanTree(sparkPlan, modelAdapter, undefined) : undefined;
      });
    })
  }

}
