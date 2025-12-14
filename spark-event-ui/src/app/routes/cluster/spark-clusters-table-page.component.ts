import {Component} from '@angular/core';

import {SparkApiService} from '../../services/SparkApiService';
import {SparkCluster} from '../../model/summary/SparkCluster';
import {SparkClusterFilter} from '../../model/summary/SparkClusterFilter';
import {SparkGlobalSettingsService} from '../../services/SparkGlobalSettingsService';
import {SparkClustersTableComponent} from '../../features/cluster/spark-clusters-table.component';


@Component({
  selector: 'app-spark-clusters-table-page',
  imports: [
    SparkClustersTableComponent
  ],
  templateUrl: './spark-clusters-table-page.html',
})
export class SparkClustersTablePage {

  sparkClusters: SparkCluster[] = [];

  get sparkClusterFilter(): SparkClusterFilter { return this.globalSettings.sparkClusterFilter; }

  constructor(private sparkApi: SparkApiService,
              private globalSettings: SparkGlobalSettingsService) {
    sparkApi.sparkClusters$().subscribe(res => {
      this.sparkClusters = res;
      console.log("sparkClusters", this.sparkClusters);
    });
  }

}
