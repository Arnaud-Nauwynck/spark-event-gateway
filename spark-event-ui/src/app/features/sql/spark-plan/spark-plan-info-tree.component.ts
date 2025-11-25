import {Component, model, signal} from '@angular/core';
import {CommonModule, JsonPipe} from '@angular/common';

import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';
import {SparkPlanInfoTree} from '../../../model/trackers/SparkPlanNode';
import {SparkPlanNodeComponent} from './spark-plan-node.component';


/**
 *
 */
@Component({
  selector: 'app-spark-plan-info-tree',
  imports: [CommonModule, JsonPipe, LabelCheckboxComponent,
    SparkPlanNodeComponent
  ],
  templateUrl: './spark-plan-info-tree.component.html',
})
export class SparkPlanInfoTreeComponent {

  label = signal<string | undefined>(undefined);

  sparkPlanTree = model.required<SparkPlanInfoTree>();

  showSparkPlanTree = true;

  showJson = false;

}
