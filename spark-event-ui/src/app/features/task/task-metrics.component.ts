import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TaskMetrics as TaskMetricsDTO} from '../../rest';


@Component({
  selector: 'app-task-metrics',
  imports: [FormsModule,
  ],
  templateUrl: './task-metrics.component.html',
  standalone: true
})
export class TaskMetricsComponent {

  @Input()
  model!: TaskMetricsDTO;

}
