import {Component, Input, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SparkPlanGraph, SparkPlanGraphCluster, SparkPlanGraphEdge} from '../../../model/sql/SparkPlanGraph';
import * as dagre from "@dagrejs/dagre";

/**
 *
 */
@Component({
  selector: 'app-spark-plan-graph-dagree',
  imports: [CommonModule,
  ],
  templateUrl: './spark-plan-graph-dagree.component.html',
  standalone: true
})
class SparkPlanGraphDagreeComponent implements OnDestroy {

  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('svg', { static: true })
  svgElementRef!: ElementRef<SVGElement>;

  @Input()
  sparkPlanGraph!: SparkPlanGraph;

  _dagreeGraph : dagre.graphlib.Graph | undefined;
  get dagreeGraph(): dagre.graphlib.Graph {
    if (!this._dagreeGraph) {
      this._dagreeGraph = this.layoutGraph();
    }
    return this._dagreeGraph!;
  }

  graphMinX = 0;
  graphMinY = 0;
  graphWidth = 2000;
  graphHeight = 2000;

  // Zoom and pan state
  zoom: number = 1;
  // Remove panX/panY, use scroll for pan
  get svgTransform(): string {
    return `scale(${this.zoom})`;
  }

  // Tooltip and selection state
  hoveredNode: any = null;
  tooltipX: number = 0;
  tooltipY: number = 0;
  selectedNode: any = null;

  /**
   * Compute SVG path for an edge between two nodes
   */
  getEdgePath(edge: SparkPlanGraphEdge): string {
    const fromNode = edge.from;
    const toNode = edge.to;
    if (!fromNode || !toNode) return '';
    // Start at bottom center of fromNode
    const startX = fromNode.x;
    const startY = fromNode.y;
    // End at top center of toNode
    const endX = toNode.x;
    const endY = toNode.y;
    // Simple cubic Bezier for a nice curve
    const deltaY = (endY - startY) / 2;
    return `M${startX},${startY} C${startX},${startY + deltaY} ${endX},${endY - deltaY} ${endX},${endY}`;
  }

  onClickRedoLayout() {
    this._dagreeGraph = this.layoutGraph();
  }

  zoomIn() {
    this.zoom = Math.min(this.zoom * 1.2, 10);
  }

  zoomOut() {
    this.zoom = Math.max(this.zoom / 1.2, 0.1);
  }

  resetZoom() {
    this.zoom = 1;
    // this.panX = 0;
    // this.panY = 0;
  }

