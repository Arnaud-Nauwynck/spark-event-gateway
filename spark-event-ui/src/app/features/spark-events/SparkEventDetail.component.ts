import { Component, Input } from '@angular/core';
import {CommonModule, JsonPipe} from '@angular/common';
import { SparkEvent } from '../../model/sparkevents/SparkEvent';
import {RouterLink} from '@angular/router';
import {LabelCheckboxComponent} from '../../shared/label-checkbox/label-checkbox.component';
import {SparkGlobalSettingsService} from '../../services/SparkGlobalSettingsService';
import SparkApiService from '../../services/SparkApiService';
import {SparkPlanInfoComponent} from '../stage/StageInfo.component';
import {KeyValueObject} from '../../model/sparkevents/SparkPlanInfo';

@Component({
  selector: 'app-spark-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, JsonPipe, LabelCheckboxComponent, SparkPlanInfoComponent],
  templateUrl: './SparkEventDetail.component.html',
})
export class SparkEventDetailComponent {

  @Input() sparkEvent: SparkEvent | null = null;


  constructor(protected globalSettings: SparkGlobalSettingsService,
              protected sparkApiService: SparkApiService) {}

  protected onClickGet() {
    if (!this.sparkEvent) {
      return;
    }
    this.sparkApiService.getEventById(this.sparkEvent!.eventNum).subscribe(event => {
      console.log('event', event);
    })
  }

  protected propertiesAsObj(): KeyValueObject {
    const props = this.sparkEvent?.getPropertiesOpt();
    return props || {};
  }

}

