import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {SparkApplicationConfigDTO} from '../../../rest';
import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';
import {KeyValueTableComponent} from '../../../shared/key-value-table';


@Component({
  selector: 'app-spark-app-config',
  imports: [FormsModule, LabelCheckboxComponent, KeyValueTableComponent,
  ],
  templateUrl: './spark-app-config.component.html',
  standalone: true
})
export class SparkAppConfigComponent {

  @Input()
  model!: SparkApplicationConfigDTO;

  protected showJvmInformation= false;
  protected showSparkProperties = false;
  protected showHadoopProperties = false;
  protected showSystemProperties = false;
  protected showClasspathEntries = false;
  protected showMetricsProperties = false;
  protected showOtherEnvironmentDetails = false;


}
