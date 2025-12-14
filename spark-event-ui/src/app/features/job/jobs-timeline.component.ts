import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import JobTracker from '../../model/trackers/JobTracker';
import {TasksTimelineCanvasComponent} from '../task/tasks-timeline.component';

interface TimelineJob {
  job: JobTracker;
  row: number;
}


@Component({
    selector: 'app-jobs-timeline',
    imports: [
        CommonModule,
        TasksTimelineCanvasComponent
    ],
    templateUrl: './jobs-timeline.component.html',
    standalone: true
})
export class JobsTimelineComponent {

  _jobs!: JobTracker[];

  get jobs(): JobTracker[] { return this._jobs; }
  @Input()
  set jobs(jobs: JobTracker[]) {
    this._jobs = jobs;
    // compute row position for each node, to avoid overlapping with each others
    // TODO
  }

  @Input()
  relativeToStartTime = 0;

  get relativeToStartTimeText(): string {
    return (this.relativeToStartTime > 0) ? ` (relative to ${new Date(this.relativeToStartTime)})` : '';
  }

  @Input()
  executorCores = 1;

  @Input()
  showTasks = false;


  timelineJobs: TimelineJob[] = [];
  minTime!: number;
  maxTime!: number;
  rows: TimelineJob[][] = [];


  // -----------------------------------------------------------------------------------------------------------------

  ngOnInit() {
    if (!this.jobs || this.jobs.length === 0) return;

    this.minTime = Math.min(...this.jobs.map(j => j.startTime!));
    this.maxTime = Math.max(...this.jobs.map(j => j.endTime!));

    // Sort jobs by startTime
    const sortedJobs = [...this.jobs].sort((a, b) => a.startTime - b.startTime);

    // Assign jobs to rows (greedy algorithm)
    this.rows = [];
    sortedJobs.forEach(job => {
      let placed = false;
      for (let r = 0; r < this.rows.length; r++) {
        // Check if job overlaps with last job in row
        const lastJob = this.rows[r][this.rows[r].length - 1];
        if (lastJob.job.endTime <= job.startTime) {
          this.rows[r].push({ job, row: r });
          placed = true;
          break;
        }
      }
      if (!placed) {
        // Create new row
        this.rows.push([{ job, row: this.rows.length }]);
      }
    });

    // Flatten for template
    this.timelineJobs = this.rows.flat();
  }

  getJobStyle(job: JobTracker) {
    const total = this.maxTime - this.minTime;
    const left = ((job.startTime - this.minTime) / total) * 100;
    const width = ((job.endTime - job.startTime) / total) * 100;
    return {
      left: `${left}%`,
      width: `${width}%`
    };
  }

}
