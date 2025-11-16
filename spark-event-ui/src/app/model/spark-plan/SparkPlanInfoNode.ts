import {Metrics, SparkPlanInfo} from '../sparkevents/SparkPlanInfo';

export class MetricValueHolder {
  readonly parentNode: SparkPlanInfoNode|undefined;
  readonly metric: Metrics;
  value: number = 0;

  get name(): string { return this.metric.name; }
  get accumulatorId(): number { return this.metric.accumulatorId; }
  get metricType(): string { return this.metric.metricType; }

  constructor(parentNode: SparkPlanInfoNode|undefined, metric: Metrics) {
    this.parentNode = parentNode;
    this.metric = metric;
  }

  isValueToShow(): boolean {
    // TODO..
    if (!this.value) {
      return false;
    }
    return true;
  }
}

/**
 *
 */
export class SparkPlanInfoTree {
  readonly rootNode: SparkPlanInfoNode;
  idGenerator= 0;
  newId(){ this.idGenerator++; return this.idGenerator; }

  showMetrics = true;

  constructor(sparkPlanInfo: SparkPlanInfo) {
    this.rootNode = new SparkPlanInfoNode(this, undefined, sparkPlanInfo);
  }
}

interface MetadataKeyValue {
  k: string;
  v: any;
}

/**
 * view wrapper for SparkPlanInfo node to add UI specific fields,
 * and to build a DAG (tree with repetition, if any is detected)
 */
export class SparkPlanInfoNode {
  readonly tree: SparkPlanInfoTree;
  readonly id: number;
  readonly parent: SparkPlanInfoNode|undefined;
  readonly info: SparkPlanInfo;
  readonly children: SparkPlanInfoNode[];
  readonly metricValues: MetricValueHolder[];

  countMetricValuesToShow(): number { return this.metricValues.filter(x => x.isValueToShow()).length; }

  expanded = true;

  constructor(
    tree: SparkPlanInfoTree,
    parent: SparkPlanInfoNode|undefined, info: SparkPlanInfo) {
    this.tree = tree;
    this.id = tree.newId();
    this.parent = parent;
    this.info = info;
    this.children = (info.children)?
      info.children.map(x => {
        if (x.nodeName === 'InputAdapter' && x.children?.length === 1) {
          // remove intermediate "InputAdapter" node
          return new SparkPlanInfoNode(tree, this, x.children[0]);
        }
        return new SparkPlanInfoNode(tree, this, x);
      }) : [];
    this.metricValues = (info.metrics)? info.metrics.map(x => new MetricValueHolder(this, x)) : [];
  }

  get nodeName(): string { return this.info.nodeName; }
  get simpleString(): string { return this.info.simpleString; }
  get metadata(): Map<string,any> { return this.info.metadata; }

  getMetadataKeyValues(): MetadataKeyValue[] {
    if (!this.info.metadata) { return []; }
    return Array.from(this.info.metadata.entries()).map(([k,v]) => ({k,v}));
  }

  metricByName(name: string): MetricValueHolder|undefined { return this.metricValues.find(x => x.name === name);}
  metricByAccumulatorId(accumulatorId: number): MetricValueHolder|undefined { return this.metricValues.find(x => x.accumulatorId === accumulatorId);}

  toggle(): void {
    this.expanded = !this.expanded;
  }

  expandAll(): void {
    this.expanded = true;
    this.children.forEach(c => c.expandAll());
  }

  collapseAll(): void {
    this.expanded = false;
    this.children.forEach(c => c.collapseAll());
  }

}

