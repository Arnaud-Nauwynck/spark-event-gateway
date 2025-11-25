import {SparkPlanInfoTree} from '../SparkPlanNode';
import {MetadataKeyValue, MetadataKeyValueMap, SparkPlanInfo} from '../../sparkevents/SparkPlanInfo';
import {MetricValueHolder} from '../metrics/MetricValueHolder';
import {SparkPlanNodeBuilder} from './SparkPlanNodeBuilder';


/**
 * view wrapper for SparkPlanInfo node to add UI specific fields,
 * assign unique IDs to nodes and metricsValueHolders,
 * build a DAG (tree with repetition, if any is detected),
 * compute synthetic metrics, ...
 *
 */
export abstract class SparkPlanNode {
  readonly tree: SparkPlanInfoTree;   // for 1/ id->MetricValueHolder map, and 2/ View UI settings
  readonly id: number;
  readonly parent: SparkPlanNode|undefined;

  // Deprecated (redundant...) use specific subclasses to parse+extract specific fields
  // readonly info: SparkPlanInfo;
  readonly nodeName: string;
  readonly simpleString: string;
  readonly metadata: MetadataKeyValueMap;


  readonly children: SparkPlanNode[];
  readonly metricValueHolders: MetricValueHolder[];

  countMetricValuesToShow(): number { return this.metricValueHolders.filter(x => x.isValueToShow()).length; }

  expanded = true;

  constructor(
    builder: SparkPlanNodeBuilder,
    parent: SparkPlanNode|undefined,
    info: SparkPlanInfo
  ) {
    this.tree = builder.tree;
    this.id = builder.newId();
    this.parent = parent;
    // this.info = info; // Deprecated
    this.nodeName = info.nodeName;
    this.simpleString = info.simpleString;
    this.metadata = info.metadata;

    this.children = (info.children)?
      info.children.map(x => {
        if (x.nodeName === 'InputAdapter' && x.children?.length === 1) {
          // remove intermediate "InputAdapter" node
          return builder.createNode(this, x.children[0]);
        }
        return builder.createNode(this, x);
      }) : [];
    this.metricValueHolders = (info.metrics)? info.metrics.map(x => new MetricValueHolder(this, x, builder.previousTree)) : [];
  }

  getMetadataKeyValues(): MetadataKeyValue[] {
    if (! this.metadata) { return []; }
    // transform javascript Object {} to array of key,value
    return Object.entries(this.metadata).map(([k,v]) => ({ k, v}));
  }

  metricByName(name: string): MetricValueHolder|undefined { return this.metricValueHolders.find(x => x.name === name);}
  metricByAccumulatorId(accumulatorId: number): MetricValueHolder|undefined { return this.metricValueHolders.find(x => x.accumulatorId === accumulatorId);}

  countMetricsWithUpdates(): number {
    return this.metricValueHolders.reduce(
      (count, m) => count + ((m.updateCount !== 0) ? 1 : 0), 0);
  }

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


/**
 *
 */
export class GenericSparkPlanNode extends SparkPlanNode {
  constructor(builder: SparkPlanNodeBuilder, parent: SparkPlanNode|undefined,
    info: SparkPlanInfo
  ) {
    super(builder, parent, info);
  }

}
