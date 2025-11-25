import {Routes} from '@angular/router';

import {SparkSqlPlanPage} from './routes/sql/spark-sql-plan-page';
import {SparkEventPlanPage} from './routes/sql/spark-event-plan-page';
import {SparkEventDetailPage} from './routes/event/spark-event-detail-page';
import {SparkSqlPage} from './routes/sql/spark-sql-page';
import {AllSparkEventsPage} from './routes/event/all-spark-events-page';


export const ROUTES: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },

  { path: 'events', component: AllSparkEventsPage },
  { path: 'event/:eventNum', component: SparkEventDetailPage },
  { path: 'event/:eventNum/spark-plan', component: SparkEventPlanPage},

  { path: 'sql/:sqlId/spark-plan', component: SparkSqlPlanPage},
  { path: 'sql/:sqlId', component: SparkSqlPage},
  { path: 'sql/:sqlId/up-to-event/:upToEventNum', component: SparkSqlPage},
];
