import {Component} from '@angular/core';
import {SparkEvent} from '../../../model/sparkevents/SparkEvent';
import {ActivatedRoute} from '@angular/router';
import {SparkPlanInfo} from '../../../model/sparkevents/SparkPlanInfo';
import SparkApiService from '../../../services/SparkApiService';
import {SparkPlanInfoComponent} from './SparkPlanInfo.component';

@Component({
  selector: 'app-spark-event-plan-page',
  imports: [
    SparkPlanInfoComponent
  ],
  templateUrl: './SparkEventPlanPage.component.html',
})
export class SparkEventPlanPageComponent {

  eventNum: number|undefined;

  sparkEvent: SparkEvent|undefined;
  sparkPlan: SparkPlanInfo|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.eventNum = +params['eventNum'];
      sparkApi.eventById(this.eventNum).subscribe(sparkEvent => {
        this.sparkEvent = sparkEvent;
        this.sparkPlan = sparkEvent?.getSparkPlanInfoOpt();
      });
    })
  }

}
