import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {SparkAppMetricsDTO} from '../../../rest';
import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';


@Component({
  selector: 'app-spark-app-metrics-event-log-counters',
  imports: [FormsModule, LabelCheckboxComponent,
  ],
  templateUrl: './spark-app-metrics-event-log-counters.component.html',
  standalone: true
})
export class SparkAppMetricsEventLogCountersComponent {

  @Input()
  model!: SparkAppMetricsDTO;

  showEnvEvents = true;
  showExecutorEvents = true;
  showSqlEvents = true;
  showJobEvents = true;
  showStageEvents = true;
  showTaskEvents = true;
  showRddEvents = true;

}
