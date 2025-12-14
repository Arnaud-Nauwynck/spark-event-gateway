
export class JobResult {

  // @JsonProperty("Result")
  result: string;

  constructor(result: string) {
    this.result = result;
  }
  
  static fromJson(src: any): JobResult {
    let result = <string> src['Result'];
    return new JobResult(result);
  }
  
  static createDefault(): JobResult {
    let result = '?';
    return new JobResult(result);
  }

  getDisplaySummary(): string {
    return this.result;
  }

}
