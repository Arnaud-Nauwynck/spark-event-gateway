import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SparkAppKey} from '../../../model/SparkAppKey';
import {SparkAppSummary} from '../../../model/summary/SparkAppSummary';
import {SparkApiService} from '../../../services/SparkApiService';
import {SparkEventSummary} from '../../../model/summary/SparkEventSummary';
import {SparkGlobalSettingsService} from '../../../services/SparkGlobalSettingsService';
import {SparkEventSummaryFilter} from '../../../model/summary/SparkEventSummaryFilter';
import {SparkEventSummaryTableComponent} from '../../../features/sparkapp-summary/event/spark-event-summary-table.component';


@Component({
  selector: 'app-spark-event-summary-table-page',
  imports: [
    CommonModule, FormsModule, //
    SparkEventSummaryTableComponent,
  ],
  templateUrl: './spark-event-summary-table-page.html',
})
export class SparkEventSummaryTablePage {

  sparkAppKey!: SparkAppKey;
  fromIndex: number = 0;
  limit: number = 10000;

  sparkAppSummary: SparkAppSummary|undefined;
  items: SparkEventSummary[] = [];
  filter: SparkEventSummaryFilter|undefined;

  constructor(activatedRoute: ActivatedRoute,
              private sparkApi: SparkApiService,
              globalSettings: SparkGlobalSettingsService
              ) {
    this.filter = globalSettings.sparkEventSummaryFilter;
    activatedRoute.params.subscribe(params => {
      this.sparkAppKey = SparkAppKey.fromRouteParams(params);
      this.sparkAppSummary = undefined;
      if (this.sparkAppKey.isValid) {
        sparkApi.sparkAppSummary$(this.sparkAppKey).subscribe(res => {
          this.sparkAppSummary = res;
          this.reloadItems();
        });
      }
    });
    activatedRoute.queryParams.subscribe(queryParams => {
      const fromIndexOpt = queryParams['from'];
      this.fromIndex =  fromIndexOpt? +fromIndexOpt : 0;
      const limitOpt = queryParams['limit'];
      this.limit =  limitOpt? +limitOpt : 10000;
      this.items = [];
      this.reloadItems();
    });
  }

  reloadItems() {
    // TODO should reload missing items if range changed
    if (this.sparkAppKey?.isValid && this.limit) {
      this.sparkApi.sparkAppEventSummaries$(this.sparkAppKey, this.fromIndex, this.limit).subscribe(resItems => {
        this.items = resItems || [];
        console.log('received ' + resItems.length + ' items');
      });
    }
  }

  protected onLimitChange() {
    // TODO
    this.reloadItems();
  }

  protected onFromIndexChange() {
    // TODO
    this.reloadItems();
  }

}