  // Optional: handle mouse wheel for zoom
  onSvgWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(this.zoom * delta, 10));
    this.zoom = newZoom;
  }

  ngOnDestroy() {
    // Clean up listeners if component is destroyed
    // if (this.documentMouseMove) document.removeEventListener('mousemove', this.documentMouseMove);
    // if (this.documentMouseUp) document.removeEventListener('mouseup', this.documentMouseUp);
  }

  // Add this function for *ngFor trackBy
  trackNode(index: number, node: any) {
    return node.id;
  }

  onNodeMouseEnter(node: any, event: MouseEvent) {
    this.hoveredNode = node;
    this.setTooltipPosition(event);
  }

  onNodeMouseMove(node: any, event: MouseEvent) {
    if (this.hoveredNode === node) {
      this.setTooltipPosition(event);
    }
  }

  setTooltipPosition(event: MouseEvent) {
    // Find the SVG element
    const svgElement = this.svgElementRef.nativeElement;
    const ownerSvg = svgElement.ownerSVGElement;
    if (!ownerSvg) {
      console.warn('SVG owner not found for tooltip positioning');
    }
    // let svg: SVGSVGElement | null = null;
    // if ((event.target as Element).ownerSVGElement) {
    //   svg = (event.target as Element).ownerSVGElement as SVGSVGElement;
    // } else {
    //   svg = document.querySelector('svg');
    // }
    // if (!svg) return;
    //
    // // Get the mouse position relative to the SVG coordinate system
    // const point = ownerSvg.createSVGPoint();
    // point.x = event.clientX;
    // point.y = event.clientY;
    // const ctm = svg.getScreenCTM();
    // if (ctm) {
    //   const svgPoint = point.matrixTransform(ctm.inverse());
    //   this.tooltipX = svgPoint.x + 10; // offset right
    //   this.tooltipY = svgPoint.y + 10; // offset down
    // } else {
    //   // fallback: use mouse offset in SVG
    //   const rect = svg.getBoundingClientRect();
    //   this.tooltipX = event.clientX - rect.left + 10;
    //   this.tooltipY = event.clientY - rect.top + 10;
    // }
  }

  onNodeMouseLeave() {
    this.hoveredNode = null;
  }

  onClusterNodeClick(node: SparkPlanGraphCluster, event: MouseEvent) {
    this.selectedNode = node;
    event.stopPropagation();
    console.log('onClusterNodeClick node:', node);
  }

  onNodeClick(node: any, event: MouseEvent) {
    this.selectedNode = node;
    event.stopPropagation();
    console.log('onNodeClick node:', node);
  }

  protected layoutGraph() {
    const g = new dagre.graphlib.Graph({ directed: true, multigraph: true, compound: true });
    g.setGraph({
      'compound': true,
      'rankdir': 'TB', // Top to Bottom
      'ranksep': 10,   // default is 50, reduce for compactness
      'nodesep': 10    // default is 50, reduce for compactness
    });
    g.setDefaultEdgeLabel(() => ({}));

    // 1. Add all nodes (including clusters and children) before setting parents
    this.sparkPlanGraph.nodes.forEach(node => {
      let nodeHeight = 40;
      let nodeWidth = 250;
      const nodeCluster = node.asCluster();
      if (nodeCluster) {
        let sumChildHeight = 0;
        nodeCluster.nodes.forEach(childNode => {
          let childWidth = 250;
          let childHeight = 40;
          g.setNode(childNode.idText, {
            label: childNode.sparkPlanNode.nodeName,
            width: childWidth,
            height: childHeight,
          });
          nodeWidth = Math.max(nodeWidth, childWidth + 20);
          nodeHeight += childHeight + 10;
        });
      }

      g.setNode(node.idText, {
        label: node.sparkPlanNode.nodeName,
        width: nodeWidth,
        height: nodeHeight,
      });
    });

    // 2. Set parent relationships after all nodes are added
    this.sparkPlanGraph.nodes.forEach(node => {
      const nodeCluster = node.asCluster();
      if (nodeCluster) {
        nodeCluster.nodes.forEach(childNode => {
          g.setParent(childNode.idText, node.idText);
        });
      }
    });

    // 3. Add edges
    this.sparkPlanGraph.edges.forEach(edge => {
      g.setEdge(edge.fromIdText, edge.toIdText);
    });

    dagre.layout(g);

    console.log('done dagreejs layout:', g);

    for(let i = 0; i < 5; i++) {
      const node = this.sparkPlanGraph.nodes[i];
      const dagreeNode = g.node(node.idText);
      console.log(` node ${node.id} (${node.sparkPlanNode.nodeName}): `, dagreeNode);

      if (node instanceof SparkPlanGraphCluster) {
        const nodeCluster = node as SparkPlanGraphCluster;
        console.log(`  cluster ${node.id} children:`);
        nodeCluster.nodes.forEach(childNode => {
          const dagreeChildNode = g.node(childNode.idText);
          console.log(`   child ${childNode.id} (${childNode.sparkPlanNode.nodeName}): `, dagreeChildNode);
        });
      }
    }

    this.sparkPlanGraph.nodes.forEach(node => {
      const dagreeNode = g.node(node.idText);
      if (dagreeNode) {
        node.x = dagreeNode.x;
        node.y = dagreeNode.y;
        node.width = dagreeNode.width;
        node.height = dagreeNode.height;

        if (node instanceof SparkPlanGraphCluster) {
          const nodeCluster = node as SparkPlanGraphCluster;
          let minChildY = node.y;
          let maxChildY = node.y;
          let maxChildWidth = 0;
          nodeCluster.nodes.forEach(childNode => {
            const dagreeChildNode = g.node(childNode.idText);
            if (dagreeChildNode) {
              // childNode.x = dagreeChildNode.x;
              childNode.x = node.x; // align children horizontally centered
              childNode.y = dagreeChildNode.y;
              childNode.width = dagreeChildNode.width;
              childNode.height = dagreeChildNode.height;
              minChildY = Math.min(minChildY, childNode.y - (childNode.height || 40)/2);
              maxChildY = Math.max(maxChildY, childNode.y + (childNode.height || 40)/2);
              maxChildWidth = Math.max(maxChildWidth, childNode.width || 100);
            }
          });
          // Adjust cluster height to enclose children
          node.y = (minChildY + maxChildY) / 2;
          node.height = maxChildY - minChildY + 20;
          node.width = maxChildWidth + 20;
        }
      }
    });

    // compute min/max x,y for all nodes (including clusters and children)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const allNodes = this.sparkPlanGraph.allNodes;
    allNodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x + (node.width || 100));
        maxY = Math.max(maxY, node.y + (node.height || 40));
      }
    });
    // Add margin
    const margin = 40;
    this.graphMinX = minX - margin;
    this.graphMinY = minY - margin;
    this.graphWidth = (maxX - minX) + 2 * margin;
    this.graphHeight = (maxY - minY) + 2 * margin;
    console.log(`Graph bounds: minX=${this.graphMinX}, minY=${this.graphMinY}, width=${this.graphWidth}, height=${this.graphHeight}`);

    return g;
  }
}

export default SparkPlanGraphDagreeComponent
