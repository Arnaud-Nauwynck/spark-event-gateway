import { Component } from '@angular/core';
import { GridOptions, ColDef, GridApi, GridReadyEvent, RowNode } from 'ag-grid-community';

import { SparkApiService } from '../../services/SparkApiService';
import { SparkEvent } from '../../model/SparkEvent';

interface SparkEventRow {
  event: SparkEvent;
}

@Component({
  selector: 'app-spark-events',
  templateUrl: './SparkEvents.component.html'
})
export class SparkEventsComponent {
  
  gridApi!: GridApi<SparkEventRow>;

  gridOptions: GridOptions<SparkEventRow> = {
      isExternalFilterPresent: () => true,
      doesExternalFilterPass: (params) => this.doesExternalFilterPass(params),
  };

  rowData: SparkEventRow[] = [];
  columnDefs: ColDef[] = this.createColDefs();

  constructor(private apiService: SparkApiService) {
    this.apiService.listEvents().subscribe(data => {
      console.log('Loaded spark events: ' + data.length);
      this.rowData = data.map(x => { return { event: x }; });
    });
  }
  
  createColDefs(): ColDef[] {
      return [
              { headerName: 'Event', field: 'event.eventShortname', width: 250, },
              
              { headerName: 'Time', field: 'event.timeOpt', width: 120, },
              
              { headerName: 'Job', field: 'event.jobIdOpt', width: 65, },
              { headerName: 'Stg', field: 'event.stageIdOpt', width: 65, },
              { headerName: 'S.Att', field: 'event.stageAttemptIdOpt', width: 65, },
              { headerName: 'Task', field: 'event.taskIdOpt', width: 65, },
              { headerName: 'T.Att', field: 'event.taskAttemptIdOpt', width: 65, },
              { headerName: 'Exec', field: 'event.executorIdOpt', width: 65, },
              { headerName: 'SQL Exec Id', field: 'event.sqlExecIdOpt', width: 120, },
              
              { headerName: 'Summary', field: 'event.displaySummary', width: 400, },
              ];
  }

  // --------------------------------------------------------------------------

  onGridReady(event: GridReadyEvent<SparkEventRow>) {
    this.gridApi = event.api;
    // params.api.sizeColumnsToFit();
  }
  
  doesExternalFilterPass(node: RowNode<SparkEventRow>): boolean {
    return true;
  }

  reevalFilterChange() {
    this.gridApi.onFilterChanged();   
  }
  
}