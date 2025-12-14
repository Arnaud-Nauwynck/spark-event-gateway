import { SparkClusterDTO } from "../../rest";
import {SparkAppSummary} from './SparkAppSummary';

/**
 *
 */
export class SparkCluster {
  readonly clusterName: string;

  // TODO cached
  sparkAppSummaries: SparkAppSummary[]|undefined = undefined;

  constructor(clusterName: string) {
    this.clusterName = clusterName;
  }

  static fromDTOs(src: SparkClusterDTO[]): SparkCluster[] {
    return src.map(x => SparkCluster.fromDTO(x));
  }

  static fromDTO(src: SparkClusterDTO): SparkCluster {
    const clusterName = src.clusterName!;
    return new SparkCluster(clusterName);
  }

}
