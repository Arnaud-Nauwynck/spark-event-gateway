import {Component, model} from '@angular/core';
import {SparkPlanInfo} from '../../../model/sparkevents/SparkPlanInfo';
import {CommonModule, JsonPipe} from '@angular/common';
import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';

@Component({
  selector: 'app-spark-plan-info',
  imports: [CommonModule, JsonPipe, LabelCheckboxComponent],
  templateUrl: './SparkPlanInfo.component.html',
})
export class SparkPlanInfoComponent {

  label = model<string|undefined>();

  sparkPlan = model.required<SparkPlanInfo>();
  protected showJson = true;

}
