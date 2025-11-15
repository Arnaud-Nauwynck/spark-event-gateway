import { Component, Input } from '@angular/core';
import {CommonModule, JsonPipe} from '@angular/common';
import { SparkEvent } from '../../model/sparkevents/SparkEvent';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-spark-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, JsonPipe],
  templateUrl: './SparkEventDetail.component.html',
})
export class SparkEventDetailComponent {
  @Input() sparkEvent: SparkEvent | null = null;
}

