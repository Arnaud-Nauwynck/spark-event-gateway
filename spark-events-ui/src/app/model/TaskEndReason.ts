
export class TaskEndReason {

  // @JsonProperty("Reason")
  readonly reason: string;

  constructor(reason: string) {
   this.reason = reason; 
  }
  
  static fromJson(src: any): TaskEndReason {
    let reason = <string> src['Reason'];
    return new TaskEndReason(reason);
  }

  static createDefault(): TaskEndReason {
    return new TaskEndReason('');
  }
}
