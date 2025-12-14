import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';
import {SparkEventSummary, SparkTopLevelJobExecEventSummary} from '../../../model/summary/SparkEventSummary';


@Component({
  selector: 'app-spark-event-summary',
  imports: [
    FormsModule, LabelCheckboxComponent, //
  ],
  templateUrl: './spark-event-summary.component.html',
})
export class SparkEventSummaryComponent {

  @Input()
  model!: SparkEventSummary;

  protected onClickDump() {
    console.log('SparkEventSummary:', this.model);
  }


  protected showCallSiteLong = false;
  protected readonly SparkTopLevelJobExecEventSummary = SparkTopLevelJobExecEventSummary;
}
