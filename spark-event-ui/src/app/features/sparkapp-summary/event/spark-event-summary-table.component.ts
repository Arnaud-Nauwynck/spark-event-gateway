import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ColDef, GridApi, GridOptions, GridReadyEvent, IRowNode, RowSelectedEvent, SelectionChangedEvent} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular';

import {SparkAppKey} from '../../../model/SparkAppKey';
import {SparkEventSummaryFilter} from '../../../model/summary/SparkEventSummaryFilter';
import {SparkEventSummaryComponent} from './spark-event-summary.component';
import {LabelCheckboxComponent} from '../../../shared/label-checkbox/label-checkbox.component';
import {SparkEventSummary, SparkSQLExecutionEventSummary, SparkTopLevelJobExecEventSummary} from '../../../model/summary/SparkEventSummary';


@Component({
  selector: 'app-spark-event-summary-table',
  imports: [AgGridAngular, FormsModule, //
    LabelCheckboxComponent,
    SparkEventSummaryComponent,
    // SparkEventSummaryDetailComponent
  ],
  templateUrl: './spark-event-summary-table.component.html',
})
export class SparkEventSummaryTableComponent {

  @Input()
  sparkAppKey!: SparkAppKey;

  @Input()
  items: SparkEventSummary[] = [];

  @Input()
  filter: SparkEventSummaryFilter|undefined;


  gridApi!: GridApi<SparkEventSummary>;

  gridOptions: GridOptions<SparkEventSummary> = {
      isExternalFilterPresent: () => true,
      doesExternalFilterPass: (params: IRowNode<SparkEventSummary>) => this.doesExternalFilterPass(params),
      // rowSelection: 'single',
      onRowSelected: (event) => this.onRowSelectedEvent(event),
      onSelectionChanged: event => this.onSelectionChanged(event),
      defaultColDef: {
			resizable: true,
			sortable: true,
		}
  };

  columnDefs: ColDef<SparkEventSummary>[] = this.createColDefs();

  selected: SparkEventSummary | null = null;

  leftWidth: number = 900;


  constructor() {
  }

  createColDefs(): ColDef<SparkEventSummary>[] {
      return [
        { headerName: 'type',
          valueGetter: p=> p.data?.displayType,
          width: 100,
        },
        { headerName: 'duration',
          valueGetter: p=> p.data?.durationOpt,
          width: 80,
        },
        { headerName: 'Time',
          valueGetter: p=> {
            const tOpt = p.data?.timeOpt;
            return (tOpt)? new Date(tOpt).toLocaleTimeString() : undefined;
          },
          width: 100,
        },
        { headerName: 'Description',
          valueGetter: p=> p.data?.descriptionText,
          width: 100,
        },
        { headerName: 'CallSite Short',
          valueGetter: p=> {
            const event = p.data!;
            const type = event.getType();
            switch (type) {
              case 'SQLExec':
                return (event as SparkSQLExecutionEventSummary).callSite.shortMessage;
              case 'TopLevelJobExec':
                return (event as SparkTopLevelJobExecEventSummary).callSite.shortMessage;
              default: return undefined;
            }
          },
          width: 180,
        },
      ];
  }

  // --------------------------------------------------------------------------

  onGridReady(event: GridReadyEvent<SparkEventSummary>) {
    this.gridApi = event.api;
    try {
      this.gridApi.sizeColumnsToFit();
    } catch (e) {
      // silent
    }
  }

  doesExternalFilterPass(node: IRowNode<SparkEventSummary>): boolean {
    const data = node.data!;
    const filter = this.filter;
    if (!filter) {
      return true;
    }
    return filter.accept(data);
  }

  reEvalFilterChange() {
    this.gridApi.onFilterChanged();
  }


  onRowSelectedEvent(event: RowSelectedEvent<SparkEventSummary>) {
		// console.log("onRowSelectedEvent", event);
  }

	onSelectionChanged(event: SelectionChangedEvent<SparkEventSummary>): void {
		let selRows = this.gridApi.getSelectedRows();
	  	if (selRows && selRows.length === 1) {
			this.selected = selRows[0]!
		} else {
			this.selected = null;
		}
	}

}
