import {SparkAppKey} from './SparkAppKey';

/**
 *
 */
export class SparkSqlExecKey {
  readonly sparkAppKey: SparkAppKey;
  readonly execId: number;

  get clusterName(): string { return this.sparkAppKey.clusterName; }
  get sparkAppName(): string { return this.sparkAppKey.sparkAppName; }

  constructor(sparkAppKey: SparkAppKey, execId: number) {
    this.sparkAppKey = sparkAppKey;
    this.execId = execId;
  }

  static fromRouteParams(params: any): SparkSqlExecKey {
    const sparkAppKey = new SparkAppKey(params['clusterName'], params['sparkAppName']);
    const execId = +params['execId'];
    return new SparkSqlExecKey(sparkAppKey, execId);
  }

  get baseRouteUrl(): string {
    return this.sparkAppKey.baseRouteUrl + `/sql/${this.execId}`
  }


  get displayText(): string {
    return this.sparkAppKey.displayText + ' Sql #' + this.execId;
  }

  get isValid(): boolean {
    return this.sparkAppKey.isValid && this.execId !== undefined && this.execId >= 0;
  }

}
