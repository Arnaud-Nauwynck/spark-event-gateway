import {KeyValueObject, MetadataKeyValue, MetadataKeyValueMap} from '../sparkevents/SparkPlanInfo';
import {MetricValueHolder} from './metrics/MetricValueHolder';
import {ISparkPlanInfoModel, SparkPlanNodeBuilder} from './SparkPlanNodeBuilder';
import {SparkPlanTree} from './SparkPlanNodeTree';


/**
 * view wrapper for SparkPlanInfo node to add UI specific fields,
 * assign unique IDs to nodes and metricsValueHolders,
 * build a DAG (tree with repetition, if any is detected),
 * compute synthetic metrics, ...
 *
 */
export abstract class SparkPlanNode {
  readonly tree: SparkPlanTree;   // for 1/ id->MetricValueHolder map, and 2/ View UI settings

  readonly parent: SparkPlanNode|undefined;
  /**
   * computed unique path id for this node in the tree, using depth first traversal of the JSON tree
   */
  readonly nodePathId: number;

  // Deprecated (redundant...) use specific subclasses to parse+extract specific fields
  // readonly info: SparkPlanInfo;
  readonly nodeName: string;
  readonly simpleString: string;
  readonly metadata: MetadataKeyValueMap;


  readonly children: SparkPlanNode[];
  readonly metricValueHolders: MetricValueHolder[];

  get isSameDuplicate(): boolean { return this.sameDuplicatedIndex !== undefined; }
  sameDuplicatedIndex: number|undefined;
  sameDuplicateFirstNode: SparkPlanNode|undefined;
  totalSameDuplicates: number|undefined;

  get isSemanticDuplicate(): boolean { return this.semanticDuplicatedIndex !== undefined; }
  semanticDuplicatedIndex: number|undefined;
  semanticDuplicateFirstNode: SparkPlanNode|undefined;
  totalSemanticDuplicates: number|undefined;

  countMetricValuesToShow(): number { return this.metricValueHolders.filter(x => x.isValueToShow()).length; }

  expanded = true;

  // -----------------------------------------------------------------------------------------------------------------

  constructor(
    builder: SparkPlanNodeBuilder,
    parent: SparkPlanNode|undefined,
    info: ISparkPlanInfoModel
  ) {
    this.tree = builder.tree;
    this.nodePathId = builder.newNodePathId();
    this.parent = parent;
    // this.info = info; // Deprecated
    this.nodeName = info.nodeName || '';
    this.simpleString = info.simpleString || '';
    this.metadata = info.metadata || {};

    this.children = (info.children)?
      info.children.map(x => {
        if (x.nodeName === 'InputAdapter' && x.children?.length === 1) {
          // remove intermediate "InputAdapter" node
          builder.newNodePathId(); // still consume a nodePathId for the skipped node
          return builder.createNode(this, x.children[0]);
        }
        return builder.createNode(this, x);
      }) : [];
    this.metricValueHolders = builder.modelAdapter.createMetricsValueHoldersFor(this, info, builder.previousTree);
      // x => new MetricValueHolder(this, x, builder.previousTree)) : [];
  }

  // -----------------------------------------------------------------------------------------------------------------

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
    const before = this.expanded;
    this.expanded = !this.expanded;
    // TODO ... does not work???
    //  console.log('node ' + this.nodeName + ' toggle => expanded:', this, before, this.expanded);
  }

  expandAll(): void {
    this.expanded = true;
    this.children.forEach(c => c.expandAll());
  }

  collapseAll(): void {
    this.expanded = false;
    this.children.forEach(c => c.collapseAll());
  }

  findNodeByPathId(nodePathId: number): SparkPlanNode|undefined {
    if (this.nodePathId === nodePathId) {
      return this;
    }
    for (let child of this.children) {
      const res = child.findNodeByPathId(nodePathId);
      if (res) {
        return res;
      }
    }
    return undefined;
  }

  nodeStyle() : KeyValueObject {
    let res :KeyValueObject = {};
    if (this.isSameDuplicate) {
      res['border'] = '2px solid blue';
    }
    if (this.isSemanticDuplicate) {
      res['border'] = '2px solid orange';
    }
    return res;
  }
}

