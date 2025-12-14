import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';

import {SparkAppSummary} from '../../../model/summary/SparkAppSummary';
import {SparkApiService} from '../../../services/SparkApiService';
import {SparkTopLevelJobExecEventSummary} from '../../../model/summary/SparkEventSummary';
import {SparkAppKey} from '../../../model/SparkAppKey';
import {SparkJobSummaryComponent} from '../../../features/sparkapp-summary/job/spark-job-summary.component';


@Component({
  selector: 'app-spark-job-summary-page',
  imports: [
    CommonModule,
    SparkJobSummaryComponent,
  ],
  templateUrl: './spark-job-summary-page.html',
})
export class SparkJobSummaryPage {

  sparkAppKey!: SparkAppKey;
  jobId: number|undefined;

  sparkAppSummary: SparkAppSummary|undefined;
  model: SparkTopLevelJobExecEventSummary|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sparkAppKey = SparkAppKey.fromRouteParams(params);
      this.jobId = +params['jobId'];
      this.sparkAppSummary = undefined;
      this.model = undefined;
      if (this.sparkAppKey.clusterName && this.sparkAppKey.sparkAppName) {
        sparkApi.sparkAppSummary$(this.sparkAppKey).subscribe(res => {
          this.sparkAppSummary = res;
          // console.log('Loaded SparkAppSummary:', this.sparkAppSummary);
          if (this.jobId && res) {
            this.model = res.topLevelExecSummaryById(this.jobId);
          }
        });
      }
    });
  }

}
