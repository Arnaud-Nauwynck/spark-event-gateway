import {Routes} from '@angular/router';

import {SparkSqlPage} from './routes/sql/spark-sql-page';
import {SparkClustersTablePage} from './routes/cluster/spark-clusters-table-page.component';
import {HomePage} from './routes/shared/home-page';
import {SparkClusterPage} from './routes/cluster/spark-cluster-page';
import {SparkAppSummaryPage} from './routes/sparkapp-summary/spark-app-summary-page';
import {SparkSqlSummaryPage} from './routes/sparkapp-summary/sql/spark-sql-summary-page';
import {SparkAppLongestSqlExecsTablePage} from './routes/sparkapp-summary/sql/spark-app-longest-sql-table-page';
import {SparkAppNthLongestSqlExecPage} from './routes/sparkapp-summary/sql/spark-app-nth-longest-sql-page';
import {SparkAppNthLongestTopLevelJobExecPage} from './routes/sparkapp-summary/job/spark-app-nth-longest-job-page';
import {SparkJobSummaryPage} from './routes/sparkapp-summary/job/spark-job-summary-page';
import {SparkAppLongestTopLevelJobExecTablePage} from './routes/sparkapp-summary/job/spark-app-longest-job-table-page';
import {SparkEventSummaryTablePage} from './routes/sparkapp-summary/event/spark-event-summary-table-page';

const PATH_clusterApp = 'cluster/:clusterName/spark-app/:sparkAppName';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePage },


  { path: 'clusters', component: SparkClustersTablePage},
  { path: 'cluster/:clusterName', component: SparkClusterPage},

  { path: PATH_clusterApp + '/summary', component: SparkAppSummaryPage},

  { path: PATH_clusterApp + '/events', component: SparkEventSummaryTablePage},
  // { path: PATH_clusterApp + '/event/:eventNum', component: SparkEventDetailPage },
  // { path: PATH_clusterApp + '/event/:eventNum/spark-plan', component: SparkSqlByEventNumPlanPage},

  { path: PATH_clusterApp + '/longest-sqls', component: SparkAppLongestSqlExecsTablePage},
  { path: PATH_clusterApp + '/longest-sql/:nth', component: SparkAppNthLongestSqlExecPage},

  { path: PATH_clusterApp + '/sql/:execId', component: SparkSqlSummaryPage},
  // { path: PATH_clusterApp + '/sql/:execId/up-to-event/:upToEventNum', component: SparkSqlPage},
  { path: PATH_clusterApp + '/sql/:execId/detail', component: SparkSqlPage},

  { path: PATH_clusterApp + '/longest-jobs', component: SparkAppLongestTopLevelJobExecTablePage},
  { path: PATH_clusterApp + '/longest-job/:nth', component: SparkAppNthLongestTopLevelJobExecPage},

  { path: PATH_clusterApp + '/job/:jobId', component: SparkJobSummaryPage},


];
