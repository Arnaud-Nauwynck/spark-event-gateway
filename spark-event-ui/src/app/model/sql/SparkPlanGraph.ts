import {SparkPlanNode} from './SparkPlanNode';

export class SparkPlanGraphEdge {
  readonly fromId: number;
  readonly toId: number;

  get fromIdText(): string { return `n-${this.fromId}`; }
  get toIdText(): string { return `n-${this.toId}`; }

  constructor(
    public readonly from: SparkPlanGraphNode, public readonly to: SparkPlanGraphNode
    // public fromId: number, public toId: number
  ) {
    this.fromId = from.id;
    this.toId = to.id;
  }

}

export class SparkPlanGraphNode {
  // computed from dagree layout
  x: number = 0;
  y: number = 0;
  height: number = 40;
  width: number = 100;
  rank: number = 0;

  get idText(): string {
    return `n-${this.id}`;
  }

  constructor(
    public readonly id: number,
    public readonly sparkPlanNode: SparkPlanNode
  ) {}

  asCluster(): SparkPlanGraphCluster|undefined {
    if (this instanceof SparkPlanGraphCluster) {
      return this;
    }
    return undefined;
  }
}

export class SparkPlanGraphCluster extends SparkPlanGraphNode {
  constructor(id: number, sparkPlanNode: SparkPlanNode,
    public nodes: SparkPlanGraphNode[]
  ) {
    super(id, sparkPlanNode);
  }

}

/**
 *
 */
export class SparkPlanGraph {
  graphGroupedFilterWithProject = false;

  static fromPlanInfo(planInfo: SparkPlanNode): SparkPlanGraph {
    const nodeIdGenerator = { value: 0 };
    const nodes: SparkPlanGraphNode[] = [];
    const edges: SparkPlanGraphEdge[] = [];
    const exchanges: Map<number/*nodePathId*/,SparkPlanGraphNode> = new Map();
    SparkPlanGraph.buildSparkPlanGraphNode(
      planInfo, nodeIdGenerator, nodes, edges, null, null, exchanges);

    let debug = true;
    if (debug) {
      console.log(`SparkPlanGraph: built with ${nodes.length} nodes and ${edges.length} edges.`);
      console.log('Nodes:');
      for(let i = 0; i < 10; i++) {
        const node = nodes[i];
        console.log(`  Node ${node.id}: ${node.sparkPlanNode.nodeName}`);
        if (node instanceof SparkPlanGraphCluster) {
          console.log(`    (Cluster with ${node.nodes.length} nodes): `, node.nodes.map(n => n.id + ' ' + n.sparkPlanNode.nodeName).join(', '));
        }
      }
      for(let i = 0; i < 10; i++) {
        const edge = edges[i];
        console.log(`  Edge ${edge.fromId} -> ${edge.toId}`);
      }
    }

    return new SparkPlanGraph(nodes, edges);
  }

  constructor(
    public nodes: SparkPlanGraphNode[],
    public edges: SparkPlanGraphEdge[]
  ) {}

  get allNodes(): SparkPlanGraphNode[] {
    const result: SparkPlanGraphNode[] = [];
    for (const node of this.nodes) {
      if (node instanceof SparkPlanGraphCluster) {
        result.push(...node.nodes, node);
      } else {
        result.push(node);
      }
    }
    return result;
  }

  static buildSparkPlanGraphNode(
    planInfo: SparkPlanNode,
    nodeIdGenerator: { value: number },
    nodes: SparkPlanGraphNode[],
    edges: SparkPlanGraphEdge[],
    parent: SparkPlanGraphNode | null,
    subgraph: SparkPlanGraphCluster | null,
    exchanges: Map<number/*nodePathId*/,SparkPlanGraphNode>
  ): void {
    const name = planInfo.nodeName;
    if (name.startsWith("WholeStageCodegen")) {
      const cluster = new SparkPlanGraphCluster(nodeIdGenerator.value++, planInfo, []);
      nodes.push(cluster);
      SparkPlanGraph.buildSparkPlanGraphNode(
        planInfo.children[0], nodeIdGenerator, nodes, edges, parent, cluster, exchanges
      );
    } else if (name === "InputAdapter") {
      SparkPlanGraph.buildSparkPlanGraphNode(
        planInfo.children[0], nodeIdGenerator, nodes, edges, parent, null, exchanges
      );
    } else if (name === "BroadcastQueryStage" || name === "ShuffleQueryStage") {
      if (exchanges.has(planInfo.children[0].nodePathId)) {
        const node = exchanges.get(planInfo.children[0].nodePathId)!;
        if (parent) edges.push(new SparkPlanGraphEdge(node, parent));
      } else {
        SparkPlanGraph.buildSparkPlanGraphNode(
          planInfo.children[0], nodeIdGenerator, nodes, edges, parent, null, exchanges
        );
      }
    } else if (name === "TableCacheQueryStage") {
      SparkPlanGraph.buildSparkPlanGraphNode(
        planInfo.children[0], nodeIdGenerator, nodes, edges, parent, null, exchanges
      );
    } else if (name === "Subquery" && subgraph !== null) {
      SparkPlanGraph.buildSparkPlanGraphNode(
        planInfo, nodeIdGenerator, nodes, edges, parent, null, exchanges
      );
    } else if (name === "Subquery" && exchanges.has(planInfo.nodePathId)) {
      const node = exchanges.get(planInfo.nodePathId)!;
      if (parent) edges.push(new SparkPlanGraphEdge(node, parent));
    } else if (name === "ReusedSubquery") {
      SparkPlanGraph.buildSparkPlanGraphNode(
        planInfo.children[0], nodeIdGenerator, nodes, edges, parent, subgraph, exchanges
      );
    } else if (name === "ReusedExchange" && exchanges.has(planInfo.children[0].nodePathId)) {
      const node = exchanges.get(planInfo.children[0].nodePathId)!;
      if (parent) edges.push(new SparkPlanGraphEdge(node, parent));
    } else {
      const node = new SparkPlanGraphNode(nodeIdGenerator.value++, planInfo);
      if (subgraph === null) {
        nodes.push(node);
      } else {
        subgraph.nodes.push(node);
      }
      if (name.includes("Exchange") || name === "Subquery") {
        exchanges.set(planInfo.nodePathId, node);
      }
      if (parent) {
        edges.push(new SparkPlanGraphEdge(node, parent));
      }
      for (const child of planInfo.children) {
        SparkPlanGraph.buildSparkPlanGraphNode(
          child, nodeIdGenerator, nodes, edges, node, subgraph, exchanges
        );
      }
    }
  }

}
