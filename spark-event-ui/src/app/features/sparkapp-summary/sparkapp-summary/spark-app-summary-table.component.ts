import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {ColDef, GridApi, GridOptions, GridReadyEvent, IRowNode, RowSelectedEvent, SelectionChangedEvent} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular';

import {SparkAppMetricsDTO} from '../../../rest';
import {SparkAppSummary} from '../../../model/summary/SparkAppSummary';
import {SparkAppSummaryFilter} from '../../../model/summary/SparkAppSummaryFilter';
import {TaskMetricsAgGridColDefs} from '../../task/TaskMetricsAgGridColDefs';
import {SparkAppSummaryComponent} from './spark-app-summary.component';


@Component({
  selector: 'app-spark-app-summary-table',
  imports: [AgGridAngular, FormsModule, RouterLink,
    SparkAppSummaryComponent
  ],
  templateUrl: './spark-app-summary-table.component.html',
  standalone: true
})
export class SparkAppSummaryTableComponent {

  @Input()
  sparkAppSummaries: SparkAppSummary[] = [];

  @Input()
  sparkAppSummaryFilter: SparkAppSummaryFilter|undefined;


  gridApi!: GridApi<SparkAppSummary>;

  gridOptions: GridOptions<SparkAppSummary> = {
      isExternalFilterPresent: () => true,
      doesExternalFilterPass: (params: IRowNode<SparkAppSummary>) => this.doesExternalFilterPass(params),
      // rowSelection: 'single',
      onRowSelected: (event) => this.onRowSelectedEvent(event),
      onSelectionChanged: event => this.onSelectionChanged(event),
      defaultColDef: {
			resizable: true,
			sortable: true,
		}
  };

  columnDefs: ColDef<SparkAppSummary>[] = this.createColDefs();

  selected: SparkAppSummary | null = null;

  leftWidth: number = 900;


  constructor() {
  }

  createColDefs(): ColDef<SparkAppSummary>[] {
      return [
        { headerName: 'cluster',
          valueGetter: p=> p.data?.clusterName,
          width: 100,
        },
        { headerName: 'appName',
          valueGetter: p=> p.data?.sparkAppName,
          width: 150,
        },

        // Infos from sparkAppConfig
        { headerName: 'sparkVersion',
          valueGetter: p=> p.data?.sparkAppConfig.sparkVersion,
          width: 70,
          hide: true,
        },
        { headerName: 'javaVersion',
          valueGetter: p=> p.data?.sparkAppConfig.javaVersion,
          width: 70,
          hide: true,
        },
        { headerName: 'scalaVersion',
          valueGetter: p=> p.data?.sparkAppConfig.scalaVersion,
          width: 70,
          hide: true,
        },
        { headerName: 'javaHome',
          valueGetter: p=> p.data?.sparkAppConfig.javaHome,
          width: 120,
          hide: true,
        },
        // jvmInformation?: { [key: string]: string; };
        // sparkProperties?: { [key: string]: string; };
        // hadoopProperties?: { [key: string]: string; };
        // systemProperties?: { [key: string]: string; };
        // classpathEntries?: { [key: string]: string; };
        // metricsProperties?: { [key: string]: string; };
        // otherEnvironmentDetails?: { [key: string]: { [key: string]: string; }; };
        { headerName: 'Exec Core',
          valueGetter: p=> p.data?.sparkAppConfig.executorCore,
          width: 70,
        },
        // ???? coresPerExecutor
        { headerName: 'Exec Mem MB',
          valueGetter: p=> p.data?.sparkAppConfig.memoryPerExecutorMB,
          width: 80,
        },
        { headerName: 'defaultCpusPerTask',
          valueGetter: p=> p.data?.sparkAppConfig.defaultCpusPerTask,
          width: 70,
          hide: true,
        },
        { headerName: 'coresGranted',
          valueGetter: p=> p.data?.sparkAppConfig.coresGranted,
          width: 70,
          hide: true,
        },
        { headerName: 'maxCores',
          valueGetter: p=> p.data?.sparkAppConfig.maxCores,
          width: 70,
          hide: true,
        },

        // Infos from appMetrics
        ...SparkAppSummaryTableComponent.appMetricsColDefs<SparkAppSummary>(s => s.appMetrics),
        // Infos from totalTaskMetrics
        // ...TaskMetricsAgGridColDefs.appMetricsColDefs<SparkAppSummary>(s => s.appMetrics.totalTaskMetrics),


      ];
  }

