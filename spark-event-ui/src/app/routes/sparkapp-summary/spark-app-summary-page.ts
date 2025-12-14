import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';

import {SparkApiService} from '../../services/SparkApiService';
import {SparkAppSummary} from '../../model/summary/SparkAppSummary';
import {SparkAppKey} from '../../model/SparkAppKey';
import {SparkAppSummaryComponent} from '../../features/sparkapp-summary/sparkapp-summary/spark-app-summary.component';


@Component({
  selector: 'app-spark-app-summary-page',
  imports: [
    CommonModule,
    SparkAppSummaryComponent,
  ],
  templateUrl: './spark-app-summary-page.html',
})
export class SparkAppSummaryPage {

  sparkAppKey!: SparkAppKey;

  sparkAppSummary: SparkAppSummary|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sparkAppKey = SparkAppKey.fromRouteParams(params);
      this.sparkAppSummary = undefined;
      if (this.sparkAppKey.isValid) {
        sparkApi.sparkAppSummary$(this.sparkAppKey).subscribe(res => {
          this.sparkAppSummary = res;
        });
      }
    });
  }

}
