import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRowNode,
  RowSelectedEvent,
  SelectionChangedEvent
} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular';
import {SparkEvent} from '../../model/sparkevents/SparkEvent';
import {SparkEventFilter} from '../../model/SparkEventFilter';

import {SparkEventDetailComponent} from './SparkEventDetail.component';
import {SparkEventFilterComponent} from './SparkEventFilter.component';
import {RouterLink} from '@angular/router';

export interface SparkEventRow {
  event: SparkEvent;
}

@Component({
  selector: 'app-spark-events-table',
  imports: [AgGridAngular, FormsModule,
    SparkEventDetailComponent, SparkEventFilterComponent, RouterLink
  ],
  templateUrl: './spark-events-table.component.html',
})
export class SparkEventsTableComponent {

  @Input()
  sparkEvents: SparkEventRow[] = [];

  @Input()
  sparkEventFilter: SparkEventFilter|undefined


  gridApi!: GridApi<SparkEventRow>;

  gridOptions: GridOptions<SparkEventRow> = {
      isExternalFilterPresent: () => true,
      doesExternalFilterPass: (params: IRowNode<SparkEventRow>) => this.doesExternalFilterPass(params),
      // rowSelection: 'single',
      onRowSelected: (event) => this.onRowSelectedEvent(event),
      onSelectionChanged: event => this.onSelectionChanged(event),
      defaultColDef: {
			resizable: true,
			sortable: true,
		}
  };

  columnDefs: ColDef<SparkEventRow>[] = this.createColDefs();

  eventDetailText = 'test..\n..\n';

  selectedEvent: SparkEvent | null = null;

  leftWidth: number = 900;
  private dragging: boolean = false;
  private startX: number = 0;
  private startLeftWidth: number = 0;


  constructor() {
  }

  createColDefs(): ColDef<SparkEventRow>[] {
      return [
              { headerName: 'Event',
                valueGetter: p=> {
                  return p.data?.event.eventShortname
                }, width: 250, },

              { headerName: 'Time',
                valueGetter: p=> p.data?.event.timeOpt, width: 120, },

              { headerName: 'SqlId', valueGetter: p=> p.data?.event.sqlExecIdOpt, width: 120, },
              { headerName: 'Job', valueGetter: p=> p.data?.event.jobIdOpt, width: 65, },
              { headerName: 'Stg', valueGetter: p=> p.data?.event.stageIdOpt, width: 65, },
              { headerName: 'S.Att', valueGetter: p=> p.data?.event.stageAttemptIdOpt, width: 65, },
              { headerName: 'Task', valueGetter: p=> p.data?.event.taskIdOpt, width: 65, },
              { headerName: 'T.Index', valueGetter: p=> p.data?.event.taskIndexOpt, width: 65, },
              { headerName: 'T.Att', valueGetter: p=> p.data?.event.taskAttemptIdOpt, width: 65, },
              { headerName: 'Executor', valueGetter: p=> p.data?.event.executorIdOpt, width: 65, },

              { headerName: 'Summary', valueGetter: p=> p.data?.event.displaySummary, width: 400, },
              ];
  }

  // --------------------------------------------------------------------------

  onGridReady(event: GridReadyEvent<SparkEventRow>) {
    this.gridApi = event.api;
    try {
      this.gridApi.sizeColumnsToFit();
    } catch (e) {
      // silent
    }
  }

  doesExternalFilterPass(node: IRowNode<SparkEventRow>): boolean {
    const filter = this.sparkEventFilter;
    if (!filter) {
      return true;
    }
    const evt = node.data?.event;
    if (!evt) {
      return false;
    }
    return filter.accept(evt);
  }

  reevalFilterChange() {
    this.gridApi.onFilterChanged();
  }


  onRowSelectedEvent(event: RowSelectedEvent<SparkEventRow>) {
		// console.log("onRowSelectedEvent", event);
  }

	onSelectionChanged(event: SelectionChangedEvent<SparkEventRow>): void {
		// console.log("onSelectionChanged", event);
		// let sparkEvent = event.data!.event;
		// this.eventDetailText = sparkEvent.displaySummary;

		let selRows = this.gridApi.getSelectedRows();
	  	if (selRows && selRows.length === 1) {
			let sparkEvent: SparkEvent = selRows[0].event!;
			this.eventDetailText = sparkEvent.displaySummary;
			this.selectedEvent = sparkEvent;

			// console.log('sparkEvent', sparkEvent);
		} else {
			this.eventDetailText = '';
			this.selectedEvent = null;
		}
	}

  startDrag(e: MouseEvent) {
    e.preventDefault();
    this.dragging = true;
    this.startX = e.clientX;
    this.startLeftWidth = this.leftWidth;
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.stopDrag);
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.startX;
    const newWidth = this.startLeftWidth + dx;
    this.leftWidth = Math.max(200, Math.min(newWidth, window.innerWidth - 300)); // limites
    try {
      if (this.gridApi) {
        this.gridApi.sizeColumnsToFit();
      }
    } catch (err) {
      // silent
    }
  }

  private stopDrag = (_e: MouseEvent) => {
    if (!this.dragging) return;
    this.dragging = false;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.stopDrag);
  }
}
