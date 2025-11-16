import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StageInfo} from '../../model/sparkevents/StageInfo';

@Component({
  selector: 'app-stage-info',
  imports: [CommonModule ],
  templateUrl: './StageInfo.component.html',
})
export class SparkPlanInfoComponent {

  @Input()
  stageInfo!: StageInfo;
  
}
