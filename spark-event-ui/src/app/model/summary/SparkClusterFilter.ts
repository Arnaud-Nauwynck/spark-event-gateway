import {SparkCluster} from './SparkCluster';

export class SparkClusterFilter {

  clusterName: string|undefined;

  accept(data: SparkCluster): boolean {
    if (this.clusterName && !data.clusterName.includes(this.clusterName)) {
      return false;
    }
    return true;
  }
}
