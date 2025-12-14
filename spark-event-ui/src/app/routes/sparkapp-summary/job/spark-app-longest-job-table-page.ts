import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

import {SparkAppKey} from '../../../model/SparkAppKey';
import {RepeatedLongestTopLevelExecsPerCallSite, SparkAppSummary} from '../../../model/summary/SparkAppSummary';
import {SparkApiService} from '../../../services/SparkApiService';
import {SparkTopLevelJobExecEventSummary} from '../../../model/summary/SparkEventSummary';
import {SparkJobSummaryTableComponent} from '../../../features/sparkapp-summary/job/spark-job-summary-table.component';


@Component({
  selector: 'app-spark-app-longest-job-table-page',
  imports: [
    CommonModule,
    SparkJobSummaryTableComponent,
    // SparkEventSummaryTableComponent,
  ],
  templateUrl: './spark-app-longest-job-table-page.html',
  standalone: true
})
export class SparkAppLongestTopLevelJobExecTablePage {

  sparkAppKey!: SparkAppKey;

  sparkAppSummary: SparkAppSummary|undefined;
  longestJobExecs: SparkTopLevelJobExecEventSummary[] = [];
  repeatedLongestTopLevelExecsPerCallSites: RepeatedLongestTopLevelExecsPerCallSite[] = [];

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sparkAppKey = SparkAppKey.fromRouteParams(params);
      this.sparkAppSummary = undefined;
      if (this.sparkAppKey.isValid) {
        sparkApi.sparkAppSummary$(this.sparkAppKey).subscribe(res => {
          this.sparkAppSummary = res;
          this.longestJobExecs = res?.longestTopLevelJobExecs || [];
          this.repeatedLongestTopLevelExecsPerCallSites = res?.repeatedLongestTopLevelExecsPerCallSites || [];
        });
      }
    });
  }

}
