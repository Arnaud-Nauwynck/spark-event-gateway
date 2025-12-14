import {KeyValueEntry, KeyValueObject, objToKeyValueEntries} from '../model/sparkevents/SparkPlanInfo';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-key-value-table',
  standalone: true,
  template: `
    <ul>
      @let entries = entryList;
      @for(entry of entries; track entry.k){
        <li>{{ entry.k }}: {{ entry.v }}</li>
      }
    </ul>
  `,
})
export class KeyValueTableComponent {

  @Input()
  model!: KeyValueObject;

  get entryList(): KeyValueEntry[] { return objToKeyValueEntries(this.model); }
}
