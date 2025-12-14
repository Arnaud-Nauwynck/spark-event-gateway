import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SparkApiService} from '../../services/SparkApiService';
import {SparkCluster} from '../../model/summary/SparkCluster';
import {SparkGlobalSettingsService} from '../../services/SparkGlobalSettingsService';
import {SparkAppSummaryTableComponent} from '../../features/sparkapp-summary/sparkapp-summary/spark-app-summary-table.component';


@Component({
  selector: 'app-spark-cluster-page',
  imports: [
    SparkAppSummaryTableComponent
  ],
  templateUrl: './spark-cluster-page.html',
})
export class SparkClusterPage {

  clusterName: string|undefined;

  sparkCluster: SparkCluster | undefined;

  get sparkAppSummaryFilter() { return this.globalSettings.sparkAppSummaryFilter; }

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService,
              private globalSettings: SparkGlobalSettingsService) {
    activatedRoute.params.subscribe(params => {
      this.clusterName = params['clusterName'];
      this.sparkCluster = undefined;
      if (this.clusterName) {
        sparkApi.sparkClusterByName$(this.clusterName).subscribe(res => {
          this.sparkCluster = res;
          if (res) {
            if (! res.sparkAppSummaries) {
              sparkApi.clusterSparkAppSummaries$(this.clusterName!).subscribe(appSummaries => {
                res.sparkAppSummaries = appSummaries;
              });
            }
          }
        });
      }
    });
  }

}
