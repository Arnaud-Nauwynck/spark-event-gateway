import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  ColDef,
  DateFilterModule,
  ExternalFilterModule,
  GridApi,
  GridOptions,
  IDateFilterParams,
  IRowNode,
  NumberFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

// import {
//   ColumnMenuModule,
//   ColumnsToolPanelModule,
//   ContextMenuModule,
//   SetFilterModule,
// } from "ag-grid-enterprise";import { IOlympicData } from "./interfaces";

// ModuleRegistry.registerModules([
//   // AllCommunityModule,
//   ExternalFilterModule,
//   ClientSideRowModelModule,
//   // ColumnsToolPanelModule,
//   // ColumnMenuModule,
//   // ContextMenuModule,
//   // SetFilterModule,
//   NumberFilterModule,
//   DateFilterModule,
//   // ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
// ]);

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
