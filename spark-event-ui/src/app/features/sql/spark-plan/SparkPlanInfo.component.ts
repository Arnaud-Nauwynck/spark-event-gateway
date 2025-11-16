import {Component, computed, Input, model, signal} from '@angular/core';
import {CommonModule, JsonPipe} from '@angular/common';
import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';

import {SparkPlanInfo} from '../../../model/sparkevents/SparkPlanInfo';
import {SparkPlanInfoNode, SparkPlanInfoTree} from '../../../model/spark-plan/SparkPlanInfoNode';


@Component({
  selector: 'app-spark-plan-node',
  imports: [CommonModule],
  templateUrl: './SparkPlanInfoNode.component.html',
})
export class SparkPlanInfoNodeComponent {
  @Input()
  node!: SparkPlanInfoNode;
  // node = model.required<SparkPlanInfoNode>();

  get tree(): SparkPlanInfoTree { return this.node.tree; }

  // Retourne true si ce noeud possède des enfants
  hasChildren(): boolean {
    return !!(this.node.children && this.node.children.length);
  }

  visibleChildren(): SparkPlanInfoNode[] {
    return this.node.children || [];
  }
}


@Component({
  selector: 'app-spark-plan-info',
  imports: [CommonModule, JsonPipe, LabelCheckboxComponent,
    SparkPlanInfoNodeComponent
  ],
  templateUrl: './SparkPlanInfo.component.html',
})
export class SparkPlanInfoComponent {

  // label et sparkPlan deviennent des signaux Angular 17
  label = signal<string | undefined>(undefined);

  sparkPlan = model.required<SparkPlanInfo>();

  showSparkPlanTree = true;

  showJson = false;


  // derived computed signal: construit dynamiquement le noeud racine à partir du sparkPlan actuel
  sparkPlanTree = computed<SparkPlanInfoTree>(() => {
    const sp = this.sparkPlan();
    return new SparkPlanInfoTree(sp);
  });

}
