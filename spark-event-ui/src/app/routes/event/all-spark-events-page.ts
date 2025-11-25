import {Component} from '@angular/core';

import SparkApiService from '../../services/SparkApiService';
import {SparkCtx} from '../../model/trackers/SparkCtx';
import {SparkEventFilter} from '../../model/SparkEventFilter';
import {SparkGlobalSettingsService} from '../../services/SparkGlobalSettingsService';
import {SparkEventRow, SparkEventsTableComponent} from '../../features/spark-events/spark-events-table.component';


@Component({
  selector: 'app-all-spark-events-page',
  imports: [SparkEventsTableComponent
  ],
  templateUrl: './all-spark-events-page.html',
})
export class AllSparkEventsPage {

  sparkCtx: SparkCtx|undefined;

  allSparkEvents: SparkEventRow[] = [];

  get sparkEventFilter(): SparkEventFilter { return this.globalSettings.sparkEventFilter; }

  constructor(private apiService: SparkApiService,
              private globalSettings: SparkGlobalSettingsService) {
    this.apiService.loadCtx().subscribe(data => {
      this.sparkCtx = data;
      // console.log('Loaded spark events: ' + data.events.length);
      this.allSparkEvents = data.events.map(x => { return { event: x }; });
    });
  }

}
