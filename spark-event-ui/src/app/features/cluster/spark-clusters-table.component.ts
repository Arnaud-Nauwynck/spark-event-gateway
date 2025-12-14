import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ColDef, GridApi, GridOptions, GridReadyEvent, IRowNode, RowSelectedEvent, SelectionChangedEvent} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular';

import {RouterLink} from '@angular/router';
import {SparkCluster} from '../../model/summary/SparkCluster';
import {SparkClusterFilter} from '../../model/summary/SparkClusterFilter';


@Component({
  selector: 'app-spark-clusters-table',
  imports: [AgGridAngular, FormsModule, RouterLink,
    // SparkClusterDetailComponent
  ],
  templateUrl: './spark-clusters-table.component.html',
})
export class SparkClustersTableComponent {

  @Input()
  sparkClusters: SparkCluster[] = [];

  @Input()
  sparkClusterFilter: SparkClusterFilter|undefined;


  gridApi!: GridApi<SparkCluster>;

  gridOptions: GridOptions<SparkCluster> = {
      isExternalFilterPresent: () => true,
      doesExternalFilterPass: (params: IRowNode<SparkCluster>) => this.doesExternalFilterPass(params),
      // rowSelection: 'single',
      onRowSelected: (event) => this.onRowSelectedEvent(event),
      onSelectionChanged: event => this.onSelectionChanged(event),
      defaultColDef: {
			resizable: true,
			sortable: true,
		}
  };

  columnDefs: ColDef<SparkCluster>[] = this.createColDefs();

  selected: SparkCluster | null = null;

  leftWidth: number = 900;


  constructor() {
  }

  createColDefs(): ColDef<SparkCluster>[] {
      return [
              { headerName: 'name',
                valueGetter: p=> {
                  const res = p.data?.clusterName;
                  console.log('cluster name', res);
                  return res;
                },
                width: 100,
              },
              ];
  }

  // --------------------------------------------------------------------------

  onGridReady(event: GridReadyEvent<SparkCluster>) {
    this.gridApi = event.api;
    try {
      this.gridApi.sizeColumnsToFit();
    } catch (e) {
      // silent
    }
  }

  doesExternalFilterPass(node: IRowNode<SparkCluster>): boolean {
    const filter = this.sparkClusterFilter;
    if (!filter) {
      return true;
    }
    const data = node.data!;
    return filter.accept(data);
  }

  reEvalFilterChange() {
    this.gridApi.onFilterChanged();
  }


  onRowSelectedEvent(event: RowSelectedEvent<SparkCluster>) {
		// console.log("onRowSelectedEvent", event);
  }

	onSelectionChanged(event: SelectionChangedEvent<SparkCluster>): void {
		let selRows = this.gridApi.getSelectedRows();
	  	if (selRows && selRows.length === 1) {
			this.selected = selRows[0]!
		} else {
			this.selected = null;
		}
	}

}
