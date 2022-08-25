import { Routes } from '@angular/router';

import { SparkEventsComponent } from './features/spark-events/SparkEvents.component';


export const ROUTES: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: SparkEventsComponent },
];
