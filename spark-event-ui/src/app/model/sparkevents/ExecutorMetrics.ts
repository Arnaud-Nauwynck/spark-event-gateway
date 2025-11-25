
export class ExecutorMetrics extends Map<String,any> {

  static fromJson(src: any): ExecutorMetrics {
    if (!src) return new ExecutorMetrics();
    return new ExecutorMetrics(Object.entries(src));
  }

  static fromJsonArray(src: any[]): ExecutorMetrics[] {
    return src.map(x => ExecutorMetrics.fromJson(x));
  }

  static createDefault(): ExecutorMetrics {
    return new ExecutorMetrics(new Map());
  }

}
