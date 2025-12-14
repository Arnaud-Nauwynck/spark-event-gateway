import {Component, Input} from '@angular/core';
import {SparkAppKey} from '../model/SparkAppKey';
import {RouterLink} from '@angular/router';
import {SparkSqlExecKey} from '../model/SparkSqlExecKey';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './app-breadcrumb.component.html'
})
export class AppBreadcrumbComponent {

  @Input()
  clusterName: string|undefined;

  @Input()
  sparkAppName: string|undefined;

  @Input()
  execId: number|undefined;

  @Input()
  jobId: number|undefined;

  @Input()
  set sparkAppKey(p: SparkAppKey | undefined) {
    if (p) {
      this.clusterName = p.clusterName;
      this.sparkAppName = p.sparkAppName;
    } else {
      this.clusterName = undefined;
      this.sparkAppName = undefined;
    }
  }

  @Input()
  set sparkSqlKey(p: SparkSqlExecKey | undefined) {
    if (p) {
      this.sparkAppKey = p.sparkAppKey;
      this.execId = p.execId;
    } else {
      this.sparkAppKey = undefined;
      this.execId = undefined;
    }
  }

}