  static appMetricsColDefs<TSource>(extractFunc: (src: TSource) => SparkAppMetricsDTO): ColDef<TSource>[] {
    return [
      { headerName: 'Invalid',
        valueGetter: p=> extractFunc(p.data!).invalidEvent,
        width: 70,
        hide: true
      },
      { headerName: 'LogStart',
        valueGetter: p=> extractFunc(p.data!).logStart,
        width: 70,
        hide: true
      },
      { headerName: 'AppStart',
        valueGetter: p=> extractFunc(p.data!).applicationStart,
        width: 70,
        hide: true
      },
      { headerName: 'AppEnd',
        valueGetter: p=> extractFunc(p.data!).applicationStart,
        width: 70,
        hide: true
      },
      { headerName: 'resourceProfileAdded',
        valueGetter: p=> extractFunc(p.data!).resourceProfileAdded,
        width: 70,
        hide: true
      },
      { headerName: 'environmentUpdate',
        valueGetter: p=> extractFunc(p.data!).environmentUpdate,
        width: 70,
        hide: true
      },
      { headerName: 'blockManagerRemoved',
        valueGetter: p=> extractFunc(p.data!).blockManagerRemoved,
        width: 70,
        hide: true
      },
      { headerName: 'blockManagerAdded',
        valueGetter: p=> extractFunc(p.data!).blockManagerAdded,
        width: 70,
        hide: true
      },
      { headerName: 'executorAdded',
        valueGetter: p=> extractFunc(p.data!).executorAdded,
        width: 70,
      },
      { headerName: 'executorRemoved',
        valueGetter: p=> extractFunc(p.data!).executorRemoved,
        width: 70,
        hide: true
      },
      { headerName: 'executorExcluded',
        valueGetter: p=> extractFunc(p.data!).executorExcluded,
        width: 70,
        hide: true
      },
      { headerName: 'executorExcludedForStage',
        valueGetter: p=> extractFunc(p.data!).executorExcludedForStage,
        width: 70,
        hide: true
      },
      { headerName: 'nodeExcludedForStage',
        valueGetter: p=> extractFunc(p.data!).nodeExcludedForStage,
        width: 70,
        hide: true
      },
      { headerName: 'executorUnexcluded',
        valueGetter: p=> extractFunc(p.data!).executorUnexcluded,
        width: 70,
        hide: true
      },
      { headerName: 'nodeExcluded',
        valueGetter: p=> extractFunc(p.data!).nodeExcluded,
        width: 70,
        hide: true
      },
      { headerName: 'nodeUnexcluded',
        valueGetter: p=> extractFunc(p.data!).nodeUnexcluded,
        width: 70,
        hide: true
      },
      { headerName: 'executorMetricsUpdate',
        valueGetter: p=> extractFunc(p.data!).executorMetricsUpdate,
        width: 70,
        hide: true
      },
      { headerName: 'sqlJobStart',
        valueGetter: p=> extractFunc(p.data!).sqlJobStart,
        width: 70,
      },
      { headerName: 'topLevelJobStart',
        valueGetter: p=> extractFunc(p.data!).topLevelJobStart,
        width: 70,
      },
      { headerName: 'sqlJobEndSucceed',
        valueGetter: p=> extractFunc(p.data!).sqlJobEndSucceed,
        width: 70,
        hide: true
      },
      { headerName: 'sqlJobEndFailed',
        valueGetter: p=> extractFunc(p.data!).sqlJobEndFailed,
        width: 70,
        hide: true
      },
      { headerName: 'topLevelJobEndSucceed',
        valueGetter: p=> extractFunc(p.data!).topLevelJobEndSucceed,
        width: 70,
        hide: true
      },
      { headerName: 'topLevelJobEndFailed',
        valueGetter: p=> extractFunc(p.data!).topLevelJobEndFailed,
        width: 70,
        hide: true
      },
      { headerName: 'stageSubmitted',
        valueGetter: p=> extractFunc(p.data!).stageSubmitted,
        width: 70,
        hide: true
      },
      { headerName: 'stageCompleted',
        valueGetter: p=> extractFunc(p.data!).stageCompleted,
        width: 70,
        hide: true
      },
      { headerName: 'stageCompletedSkip',
        valueGetter: p=> extractFunc(p.data!).stageCompletedSkip,
        width: 70,
        hide: true
      },
      { headerName: 'stageCompletedFailed',
        valueGetter: p=> extractFunc(p.data!).stageCompletedFailed,
        width: 70,
        hide: true
      },
      { headerName: 'stageCompletedPending',
        valueGetter: p=> extractFunc(p.data!).stageCompletedPending,
        width: 70,
        hide: true
      },
      { headerName: 'stageExecutorMetrics',
        valueGetter: p=> extractFunc(p.data!).stageExecutorMetrics,
        width: 70,
        hide: true
      },
      { headerName: 'taskStart',
        valueGetter: p=> extractFunc(p.data!).taskStart,
        width: 70,
        hide: true
      },
      { headerName: 'speculativeTaskSubmitted',
        valueGetter: p=> extractFunc(p.data!).speculativeTaskSubmitted,
        width: 70,
        hide: true
      },
      { headerName: 'taskGettingResult',
        valueGetter: p=> extractFunc(p.data!).taskGettingResult,
        width: 70,
        hide: true
      },
      { headerName: 'unschedulableTaskSetAdded',
        valueGetter: p=> extractFunc(p.data!).unschedulableTaskSetAdded,
        width: 70,
        hide: true
      },
      { headerName: 'unschedulableTaskSetRemoved',
        valueGetter: p=> extractFunc(p.data!).unschedulableTaskSetRemoved,
        width: 70,
        hide: true
      },
      { headerName: 'taskEnd',
        valueGetter: p=> extractFunc(p.data!).taskEnd,
        width: 70,
        hide: true
      },
      { headerName: 'unpersistRDD',
        valueGetter: p=> extractFunc(p.data!).unpersistRDD,
        width: 70,
        hide: true
      },
      { headerName: 'blockUpdated',
        valueGetter: p=> extractFunc(p.data!).blockUpdated,
        width: 70,
        hide: true
      },
      { headerName: 'sqlExecutionStart',
        valueGetter: p=> extractFunc(p.data!).sqlExecutionStart,
        width: 70,
        hide: true
      },
      { headerName: 'sqlExecutionEnd',
        valueGetter: p=> extractFunc(p.data!).sqlExecutionEnd,
        width: 70,
        hide: true
      },
      { headerName: 'sqlAdaptiveExecutionUpdate',
        valueGetter: p=> extractFunc(p.data!).sqlAdaptiveExecutionUpdate,
        width: 70,
        hide: true
      },
      { headerName: 'sqlAdaptiveMetricUpdates',
        valueGetter: p=> extractFunc(p.data!).sqlAdaptiveMetricUpdates,
        width: 70,
        hide: true
      },
      { headerName: 'sqlDriverAccumUpdates',
        valueGetter: p=> extractFunc(p.data!).sqlDriverAccumUpdates,
        width: 70,
        hide: true
      },
      { headerName: 'miscellaneousProcessAdded',
        valueGetter: p=> extractFunc(p.data!).miscellaneousProcessAdded,
        width: 70,
        hide: true
      },
      { headerName: 'otherEvent',
        valueGetter: p=> extractFunc(p.data!).otherEvent,
        width: 70,
        hide: true
      },

      // Columns from total taskMetrics
      ...TaskMetricsAgGridColDefs.taskMetricsColDefs<TSource>(s => extractFunc(s).totalTaskMetrics!),

      {
        headerName: 'spillMemoryTaskCount',
        valueGetter: p => extractFunc(p.data!).spillMemoryTaskCount,
        width: 70
      },
      {
        headerName: 'spillDiskTaskCount',
        valueGetter: p => extractFunc(p.data!).spillDiskTaskCount,
        width: 70
      },

    ];
  }

  // --------------------------------------------------------------------------

  onGridReady(event: GridReadyEvent<SparkAppSummary>) {
    this.gridApi = event.api;
    try {
      this.gridApi.sizeColumnsToFit();
    } catch (e) {
      // silent
    }
  }

  doesExternalFilterPass(node: IRowNode<SparkAppSummary>): boolean {
    const filter = this.sparkAppSummaryFilter;
    if (!filter) {
      return true;
    }
    const data = node.data!;
    return filter.accept(data);
  }

  reEvalFilterChange() {
    this.gridApi.onFilterChanged();
  }


  onRowSelectedEvent(event: RowSelectedEvent<SparkAppSummary>) {
		// console.log("onRowSelectedEvent", event);
  }

	onSelectionChanged(event: SelectionChangedEvent<SparkAppSummary>): void {
		let selRows = this.gridApi.getSelectedRows();
	  	if (selRows && selRows.length === 1) {
			this.selected = selRows[0]!
		} else {
			this.selected = null;
		}
	}

}
