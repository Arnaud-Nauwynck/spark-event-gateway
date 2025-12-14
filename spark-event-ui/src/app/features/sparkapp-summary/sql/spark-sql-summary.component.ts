import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import SparkSQLExecutionEventSummary from '../../../model/summary/SparkEventSummary';
import {SparkSqlExecKey} from '../../../model/SparkSqlExecKey';
import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';
import {AppBreadcrumbComponent} from '../../../shared/app-breadcrumb.component';
import {SparkPlanTreeComponent} from '../../sql/spark-plan/spark-plan-tree.component';


@Component({
  selector: 'app-spark-sql-summary',
  imports: [
    FormsModule, RouterLink, LabelCheckboxComponent,
    SparkPlanTreeComponent, AppBreadcrumbComponent,
  ],
  templateUrl: './spark-sql-summary.component.html',
  standalone: true
})
export class SparkSqlSummaryComponent {

  @Input()
  showBreadCrumb = true;

  @Input()
  showTitle = false;

  @Input()
  sparkSqlKey!: SparkSqlExecKey;

  @Input()
  model!: SparkSQLExecutionEventSummary;

  protected showCallSiteLong = false;
  protected showPhysicalPlanDescription = false;
  protected showSparkPlan = false;

}
