import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';

import {SparkAppKey} from '../../../model/SparkAppKey';
import {RepeatedLongestSqlExecsPerCallSite, SparkAppSummary} from '../../../model/summary/SparkAppSummary';
import {SparkApiService} from '../../../services/SparkApiService';
import SparkSQLExecutionEventSummary from '../../../model/summary/SparkEventSummary';
import {SparkSqlSummaryTableComponent} from '../../../features/sparkapp-summary/sql/spark-sql-summary-table.component';


@Component({
  selector: 'app-spark-app-longest-sql-table-page',
  imports: [
    CommonModule,
    SparkSqlSummaryTableComponent,
  ],
  templateUrl: './spark-app-longest-sql-table-page.html',
})
export class SparkAppLongestSqlExecsTablePage {

  sparkAppKey!: SparkAppKey;

  sparkAppSummary: SparkAppSummary|undefined;
  longestSqlExecs: SparkSQLExecutionEventSummary[] = [];
  repeatedLongestSqlExecsPerCallSites: RepeatedLongestSqlExecsPerCallSite[] = [];

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sparkAppKey = SparkAppKey.fromRouteParams(params);
      this.sparkAppSummary = undefined;
      if (this.sparkAppKey.isValid) {
        sparkApi.sparkAppSummary$(this.sparkAppKey).subscribe(res => {
          this.sparkAppSummary = res;
          this.longestSqlExecs = res?.longestSqlExecs || [];
          this.repeatedLongestSqlExecsPerCallSites = res?.repeatedLongestSqlExecsPerCallSites || [];
        });
      }
    });
  }

}
