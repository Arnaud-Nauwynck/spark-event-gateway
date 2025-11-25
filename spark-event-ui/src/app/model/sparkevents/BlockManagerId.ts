
export class BlockManagerId {
    
  // @JsonProperty("Executor ID")
  readonly executorId: string;
  
  // @JsonProperty("Host")
  readonly host: string;
  
  // @JsonProperty("Port")
  readonly port: number;

  constructor(executorId: string, host: string, port: number) {
    this.executorId = executorId;
    this.host = host;
    this.port = port;
  }
  
  static fromJson(src: any): BlockManagerId {
    let executorId = <string> src['Executor ID'];
    let host = <string> src['Host'];
    let port = <number> src['Port'];
    return new BlockManagerId(executorId, host, port);
  }

  static createDefault(): BlockManagerId {
    return new BlockManagerId('', '', 0);
  }

}
