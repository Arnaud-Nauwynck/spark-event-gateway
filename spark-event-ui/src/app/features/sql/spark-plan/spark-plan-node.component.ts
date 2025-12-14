import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SparkPlanNode} from '../../../model/sql/SparkPlanNode';
import {SparkPlanTree} from '../../../model/sql/SparkPlanNodeTree';

/**
 *
 */
@Component({
  selector: 'app-spark-plan-node',
  imports: [CommonModule],
  templateUrl: './spark-plan-node.component.html',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparkPlanNodeComponent {

  @Input()
  node!: SparkPlanNode;

  get tree(): SparkPlanTree { return this.node.tree; }

  constructor(
    // private changeDetectorRef: ChangeDetectorRef
  ) {
  }

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

  protected nodeToggleExpand() {
    this.node.toggle();
    // this.changeDetectorRef.markForCheck();
  }

}
