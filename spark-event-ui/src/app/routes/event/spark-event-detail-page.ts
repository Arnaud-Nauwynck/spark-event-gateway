import {Component} from '@angular/core';
import {SparkEvent} from '../../model/sparkevents/SparkEvent';
import {ActivatedRoute, RouterLink} from '@angular/router';
import SparkApiService from '../../services/SparkApiService';
import {SparkEventDetailComponent} from '../../features/spark-events/SparkEventDetail.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-spark-event-detail-page',
  imports: [
    RouterLink, CommonModule,
    SparkEventDetailComponent
  ],
  templateUrl: './spark-event-detail-page.html',
})
export class SparkEventDetailPage {

  eventNum: number|undefined;

  sparkEvent: SparkEvent|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.eventNum = +params['eventNum'];
      sparkApi.eventById(this.eventNum).subscribe(sparkEvent => {
        this.sparkEvent = sparkEvent;
      });
    })
  }

}
