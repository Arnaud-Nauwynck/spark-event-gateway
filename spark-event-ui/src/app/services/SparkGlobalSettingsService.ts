import {Injectable} from '@angular/core';
import {SparkEventFilter} from '../model/SparkEventFilter';

@Injectable()
export class SparkGlobalSettingsService {

  sparkEventFilter: SparkEventFilter = new SparkEventFilter();

}
