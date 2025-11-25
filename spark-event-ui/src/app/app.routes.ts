import { Routes } from '@angular/router';
import { SparkEventsTableComponent } from "./features/spark-events/spark-events-table.component";
import {SparkSqlPlanPageComponent} from './features/sql/spark-plan/SparkSqlPlanPage.component';
import {SparkEventPlanPageComponent} from './features/sql/spark-plan/SparkEventPlanPage.component';
import {SparkEventDetailPageComponent} from './features/spark-events/SparkEventDetailPage.component';
import {SparkSqlPageComponent} from './features/sql/SparkSqlPage.component';


export const ROUTES: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },

  { path: 'events', component: SparkEventsTableComponent },
  { path: 'event/:eventNum', component: SparkEventDetailPageComponent },
  { path: 'event/:eventNum/spark-plan', component: SparkEventPlanPageComponent},

  { path: 'sql/:sqlId/spark-plan', component: SparkSqlPlanPageComponent},
  { path: 'sql/:sqlId', component: SparkSqlPageComponent},
  { path: 'sql/:sqlId/up-to-event/:upToEventNum', component: SparkSqlPageComponent},
];
