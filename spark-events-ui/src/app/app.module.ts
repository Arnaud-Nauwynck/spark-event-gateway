import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DECLARE_features_components } from './features/featureComponents';
import { SparkApiService } from './services/SparkApiService';

@NgModule({
  declarations: [
    AppComponent,
    ...DECLARE_features_components
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    AgGridModule,
    AppRoutingModule,
  ],
  providers: [
              SparkApiService,
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
