import {Component} from '@angular/core';
import {SparkEvent} from '../../model/sparkevents/SparkEvent';
import {ActivatedRoute, RouterLink} from '@angular/router';
import SparkApiService from '../../services/SparkApiService';
import {SparkEventDetailComponent} from './SparkEventDetail.component';

@Component({
  selector: 'app-spark-event-detail-page',
  imports: [
    RouterLink,
    SparkEventDetailComponent
  ],
  templateUrl: './SparkEventDetailPage.component.html',
})
export class SparkEventDetailPageComponent {

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
