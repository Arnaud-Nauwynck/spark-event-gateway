
export class SparkAppKey {
  readonly clusterName: string;
  readonly sparkAppName: string;

  get baseRouteUrl(): string {
    return `/cluster/${this.clusterName}/spark-app/${this.sparkAppName}`
  }

  constructor(clusterName: string, sparkAppName: string) {
    this.clusterName = clusterName;
    this.sparkAppName = sparkAppName;
  }

  static fromRouteParams(params: any): SparkAppKey {
    return new SparkAppKey(params['clusterName'], params['sparkAppName']);
  }

  get displayText(): string {
    return '(' + this.clusterName + ') ' + this.sparkAppName;
  }

  get isValid(): boolean {
    return this.clusterName !== undefined && this.clusterName.length > 0 &&
      this.sparkAppName !== undefined && this.sparkAppName.length > 0;
  }

}
