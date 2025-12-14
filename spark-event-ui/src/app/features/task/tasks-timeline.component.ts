import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TaskTracker} from '../../model/trackers/TaskTracker';
import JobTracker from '../../model/trackers/JobTracker';

export class TimelineTask {
  get id(): number { return this.task.taskId; }
  title?: string;
  get start(): number { return this.task.startTime; }
  get end(): number { return this.task.endTime; }
  color?: string;
  lane?: number; // optional pre-assigned lane; if absent, lanes are auto-packed

  constructor(public task: TaskTracker) {
    this.title = `Task ${this.task.taskId}`;
    // const taskInfo = task.taskStartEvent?.taskInfo;
    // this.title += ' #' + taskInfo?.index;
  }

}


/**
 * view wrapper for a TaskTracker
 */
interface DrawRect {
  task: TimelineTask;
  x: number;
  y: number;
  w: number;
  h: number;
  lane: number;
}

/**
 *
 */
@Component({
  selector: 'app-tasks-timeline-canvas',
  standalone: true,
  template: `
    <div class="wrapper" #container>
      @if(timelineLabel) {
        <div>{{timelineLabel}}</div>
      }
      <canvas #canvas></canvas>

      <div class="tooltip" #tooltip
        [style.left.px]="tooltipX" [style.top.px]="tooltipY"
        [class.visible]="tooltipVisible"
        [innerHTML]="tooltipHtml"
      ></div>

      <div class="controls">
        <button (click)="resetView()">Reset view</button>
        <button (click)="dump()">Dump</button>
        <label><input type="checkbox" [(ngModel)]="showLabels"/> show labels</label>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .wrapper {
      width: 100%;
      height: 240px;
      position: relative;
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
      cursor: grab;
    }

    canvas.dragging {
      cursor: grabbing;
    }

    .tooltip {
      position: absolute;
      transform: translate(-50%, -110%);
      pointer-events: none;
      background: rgba(0, 0, 0, 0.78);
      color: white;
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 120ms ease;
      z-index: 10;
    }

    .tooltip.visible {
      opacity: 1;
    }

    .controls {
      position: absolute;
      right: 8px;
      top: 8px;
      background: rgba(255, 255, 255, 0.9);
      padding: 6px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 11;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    button {
      font-size: 12px;
      padding: 4px 8px;
    }
  `],
  imports: [
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksTimelineCanvasComponent
  implements AfterViewInit, OnDestroy, OnChanges {

  // ---------- Inputs ----------
  @Input()
  timelineLabel: string|undefined;

  _timelineTasks: TimelineTask[] = [];
  get timelineTasks(): TimelineTask[] { return this._timelineTasks; }
  set timelineTasks(timelineTasks: TimelineTask[]) {
    this._timelineTasks = timelineTasks;
    this.computeLanesAndRects();
  }

  @Input()
  set tasks(tasks: TaskTracker[]) {
    this.timelineTasks = tasks.map(t => new TimelineTask(t));
  }


  @Input() timelineStart = 0;
  @Input() timelineEnd = 1000;

  // visual options
  @Input() laneHeight = 18;    // height of each lane
  @Input() laneGap = 3;        // gap between lanes
  @Input() executorCores = 8;      // cap lanes if auto-packing; increase if you want more vertical stacking

  @Input() showLabels = true;


  // ---------- Template refs ----------
  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('tooltip', {static: true}) tooltipRef!: ElementRef<HTMLDivElement>;

  // ---------- internal state ----------
  private ctx!: CanvasRenderingContext2D;
  private dpr = window.devicePixelRatio || 1;
  private width = 0;
  private height = 0;
  private resizeObs!: ResizeObserver;

  // transform: maps time -> pixel: x = (time - viewStart) * pxPerUnit + offsetX
  private minStartTime!: number; // computed from timelineTasks
  private maxEndTime!: number;

  private viewStart!: number;   // leftmost time visible
  private viewEnd!: number;  // rightmost time visible
  private pxPerUnit = 1;

  // pan/zoom interaction
  private isDragging = false;
  private dragStartX = 0;
  private dragStartViewStart = 0;

  // drawn rectangles cache (recomputed on draw)
  private rects: DrawRect[] = [];

  // hover / selection UI
  tooltipVisible = false;
  tooltipHtml = '';
  tooltipX = 0;
  tooltipY = 0;
  hoveredTask: TimelineTask | null = null;
  selectedTask: TimelineTask | null = null;

  // allow limiting redraw frequency if needed
  private needsRedraw = true;
  private rafId = 0;

  // ---------- lifecycle ----------
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not supported');
    this.ctx = ctx;

    // initial view = provided timelineStart/end
    this.viewStart = this.timelineStart;
    this.viewEnd = this.timelineEnd;

    // observe resize
    this.resizeObs = new ResizeObserver(() => this.resizeAndRequestDraw());
    this.resizeObs.observe(this.containerRef.nativeElement);

    // pointer events
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);

    // wheel for zoom
    canvas.addEventListener('wheel', this.onWheel, {passive: false});

    // initial sizing + draw
    this.resizeAndRequestDraw();
  }

  ngOnChanges(_: SimpleChanges) {
    // when tasks or timeline inputs change, recompute lanes and redraw
    // don't keep viewStart/viewEnd unless timelineStart/end changed—user expects initial view to match those
    if (this.timelineStart !== undefined && this.timelineEnd !== undefined) {
      // If view equals previous global domain, also update to new domain
      // (This is conservative: we don't forcibly change view if user zoomed)
      // if user hasn't interacted, sync view to inputs
      const viewSpan = this.viewEnd - this.viewStart;
      const domainSpan = this.timelineEnd - this.timelineStart;
      // if current view roughly matches previous domain, update to new domain
      if (Math.abs(viewSpan - domainSpan) < 1e-6) {
        this.viewStart = this.timelineStart;
        this.viewEnd = this.timelineEnd;
      }
    }

    // compute lanes (auto pack) and draw bars
    this.computeLanesAndRects();

    this.requestDraw();
  }

  ngOnDestroy() {
    this.resizeObs?.disconnect();
    const canvas = this.canvasRef.nativeElement;
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    canvas.removeEventListener('wheel', this.onWheel);
    cancelAnimationFrame(this.rafId);
  }

  // ---------- public helpers ----------
  resetView() {
    this.viewStart = this.timelineStart;
    this.viewEnd = this.timelineEnd;
    this.requestDraw();
  }

  // ---------- sizing ----------
  private resizeAndRequestDraw() {
    const el = this.containerRef.nativeElement;
    const style = getComputedStyle(el);
    // compute client size (exclude borders)
    this.width = el.clientWidth;
    this.height = el.clientHeight;

    const canvas = this.canvasRef.nativeElement;
    canvas.width = Math.max(1, Math.floor(this.width * this.dpr));
    canvas.height = Math.max(1, Math.floor(this.height * this.dpr));
    canvas.style.width = this.width + 'px';
    canvas.style.height = this.height + 'px';

    // reset transform before scaling to avoid accumulation
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    this.requestDraw();
  }

  // ---------- drawing ----------
  private requestDraw() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.draw());
  }

  private draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.save();

    // clear (in CSS pixels)
    ctx.clearRect(0, 0, this.width, this.height);

    // background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.width, this.height);

    // compute pxPerUnit from current view
    const domain = this.viewEnd - this.viewStart;
    this.pxPerUnit = domain > 0 ? (this.width / domain) : 1;

    // draw lanes background stripes (optional subtle banding)
    this.drawLaneBackgrounds(ctx);

    // draw task bars
    for (let i = 0; i < this.rects.length; i++) {
      const r = this.rects[i];
      // skip zero width
      if (r.w <= 0) continue;

      // draw bar
      ctx.fillStyle = r.task.color || this.defaultColor(i);
      this.roundRect(ctx, r.x + 0.5, r.y + 0.5, r.w, r.h, 4);
      ctx.fill();

      // draw label if requested and enough room
      if (this.showLabels && r.task.title && r.w >= 40) {
        ctx.fillStyle = 'white';
        ctx.font = '12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
        ctx.textBaseline = 'middle';
        ctx.fillText(r.task.title, r.x + 6, r.y + r.h / 2 + 0.5);
      }
    }

    // draw hover highlight (outline) and selection
    if (this.hoveredTask) {
      const r = this.rects.find(rr => rr.task === this.hoveredTask);
      if (r) {
        ctx.strokeStyle = 'rgba(0,0,0,0.65)';
        ctx.lineWidth = 2;
        this.roundRectStroke(ctx, r.x + 0.5, r.y + 0.5, Math.max(2, r.w), r.h, 4);
      }
    }
    if (this.selectedTask) {
      const r = this.rects.find(rr => rr.task === this.selectedTask);
      if (r) {
        ctx.strokeStyle = 'rgba(255,165,0,0.95)';
        ctx.lineWidth = 2;
        this.roundRectStroke(ctx, r.x + 0.5, r.y + 0.5, Math.max(2, r.w), r.h, 4);
      }
    }

    ctx.restore();
  }

  // ---------- lanes packing & rect computing ----------
  private computeLanesAndRects() {
    if (!this.timelineTasks) {
      this.rects = [];
      return;
    }
    // Determine lanes: greedy interval packing
    // If tasks provide task.lane, use that (clamped), else auto pack.

    this.minStartTime = this.timelineTasks.reduce((prev, t) => Math.min(prev, t.start), Number.POSITIVE_INFINITY);
    this.maxEndTime = this.timelineTasks.reduce((prev, t) => Math.max(prev, t.end), Number.NEGATIVE_INFINITY);
    // initialize view to full range if needed
    this.viewStart = this.minStartTime;
    this.viewEnd = this.maxEndTime;

    // work on a sorted copy by start time
    const tasksSorted = [...this.timelineTasks].sort((a, b) => a.start - b.start || a.end - b.end);

    // lanes array: for each lane, keep the end time of last placed task
    const laneEnds: number[] = [];
    const laneRects: DrawRect[] = [];

    // precompute scale function local vars
    const scale = this.pxPerUnit;
    const barH = this.laneHeight;
    const gap = this.laneGap;

    const maxAllowedLanes = Math.max(1, this.executorCores);

    for (let i = 0; i < tasksSorted.length; i++) {
      const t = tasksSorted[i];
      // compute raw pixel left & width in current view coordinates
      // left = (t.start - viewStart) * pxPerUnit
      let left = Math.round((t.start - this.viewStart) * scale);
      let width = Math.round((t.end - t.start) * scale);

      // shrink wide tasks by 1px for 1px visual gap if width >=4
      if (width >= 4) width = width - 1;

      // clamp to canvas bounds
      if (left + width < 0 || left > this.width) {
        // offscreen horizontally → still assign for lane packing using times but we can skip storing rect if fully offscreen
      }

      let assignedLane = 0;
      if (t.lane !== undefined && Number.isFinite(t.lane)) {
        assignedLane = Math.max(0, Math.min(maxAllowedLanes - 1, Math.floor(t.lane)));
        // ensure laneEnds array large enough
        while (laneEnds.length <= assignedLane) laneEnds.push(Number.NEGATIVE_INFINITY);
        laneEnds[assignedLane] = Math.max(laneEnds[assignedLane], t.end);
      } else {
        // greedy: find first lane where last end <= this task.start (no overlap)
        let found = -1;
        for (let ln = 0; ln < laneEnds.length; ln++) {
          if (laneEnds[ln] <= t.start) {
            found = ln;
            break;
          }
        }
        if (found === -1) {
          // create new lane if we haven't reached cap
          if (laneEnds.length < maxAllowedLanes) {
            found = laneEnds.length;
            laneEnds.push(t.end);
          } else {
            // all lanes occupied — choose the lane with the smallest end (will overlap)
            let minIdx = 0;
            let minVal = laneEnds[0];
            for (let k = 1; k < laneEnds.length; k++) {
              if (laneEnds[k] < minVal) {
                minVal = laneEnds[k];
                minIdx = k;
              }
            }
            found = minIdx;
            laneEnds[found] = t.end; // we still set end to this end (we allow overlap)
          }
        } else {
          laneEnds[found] = t.end;
        }
        assignedLane = found;
      }

      // compute y from lane idx
      const y = assignedLane * (barH + gap) + gap;

      laneRects.push({ task: t, x: left, y, w: width, h: barH, lane: assignedLane });
    }

    // adjust canvas height to fit lanes if necessary
    const neededHeight = laneEnds.length * (this.laneHeight + this.laneGap) + this.laneGap;
    if (neededHeight !== this.height) {
      // if container height differs we don't force container size, but drawing can be clipped.
      // Optionally, we could expand the wrapper — but we'll just use existing height.
      // For now, nothing to do: bars beyond canvas height are clipped.
    }

    // store rects for hit testing and drawing
    this.rects = laneRects;

    console.log(`TasksTimelineCanvas: computed ${laneEnds.length} lanes for ${tasksSorted.length} tasks`);
  }

  private drawLaneBackgrounds(ctx: CanvasRenderingContext2D) {
    // subtle alternating stripes
    for (let i = 0; i < this.executorCores; i++) {
      const y = i * (this.laneHeight + this.laneGap);
      if (y > this.height) break;
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.02)';
        ctx.fillRect(0, y, this.width, this.laneHeight + this.laneGap);
      }
    }
  }

  // ---------- interaction handlers ----------
  // pointerdown uses passive event but we prevent default on wheel
  private onPointerDown = (ev: PointerEvent) => {
    const canvas = this.canvasRef.nativeElement;
    canvas.setPointerCapture?.(ev.pointerId);
    this.isDragging = true;
    this.dragStartX = ev.clientX;
    this.dragStartViewStart = this.viewStart;
    canvas.classList.add('dragging');
  };

  private onPointerMove = (ev: PointerEvent) => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    if (this.isDragging && (ev.buttons & 1)) {
      // Pan: compute delta in time units from dragged pixels
      const dx = ev.clientX - this.dragStartX;
      const timeDelta = -dx / this.pxPerUnit; // negative because dragging right should pan left
      this.viewStart = this.dragStartViewStart + timeDelta;
      this.viewEnd = this.viewStart + (this.width / this.pxPerUnit);
      this.requestDraw();
      this.updateTooltipVisibility(false);
      return;
    }

    // hit test for hover
    const hit = this.hitTest(x, y);
    if (hit) {
      if (this.hoveredTask !== hit.task) {
        this.hoveredTask = hit.task;
        this.tooltipHtml = this.tooltipContent(hit.task);
      }
      this.tooltipVisible = true;
      this.tooltipX = x;
      this.tooltipY = hit.y; // position tooltip near the bar
      this.requestDraw();
    } else {
      if (this.hoveredTask) {
        this.hoveredTask = null;
        this.tooltipVisible = false;
        this.tooltipHtml = '';
        this.requestDraw();
      }
    }
  };

  private onPointerUp = (ev: PointerEvent) => {
    const canvas = this.canvasRef.nativeElement;
    canvas.releasePointerCapture?.(ev.pointerId);
    if (this.isDragging) {
      this.isDragging = false;
      canvas.classList.remove('dragging');

      // If there was no movement (click), interpret as selection
      const moveThreshold = 4;
      if (Math.abs(ev.clientX - this.dragStartX) <= moveThreshold) {
        // click, do selection
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const hit = this.hitTest(x, y);
        if (hit) {
          this.selectedTask = hit.task;
          this.tooltipVisible = true;
          this.tooltipHtml = this.tooltipContent(hit.task, true);
        } else {
          this.selectedTask = null;
          this.tooltipVisible = false;
        }
        this.requestDraw();
      }
    }
  };

  // wheel -> zoom centered on mouse
  private onWheel = (ev: WheelEvent) => {
    // ctrl for vertical scrolling? ignore; we only handle wheel on canvas
    ev.preventDefault();

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = ev.clientX - rect.left;

    const zoomFactor = Math.exp(-ev.deltaY * 0.0014); // tuned exponential scale
    this.zoomAt(mouseX, zoomFactor);
  };

  // ---------- hit testing ----------
  /**
   * Hit test: map pixel coords to rectangle.
   * Optimization: binary search by x coordinate among rects sorted by x.
   * Because rects were built from tasks sorted by start, rects[] is roughly sorted by x.
   */
  private hitTest(px: number, py: number): DrawRect | null {
    if (!this.rects || this.rects.length === 0) return null;

    // simple early exit if py outside lanes vertical range
    if (py < 0 || py > this.height) return null;

    // binary search on x
    let lo = 0, hi = this.rects.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const r = this.rects[mid];
      const midX = r.x + r.w / 2;
      if (px < r.x) {
        hi = mid - 1;
      } else if (px > r.x + r.w) {
        lo = mid + 1;
      } else {
        // px is between x and x+w -> candidate; but need to check vertical too
        if (py >= r.y && py <= r.y + r.h) return r;
        // maybe multiple lanes overlap in x; scan neighbors around mid (small local scan)
        // scan left
        for (let i = mid - 1; i >= Math.max(0, mid - 64); i--) {
          const rr = this.rects[i];
          if (px < rr.x) break; // no more candidates
          if (px <= rr.x + rr.w && py >= rr.y && py <= rr.y + rr.h) return rr;
        }
        // scan right
        for (let i = mid + 1; i <= Math.min(this.rects.length - 1, mid + 64); i++) {
          const rr = this.rects[i];
          if (px > rr.x + rr.w) break;
          if (px >= rr.x && px <= rr.x + rr.w && py >= rr.y && py <= rr.y + rr.h) return rr;
        }
        return null;
      }
    }

    // not found via mid search; do small linear search around lo
    for (let i = Math.max(0, lo - 32); i <= Math.min(this.rects.length - 1, lo + 32); i++) {
      const rr = this.rects[i];
      if (px >= rr.x && px <= rr.x + rr.w && py >= rr.y && py <= rr.y + rr.h) return rr;
    }

    return null;
  }

  // ---------- zoom helpers ----------
  private zoomAt(mousePx: number, factor: number) {
    // convert mousePx to time coordinate
    const mouseTime = this.viewStart + (mousePx / this.pxPerUnit);

    // new domain
    const viewSpan = this.viewEnd - this.viewStart;
    const newSpan = viewSpan / factor;

    // clamp zoom limits (avoid infinite zoom)
    const minSpan = (this.timelineEnd - this.timelineStart) / 10000 || 1;
    const maxSpan = (this.timelineEnd - this.timelineStart) * 4 || viewSpan * 4;
    const clampedSpan = Math.max(minSpan, Math.min(maxSpan, newSpan));

    // center new view around mouseTime (preserve ratio)
    const frac = (mouseTime - this.viewStart) / viewSpan;
    this.viewStart = mouseTime - frac * clampedSpan;
    this.viewEnd   = this.viewStart + clampedSpan;

    // optionally clamp to global domain
    // here we allow panning outside domain a bit; if you want strict clamp, uncomment:
    // const globalStart = this.timelineStart - clampedSpan * 0.1;
    // const globalEnd = this.timelineEnd + clampedSpan * 0.1;
    // if (this.viewStart < globalStart) { this.viewStart = globalStart; this.viewEnd = globalStart + clampedSpan; }
    // if (this.viewEnd > globalEnd)   { this.viewEnd = globalEnd; this.viewStart = globalEnd - clampedSpan; }

    this.requestDraw();
  }

  // ---------- utility drawing helpers ----------
  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    // clamp radius
    const radius = Math.max(0, Math.min(r, Math.min(w / 2, h / 2)));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  private roundRectStroke(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    this.roundRect(ctx, x, y, w, h, r);
    ctx.stroke();
  }

  private tooltipContent(t: TimelineTask, selected = false) {
    const s = this.formatTime(t.start);
    const e = this.formatTime(t.end);
    return `<strong>${this.escapeHtml(String(t.title ?? t.id))}</strong><br/>${s} → ${e}${selected ? '<br/><em>selected</em>' : ''}`;
  }

  private updateTooltipVisibility(visible: boolean) {
    this.tooltipVisible = visible;
    if (!visible) {
      this.tooltipHtml = '';
    }
  }

  private escapeHtml(str: string) {
    return str.replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]!));
  }

  private formatTime(v: number) {
    // naive formatting — adapt to your units
    const d = new Date(v);
    if (!isFinite(d.getTime())) return String(v);
    return d.toISOString().replace('T', ' ').slice(0, 19);
  }

  private defaultColor(i: number) {
    const palette = ['#10b981'];
    return palette[i % palette.length];
  }


  dump() {
    console.log('TasksTimelineCanvas dump:', this);
  }
}
