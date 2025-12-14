import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {ColDef, GridApi, GridOptions, GridReadyEvent, IRowNode, RowSelectedEvent, SelectionChangedEvent} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular';
import {SparkSqlSummaryComponent} from './spark-sql-summary.component';
import {AppBreadcrumbComponent} from '../../../shared/app-breadcrumb.component';
import {SparkAppKey} from '../../../model/SparkAppKey';
import SparkSQLExecutionEventSummary from '../../../model/summary/SparkEventSummary';
import {SparkEventSummaryFilter} from '../../../model/summary/SparkEventSummaryFilter';
import {SparkSqlExecKey} from '../../../model/SparkSqlExecKey';


@Component({
  selector: 'app-spark-sql-summary-table',
  imports: [
    AgGridAngular, FormsModule, RouterLink, //
    AppBreadcrumbComponent,
    SparkSqlSummaryComponent,
  ],
  templateUrl: './spark-sql-summary-table.component.html',
  standalone: true
})
export class SparkSqlSummaryTableComponent {

  @Input()
  showBreadCrumb = false;

  @Input()
  sparkAppKey!: SparkAppKey;

  @Input()
  items: SparkSQLExecutionEventSummary[] = [];

  @Input()
  filter: SparkEventSummaryFilter|undefined;

  @Input()
  showLinkAsNthLongest = false;

  @Input()
  heightStyle = '300px';

  gridApi!: GridApi<SparkSQLExecutionEventSummary>;

  gridOptions: GridOptions<SparkSQLExecutionEventSummary> = {
      isExternalFilterPresent: () => true,
      doesExternalFilterPass: (params: IRowNode<SparkSQLExecutionEventSummary>) => this.doesExternalFilterPass(params),
      // rowSelection: 'single',
      onRowSelected: (event) => this.onRowSelectedEvent(event),
      onSelectionChanged: event => this.onSelectionChanged(event),
      defaultColDef: {
			resizable: true,
			sortable: true,
		}
  };

  columnDefs: ColDef<SparkSQLExecutionEventSummary>[] = this.createColDefs();

  selected: SparkSQLExecutionEventSummary | null = null;
  selectedIndex: number= 0;
  get selectedSparkSqlKey(): SparkSqlExecKey|null {
    return (this.selected)? new SparkSqlExecKey(this.sparkAppKey, this.selected.execId) : null;
  }

  leftWidth: number = 900;


  constructor() {
  }

  createColDefs(): ColDef<SparkSQLExecutionEventSummary>[] {
      return [
        { headerName: 'Sql Id',
          valueGetter: p=> p.data?.execId,
          width: 50,
        },
        { headerName: 'Duration',
          valueGetter: p=> (<number> p.data?.duration / 1000),
          width: 70,
        },
        { headerName: 'Start Time',
          valueGetter: p=> new Date(p.data!.startTime).toLocaleTimeString(),
          width: 80,
        },

        { headerName: 'CallSite Short',
          valueGetter: p=> p.data!.callSite.shortMessage,
          width: 180,
        },
        { headerName: 'CallSite Long',
          valueGetter: p=> p.data!.callSite.longMessage,
          width: 150,
        },

        { headerName: 'physicalPlanDescription',
          valueGetter: p=> p.data?.physicalPlanDescription.text,
          width: 100,
          hide: true
        },

        { headerName: 'End Event Num',
          valueGetter: p=> p.data?.endEventNum,
          width: 100,
          hide: true
        },
        { headerName: 'ErrorMessage',
          valueGetter: p=> p.data?.endErrorMessage,
          width: 50,
        },

    // readonly lastSQLAdaptiveExecutionUpdateEvent?: unknown;
    // readonly plan: SparkPlanInfoSummary;

      ];
  }

  // --------------------------------------------------------------------------

  onGridReady(event: GridReadyEvent<SparkSQLExecutionEventSummary>) {
    this.gridApi = event.api;
    try {
      this.gridApi.sizeColumnsToFit();
    } catch (e) {
      // silent
    }
  }

  doesExternalFilterPass(node: IRowNode<SparkSQLExecutionEventSummary>): boolean {
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


  onRowSelectedEvent(event: RowSelectedEvent<SparkSQLExecutionEventSummary>) {
		// console.log("onRowSelectedEvent", event);
  }

	onSelectionChanged(event: SelectionChangedEvent<SparkSQLExecutionEventSummary>): void {
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
