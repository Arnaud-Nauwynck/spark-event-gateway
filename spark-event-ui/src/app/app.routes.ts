import { Routes } from '@angular/router';
import { SparkEventsComponent } from "./features/spark-events/SparkEvents.component";
import {SparkSqlPlanPageComponent} from './features/sql/spark-plan/SparkSqlPlanPage.component';
import {SparkEventPlanPageComponent} from './features/sql/spark-plan/SparkEventPlanPage.component';


export const ROUTES: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: SparkEventsComponent },
  { path: 'sql/:sqlId/spark-plan', component: SparkSqlPlanPageComponent},
  { path: 'event/:eventNum/spark-plan', component: SparkEventPlanPageComponent},
];
