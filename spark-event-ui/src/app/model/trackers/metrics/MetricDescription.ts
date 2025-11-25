export type EnumMetricType = 'sum' | 'size' | 'timing' | 'nsTiming';

export type EnumMetricUnit = 'bytes' | 'records' | 'partitions' | 'blocks' | 'files' | 'batches' |
  'count' | 'millis' | 'unit?';

/**
 * Abstract class representing a metric type in Spark's event UI.
 */
export class MetricDescription {

  readonly name: string;
  readonly type: EnumMetricType;
  readonly unit: EnumMetricUnit;

  constructor(name: string, type: EnumMetricType, unit: EnumMetricUnit) {
    this.name = name;
    this.type = type;
    this.unit = unit;
  }

}



export class GenericMetricDescription extends MetricDescription {
  constructor(name: string, type: EnumMetricType) {
    super(name, type, 'unit?');
  }
}
