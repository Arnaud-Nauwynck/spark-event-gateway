import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SparkEvent} from '../../model/sparkevents/SparkEvent';
import SparkApiService from '../../services/SparkApiService';
import {SparkPlanInfoTreeComponent} from '../../features/sql/spark-plan/spark-plan-info-tree.component';
import {SparkPlanInfoTree} from '../../model/trackers/SparkPlanNode';

/**
 *
 */
@Component({
  selector: 'app-spark-event-plan-page',
  imports: [
    SparkPlanInfoTreeComponent
  ],
  templateUrl: './spark-event-plan-page.html',
})
export class SparkEventPlanPage {

  eventNum: number|undefined;

  sparkEvent: SparkEvent|undefined;
  sparkPlanTree: SparkPlanInfoTree|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.eventNum = +params['eventNum'];
      this.sparkEvent = undefined;
      this.sparkPlanTree = undefined;
      sparkApi.eventById(this.eventNum).subscribe(sparkEvent => {
        this.sparkEvent = sparkEvent;
        const sparkPlan = sparkEvent?.getSparkPlanInfoOpt();
        this.sparkPlanTree = sparkPlan ? new SparkPlanInfoTree(sparkPlan) : undefined;
      });
    })
  }

}
