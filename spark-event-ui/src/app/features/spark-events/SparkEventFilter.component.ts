import {Component, EventEmitter, model, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LabelCheckboxComponent} from '../../shared/label-checkbox/label-checkbox.component';
import {SparkEventFilter} from '../../model/SparkEventFilter';


@Component({
  selector: 'app-spark-event-filter',
  imports: [FormsModule, LabelCheckboxComponent],
  templateUrl: './SparkEventFilter.component.html',
})
export class SparkEventFilterComponent {

  sparkEventFilter = model.required<SparkEventFilter>();

  @Output()
  sparkEventFilterChange = new EventEmitter<SparkEventFilter>();

  onChange() {
    this.sparkEventFilterChange.emit(this.sparkEventFilter());
  }

}

