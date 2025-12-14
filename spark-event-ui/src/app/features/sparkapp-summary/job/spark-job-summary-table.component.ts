import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ColDef, GridApi, GridOptions, GridReadyEvent, IRowNode, RowSelectedEvent, SelectionChangedEvent} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular';
import {RouterLink} from '@angular/router';
import {SparkJobSummaryComponent} from './spark-job-summary.component';
import {SparkAppKey} from '../../../model/SparkAppKey';
import {SparkTopLevelJobExecEventSummary} from '../../../model/summary/SparkEventSummary';
import {SparkEventSummaryFilter} from '../../../model/summary/SparkEventSummaryFilter';


@Component({
  selector: 'app-spark-job-summary-table',
  imports: [
    AgGridAngular, FormsModule, RouterLink,
    SparkJobSummaryComponent,
  ],
  templateUrl: './spark-job-summary-table.component.html',
  standalone: true
})
export class SparkJobSummaryTableComponent {

  @Input()
  sparkAppKey!: SparkAppKey;

  @Input()
  items: SparkTopLevelJobExecEventSummary[] = [];

  @Input()
  filter: SparkEventSummaryFilter|undefined;

  @Input()
  showLinkAsNthLongest = false;

  @Input()
  heightStyle = '300px';

  gridApi!: GridApi<SparkTopLevelJobExecEventSummary>;

  gridOptions: GridOptions<SparkTopLevelJobExecEventSummary> = {
      isExternalFilterPresent: () => true,
      doesExternalFilterPass: (params: IRowNode<SparkTopLevelJobExecEventSummary>) => this.doesExternalFilterPass(params),
      // rowSelection: 'single',
      onRowSelected: (event) => this.onRowSelectedEvent(event),
      onSelectionChanged: event => this.onSelectionChanged(event),
      defaultColDef: {
			resizable: true,
			sortable: true,
		}
  };

  columnDefs: ColDef<SparkTopLevelJobExecEventSummary>[] = this.createColDefs();

  selected: SparkTopLevelJobExecEventSummary | null = null;
  selectedIndex = 0;

  leftWidth: number = 900;


  constructor() {
  }

  createColDefs(): ColDef<SparkTopLevelJobExecEventSummary>[] {
      return [
        { headerName: 'Job Id',
          valueGetter: p=> p.data?.jobId,
          width: 80,
        },
        { headerName: 'duration (s)',
          valueGetter: p=> (<number> p.data?.duration / 1000),
          width: 150,
        },
        { headerName: 'Submit Time',
          valueGetter: p=> new Date(p.data!.submitTime),
          width: 100,
        },

        { headerName: 'CallSite Short',
          valueGetter: p=> p.data!.callSite.shortMessage,
          width: 180,
        },
        { headerName: 'CallSite Long',
          valueGetter: p=> p.data!.callSite.longMessage,
          width: 180,
        },

        { headerName: 'Event Num',
          valueGetter: p=> p.data?.eventNum,
          width: 100,
          hide: true
        },

      ];
  }

  // --------------------------------------------------------------------------

  onGridReady(event: GridReadyEvent<SparkTopLevelJobExecEventSummary>) {
    this.gridApi = event.api;
    try {
      this.gridApi.sizeColumnsToFit();
    } catch (e) {
      // silent
    }
  }

  doesExternalFilterPass(node: IRowNode<SparkTopLevelJobExecEventSummary>): boolean {
    const filter = this.filter;
    if (!filter) {
      return true;
    }
    const data = node.data!;
    return filter.accept(data);
  }

  reEvalFilterChange() {
    this.gridApi.onFilterChanged();
  }


  onRowSelectedEvent(event: RowSelectedEvent<SparkTopLevelJobExecEventSummary>) {
		// console.log("onRowSelectedEvent", event);
  }

	onSelectionChanged(event: SelectionChangedEvent<SparkTopLevelJobExecEventSummary>): void {
		let selRows = this.gridApi.getSelectedRows();
	  	if (selRows && selRows.length === 1) {
			this.selected = selRows[0]!;
      this.selectedIndex = this.items.indexOf(this.selected);
		} else {
			this.selected = null;
      this.selectedIndex = 0;
		}
	}

}
