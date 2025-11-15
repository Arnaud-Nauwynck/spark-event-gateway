
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

    
export class SparkPlanInfo {

  nodeName: string;

  simpleString: string;
  
  children: SparkPlanInfo[];

  metadata: Map<String,Object>;
    
  metrics: Metrics[];
    
  time: number; // TOCHECK Date?

  constructor(nodeName: string, simpleString: string, children: SparkPlanInfo[], metadata: Map<String,Object>, metrics: Metrics[], time: number
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
    let metadata = (metadataObj)? new Map(Object.entries(metadataObj)) : new Map(); // TOCHECK null?
    let metricsObj = src['metrics'];
    let metrics = (metricsObj)? Metrics.fromJsonArray(metricsObj) : []; // TOCHECK null?
    let time = <number> src['time']; // TOCHECK Date?
    return new SparkPlanInfo(nodeName, simpleString, children, metadata, metrics, time);
  }
  
  static fromJsonArray(src: any[]): SparkPlanInfo[] {
      return src.map(x => SparkPlanInfo.fromJson(x));
  }

  static createDefault(): SparkPlanInfo {
    let time = 0; // TOCHECK Date?
    return new SparkPlanInfo('', '', [], new Map(), [], time);
  }

}
