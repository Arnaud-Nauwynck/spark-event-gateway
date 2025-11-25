
export class SQLPlanMetric extends Map<string,any> { // TODO

  static fromJson(src: any): SQLPlanMetric {
    return new SQLPlanMetric(Object.entries(src));
  }

  static fromJsonArray(src: any[]): SQLPlanMetric[] {
    return src.map(x => SQLPlanMetric.fromJson(x));
  }

}
