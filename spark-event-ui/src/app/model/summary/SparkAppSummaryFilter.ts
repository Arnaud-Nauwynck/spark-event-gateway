import {SparkAppSummary} from './SparkAppSummary';

export class SparkAppSummaryFilter {

  clusterName: string|undefined;
  sparkAppName: string|undefined;

  accept(data: SparkAppSummary): boolean {
    if (this.clusterName && !data.clusterName.includes(this.clusterName)) {
      return false;
    }
    if (this.sparkAppName && !data.sparkAppName.includes(this.sparkAppName)) {
      return false;
    }
    return true;
  }
}
