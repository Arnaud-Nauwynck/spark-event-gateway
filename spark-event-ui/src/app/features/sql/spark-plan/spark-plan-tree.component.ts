import {Component, model, signal} from '@angular/core';
import {CommonModule, JsonPipe} from '@angular/common';

import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';
import {SparkPlanNodeComponent} from './spark-plan-node.component';
import {SparkPlanTree} from '../../../model/sql/SparkPlanNodeTree';
import SparkPlanGraphDagreeComponent from './spark-plan-graph-dagree.component';
import {SparkPlanGraph} from '../../../model/sql/SparkPlanGraph';


/**
 *
 */
@Component({
  selector: 'app-spark-plan-info-tree',
  imports: [CommonModule, JsonPipe, LabelCheckboxComponent,
    SparkPlanNodeComponent, SparkPlanGraphDagreeComponent
  ],
  templateUrl: './spark-plan-tree.component.html',
  standalone: true
})
export class SparkPlanTreeComponent {

  showTitle = model(true);

  label = signal<string | undefined>(undefined);

  treeJson = model<string|undefined>();

  model = model.required<SparkPlanTree>();
  get tree(): SparkPlanTree { return this.model(); }

  _sparkPlanGraph : SparkPlanGraph | undefined;
  get sparkPlanGraph(): SparkPlanGraph {
    if (!this._sparkPlanGraph) {
      this._sparkPlanGraph = SparkPlanGraph.fromPlanInfo(this.tree.rootNode);
    }
    return this._sparkPlanGraph;
  }

  showSparkPlanTree = true;

  showJson = false;
  protected viewMode: 'tree' | 'graph' | 'json' = 'tree';

}
