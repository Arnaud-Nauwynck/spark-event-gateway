
export class Metrics {

  name: string;
  accumulatorId: number;
  metricType: string;

  constructor(name: string, accumulatorId: number, metricType: string) {
    this.name = name;
    this.accumulatorId = accumulatorId;
    this.metricType = metricType;
  }

  static fromJson(src: any): Metrics {
    let name = <string> src['name'];
    let accumulatorId = <number> src['accumulatorId'];
    let metricType = <string> src['metricType'];
    return new Metrics(name, accumulatorId, metricType);
  }
  static fromJsonArray(src: any[]): Metrics[] {
      return src.map(x => Metrics.fromJson(x));
  }
}


export interface MetadataKeyValue {
  k: string;
  v: any; // TOCHECK String ??
}

export interface KeyValueEntry {
  k: string;
  v: string;
}

export function objToKeyValueEntries(obj: KeyValueObject): KeyValueEntry[] {
  let entries: KeyValueEntry[] = [];
  for (let key of Object.keys(obj)) {
    let value = obj[key];
    entries.push({k: key, v: String(value)});
  }
  return entries;
}

export type KeyValueObject = { [key: string]: any };

export type MetadataKeyValueMap = { [key: string]: any };

export class SparkPlanInfo {

  nodeName: string;

  simpleString: string;

  children: SparkPlanInfo[];

  metadata: MetadataKeyValueMap;

  metrics: Metrics[];

  time: number; // TOCHECK Date?

  constructor(nodeName: string, simpleString: string, children: SparkPlanInfo[], metadata: MetadataKeyValueMap, metrics: Metrics[], time: number
      ) {
    this.nodeName = nodeName;
    this.simpleString = simpleString;
    this.children = children;
    this.metadata = metadata;
    this.metrics = metrics;
    this.time = time;
  }

  static fromJson(src: any): SparkPlanInfo {
    let nodeName = <string> src['nodeName'];
    let simpleString = <string> src['simpleString'];
    let childrenObj = src['children'];
    let children = (childrenObj)? SparkPlanInfo.fromJsonArray(childrenObj) : [];
    let metadataObj = src['metadata'];
    let metadata: MetadataKeyValue = (metadataObj)? metadataObj! : {};
    let metricsObj = src['metrics'];
    let metrics = (metricsObj)? Metrics.fromJsonArray(metricsObj) : [];
    let time = <number> src['time']; // TOCHECK Date?
    return new SparkPlanInfo(nodeName, simpleString, children, metadata, metrics, time);
  }

  static fromJsonArray(src: any[]): SparkPlanInfo[] {
      return src.map(x => SparkPlanInfo.fromJson(x));
  }

  static createDefault(): SparkPlanInfo {
    let time = 0; // TOCHECK Date?
    return new SparkPlanInfo('', '', [], {}, [], time);
  }

}
