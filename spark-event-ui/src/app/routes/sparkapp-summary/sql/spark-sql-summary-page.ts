import {Component} from '@angular/core';
import {RouterLink,ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SparkApiService} from '../../../services/SparkApiService';
import SparkSQLExecutionEventSummary from '../../../model/summary/SparkEventSummary';
import {SparkSqlSummaryComponent} from '../../../features/sparkapp-summary/sql/spark-sql-summary.component';
import {SparkSqlExecKey} from '../../../model/SparkSqlExecKey';


@Component({
  selector: 'app-spark-sql-summary-page',
  imports: [
    CommonModule, RouterLink,
    SparkSqlSummaryComponent,

  ],
  templateUrl: './spark-sql-summary-page.html',
})
export class SparkSqlSummaryPage {

  sparkSqlKey!: SparkSqlExecKey;

  sqlExec: SparkSQLExecutionEventSummary|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService) {
    activatedRoute.params.subscribe(params => {
      this.sparkSqlKey = SparkSqlExecKey.fromRouteParams(params);
      this.sqlExec = undefined;
      if (this.sparkSqlKey.isValid) {
        sparkApi.sparkAppSqlSummary$(this.sparkSqlKey).subscribe(sqlExec => {
          this.sqlExec = sqlExec;
          // console.log('Loaded SparkSQLExecutionEventSummary:', this.sqlExec);
        });
      }
    });
  }

}
