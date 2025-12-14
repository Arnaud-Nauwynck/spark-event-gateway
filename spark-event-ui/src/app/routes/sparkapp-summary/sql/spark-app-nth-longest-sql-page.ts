import {Component} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

import {SparkAppKey} from '../../../model/SparkAppKey';
import {SparkAppSummary} from '../../../model/summary/SparkAppSummary';
import SparkSQLExecutionEventSummary from '../../../model/summary/SparkEventSummary';
import {SparkApiService} from '../../../services/SparkApiService';
import {SparkSqlExecKey} from '../../../model/SparkSqlExecKey';
import {SparkSqlSummaryComponent} from '../../../features/sparkapp-summary/sql/spark-sql-summary.component';


@Component({
  selector: 'app-spark-app-nth-longest-sql-page',
  imports: [
    CommonModule,
    SparkSqlSummaryComponent,
    RouterLink,
  ],
  templateUrl: './spark-app-nth-longest-sql-page.html',
})
export class SparkAppNthLongestSqlExecPage {

  sparkAppKey!: SparkAppKey;
  nth!: number;

  model: SparkSQLExecutionEventSummary|undefined;
  sparkSqlExecKey!: SparkSqlExecKey|undefined;
  sparkAppSummary: SparkAppSummary|undefined;
  showPrevLink = false;
  showNextLink = false;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sparkAppKey = SparkAppKey.fromRouteParams(params);
      this.nth = +params['nth'];
      this.sparkSqlExecKey = undefined;
      this.sparkAppSummary = undefined;
      if (this.sparkAppKey.isValid) {
        sparkApi.sparkAppSummary$(this.sparkAppKey).subscribe(res => {
          this.sparkAppSummary = res;
          const sqlExecs =  res?.longestSqlExecs || [];
          this.model = (this.nth > 0 && this.nth <= sqlExecs.length) ? sqlExecs[this.nth - 1] : undefined;
          this.sparkSqlExecKey = (this.model)? new SparkSqlExecKey(this.sparkAppKey, this.model.execId) : undefined;
          this.showPrevLink = this.nth > 1;
          this.showNextLink = this.nth + 1 <= sqlExecs.length;
        });
      }
    });
  }

}
