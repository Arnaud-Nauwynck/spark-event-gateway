import {TaskMetrics as TaskMetricsDTO} from '../../rest';
import {ColDef} from 'ag-grid-community';

export class TaskMetricsAgGridColDefs {

  static taskMetricsColDefs<TSource>(extractFunc: (src: TSource) => TaskMetricsDTO): ColDef<TSource>[] {
    return [
      {
        headerName: 'Deserialize Time',
        valueGetter: p => extractFunc(p.data!)['Executor Deserialize Time'],
        width: 70,
        hide: true
      },
      {
        headerName: 'Deserialize CPU Time',
        valueGetter: p => extractFunc(p.data!)['Executor Deserialize CPU Time'],
        width: 70,
        hide: true
      },
      {
        headerName: 'Executor Run Time',
        valueGetter: p => extractFunc(p.data!)['Executor Run Time'],
        width: 70
      },
      {
        headerName: 'Executor CPU Time',
        valueGetter: p => extractFunc(p.data!)['Executor CPU Time'],
        width: 70,
        hide: true
      },
      {
        headerName: 'Result Size',
        valueGetter: p => extractFunc(p.data!)['Result Size'],
        width: 70,
        hide: true
      },
      {
        headerName: 'JVM GC Time',
        valueGetter: p => extractFunc(p.data!)['JVM GC Time'],
        width: 70,
        hide: true
      },
      {
        headerName: 'Result Serialization Time',
        valueGetter: p => extractFunc(p.data!)['Result Serialization Time'],
        width: 70,
        hide: true
      },
      {
        headerName: 'Memory Bytes Spilled',
        valueGetter: p => extractFunc(p.data!)['Memory Bytes Spilled'],
        width: 70,
        hide: true
      },
      {
        headerName: 'Disk Bytes Spilled',
        valueGetter: p => extractFunc(p.data!)['Disk Bytes Spilled'],
        width: 70
      },
      {
        headerName: 'Peak Execution Memory',
        valueGetter: p => extractFunc(p.data!)['Peak Execution Memory'],
        width: 70,
        hide: true
      },
      {
        headerName: 'Bytes Read',
        valueGetter: p => extractFunc(p.data!)['Input Metrics']?.['Bytes Read'],
        width: 70
      },
      {
        headerName: 'Records Read',
        valueGetter: p => extractFunc(p.data!)['Input Metrics']?.['Records Read'],
        width: 70
      },
      {
        headerName: 'Bytes Written',
        valueGetter: p => extractFunc(p.data!)['Output Metrics']?.['Bytes Written'],
        width: 70
      },
      {
        headerName: 'Records Written',
        valueGetter: p => extractFunc(p.data!)['Output Metrics']?.['Records Written'],
        width: 70
      },
      // {
      //   headerName: 'Shuffle Read',
      //   valueGetter: p => extractFunc(p.data!)['Shuffle Read Metrics'],
      //   width: 70
      // },
      // {
      //   headerName: 'Shuffle Write',
      //   valueGetter: p => extractFunc(p.data!)['Shuffle Write Metrics'],
      //   width: 70
      // },
      // {
      //   headerName: 'Updated Blocks',
      //   valueGetter: p => extractFunc(p.data!)['Updated Blocks'],
      //   width: 70
      // },

    ];
  }

}
