import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SparkPlanTreeComponent} from '../../features/sql/spark-plan/spark-plan-tree.component';
import {SqlExecTracker} from '../../model/trackers/SqlExecTracker';
import {LabelCheckboxComponent} from '../../shared/label-checkbox/label-checkbox.component';
import {SparkGlobalSettingsService} from '../../services/SparkGlobalSettingsService';
import {JobsTimelineComponent} from '../../features/job/jobs-timeline.component';
import {SparkApiService} from '../../services/SparkApiService';
import {SparkSqlExecKey} from '../../model/SparkSqlExecKey';
import {SparkPlanTree} from '../../model/sql/SparkPlanNodeTree';
import {SparkPlanNode} from '../../model/sql/SparkPlanNode';

@Component({
  selector: 'app-spark-sql-page',
  imports: [
    SparkPlanTreeComponent,
    LabelCheckboxComponent,
    JobsTimelineComponent
  ],
  templateUrl: './spark-sql-page.html',
  standalone: true
})
export class SparkSqlPage {

  sparkSqlKey!: SparkSqlExecKey;

  upToEventNumOpt: number | undefined;

  sqlExec: SqlExecTracker | undefined;
  sparkPlanTree: SparkPlanTree | undefined;

  disablePerformSparkPlanNodeDuplicatesAnalysis = false;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService,
              protected globalSettings: SparkGlobalSettingsService) {
    activatedRoute.params.subscribe(params => {
      this.sparkSqlKey = SparkSqlExecKey.fromRouteParams(params);
      this.upToEventNumOpt = params['upToEventNum'] ? +params['upToEventNum'] : undefined;
      this.sqlExec = undefined;
      if (this.sparkSqlKey.isValid) {
        sparkApi.sparkAppSqlExecTracker$(this.sparkSqlKey, this.upToEventNumOpt).subscribe(sqlExec => {
          this.sqlExec = sqlExec;
          console.log('Loaded SqlExecTracker:', this.sqlExec);
          this.sparkPlanTree = sqlExec?.currPlanInfoTree;
        });
      }
    });
  }

  protected dump() {
    console.log('SQL Exec:', this.sqlExec);
  }


  protected performNodeDuplicatesAnalysis() {
    const planTree = this.sparkPlanTree;
    if (planTree) {
      this.disablePerformSparkPlanNodeDuplicatesAnalysis = true;
      planTree.performSparkPlanNodeDuplicatesAnalysis$(this.sparkApi, this.sparkSqlKey).subscribe({
        next: (res) => {
          // OK!
        }, error: (err) => {
          this.disablePerformSparkPlanNodeDuplicatesAnalysis = false;
          console.error('Error performing node duplicates analysis:', err);
        }
      });
    }
  }

  protected onClickReduceAllSameDuplicateNodes() {
    const planTree = this.sparkPlanTree
    const analysis = this.sparkPlanTree?.nodeDuplicatesWithinSqlExecAnalysis;
    if (planTree && analysis) {
      const sameDuplicatesEntries = analysis.sameDuplicatesEntries;
      if (sameDuplicatesEntries && sameDuplicatesEntries.length > 0) {
        for (let entry of sameDuplicatesEntries) {
          const nodePathIds = entry.nodePathIds!;
          for (let i = 1; i < nodePathIds.length; i++) { // skip first, keep it expanded
            const nodePathId = nodePathIds[i];
            const node = planTree.rootNode.findNodeByPathId(nodePathId);
            if (node) {
              node.expanded = false;
            }
          }
        }
      }
    }
  }

  protected onClickReduceAllSemanticDuplicateNodes() {
    const planTree = this.sparkPlanTree
    const analysis = this.sparkPlanTree?.nodeDuplicatesWithinSqlExecAnalysis;
    if (planTree && analysis) {
      const semanticDuplicatesEntries = analysis.semanticDuplicatesEntries;
      if (semanticDuplicatesEntries && semanticDuplicatesEntries.length > 0)
        for (let entry of semanticDuplicatesEntries) {
          const nodePathIds = entry.nodePathIds!;
          for (let i = 1; i < nodePathIds.length; i++) { // skip first, keep it expanded
            const nodePathId = nodePathIds[i];
            const node = planTree.rootNode.findNodeByPathId(nodePathId);
            if (node) {
              node.expanded = false;
            }
          }
        }
    }
  }

  protected onClickReduceAllInMemoryScanNodes() {
    if (this.sparkPlanTree) {
      this.recursiveReduceInMemoryScanNodes(this.sparkPlanTree.rootNode);
    }
  }

  recursiveReduceInMemoryScanNodes(node: SparkPlanNode) {
    if (node.nodeName === 'InMemoryTableScan') {
      node.expanded = false;
    }
    if (node.children) {
      for (let child of node.children) {
        this.recursiveReduceInMemoryScanNodes(child);
      }
    }
  }
}
