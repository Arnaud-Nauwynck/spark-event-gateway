import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SparkTopLevelJobExecEventSummary} from '../../../model/summary/SparkEventSummary';
import {RouterLink} from '@angular/router';
import {SparkAppKey} from '../../../model/SparkAppKey';
import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';
import {AppBreadcrumbComponent} from '../../../shared/app-breadcrumb.component';


@Component({
  selector: 'app-spark-job-summary',
  imports: [
    FormsModule, RouterLink, LabelCheckboxComponent, AppBreadcrumbComponent,
  ],
  templateUrl: './spark-job-summary.component.html',
})
export class SparkJobSummaryComponent {

  @Input()
  showBreadCrumb = true;

  @Input()
  showTitle = false;

  @Input()
  sparkAppKey!: SparkAppKey;

  @Input()
  model!: SparkTopLevelJobExecEventSummary; // |undefined

  protected showCallSiteLong = false;

}
