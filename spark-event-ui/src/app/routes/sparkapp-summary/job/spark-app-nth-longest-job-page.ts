import {Component} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

import {SparkAppKey} from '../../../model/SparkAppKey';
import {SparkAppSummary} from '../../../model/summary/SparkAppSummary';
import {SparkTopLevelJobExecEventSummary} from '../../../model/summary/SparkEventSummary';
import {SparkApiService} from '../../../services/SparkApiService';
import {SparkJobSummaryComponent} from '../../../features/sparkapp-summary/job/spark-job-summary.component';


@Component({
  selector: 'app-spark-app-nth-longest-job-page',
  imports: [
    CommonModule,
    RouterLink,
    SparkJobSummaryComponent,
  ],
  templateUrl: './spark-app-nth-longest-job-page.html',
})
export class SparkAppNthLongestTopLevelJobExecPage {

  sparkAppKey!: SparkAppKey;
  nth!: number;

  sparkAppSummary: SparkAppSummary|undefined;
  model: SparkTopLevelJobExecEventSummary|undefined;
  showPrevLink = false;
  showNextLink = false;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sparkAppKey = SparkAppKey.fromRouteParams(params);
      this.nth = +params['nth'];
      this.sparkAppSummary = undefined;
      if (this.sparkAppKey.isValid) {
        sparkApi.sparkAppSummary$(this.sparkAppKey).subscribe(res => {
          this.sparkAppSummary = res;
          const jobExecs =  res?.longestTopLevelJobExecs || [];
          this.model = (this.nth > 0 && this.nth <= jobExecs.length) ? jobExecs[this.nth - 1] : undefined;
          this.showPrevLink = this.nth > 1;
          this.showNextLink = this.nth + 1 <= jobExecs.length;
        });
      }
    });
  }

}
