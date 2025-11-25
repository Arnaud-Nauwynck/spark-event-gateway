import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SparkPlanInfoTree} from '../../../model/trackers/SparkPlanNode';
import {SparkPlanNode} from '../../../model/trackers/sql/SparkPlanNode';

/**
 *
 */
@Component({
  selector: 'app-spark-plan-node',
  imports: [CommonModule],
  templateUrl: './spark-plan-node.component.html',
})
export class SparkPlanNodeComponent {

  @Input()
  node!: SparkPlanNode;

  get tree(): SparkPlanInfoTree { return this.node.tree; }

  hasChildren(): boolean {
    return !!(this.node.children && this.node.children.length);
  }

  visibleChildren(): SparkPlanNode[] {
    return this.node.children || [];
  }

  protected truncateText(text: string) {
    if (text && text.length <= 200) {
      return text;
    }
    return text.slice(0, 200) + '...';
  }
}
