import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {SparkAppSummary} from '../../../model/summary/SparkAppSummary';
import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';
import {AppBreadcrumbComponent} from '../../../shared/app-breadcrumb.component';
import {TaskMetricsComponent} from '../../task/task-metrics.component';
import {SparkSqlSummaryTableComponent} from '../sql/spark-sql-summary-table.component';
import {SparkJobSummaryTableComponent} from '../job/spark-job-summary-table.component';
import {SparkAppConfigComponent} from './spark-app-config.component';
import {SparkAppMetricsEventLogCountersComponent} from './spark-app-metrics-event-log-counters.component';


@Component({
  selector: 'app-spark-app-summary',
  imports: [FormsModule,
    SparkAppConfigComponent, LabelCheckboxComponent,
    AppBreadcrumbComponent,
    SparkAppMetricsEventLogCountersComponent, TaskMetricsComponent,
    SparkSqlSummaryTableComponent, SparkJobSummaryTableComponent,
  ],
  templateUrl: './spark-app-summary.component.html',
  standalone: true
})
export class SparkAppSummaryComponent {

  @Input()
  model!: SparkAppSummary;

  protected showAppConfig = false;
  protected showEventLogCounts = false;
  protected showTotalTaskMetrics = false;

  protected showLongestSql = true;
  protected showLongestTopLevelJob = true;


}
