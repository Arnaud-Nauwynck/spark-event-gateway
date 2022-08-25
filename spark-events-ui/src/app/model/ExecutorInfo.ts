
/**
 * 
 */
export class LogUrls {
  stdout: string;
  stderr: string;

  constructor(stdout: string, stderr: string) {
    this.stdout = stdout;
    this.stderr = stderr;
  }

  static fromJson(src: any): LogUrls {
    let stdout = <string> src['stdout'];
    let stderr = <string> src['stderr'];
    return new LogUrls(stdout, stderr);
  }

  static createDefault(): LogUrls {
    return new LogUrls('', '');
  }

}

/**
 * 
 */
export class ExecutorInfo {

  // @JsonProperty("Host")
  host: string;

  // @JsonProperty("Total Cores")
  totalCores: number;

  // @JsonProperty("Log Urls")
  logUrls: LogUrls;

  // @JsonProperty("Attributes")
  attributes: Map<string,string>;

  // @JsonProperty("Resources")
  resources: Map<string,string>;

  // @JsonProperty("Resource Profile Id")
  resourceProfileId: number;

  constructor(host: string, totalCores: number,
      logUrls: LogUrls, attributes: Map<string,string>, resources: Map<string,string>, resourceProfileId: number) {
    this.host = host;
    this.totalCores = totalCores;
    this.logUrls = logUrls;
    this.attributes = attributes;
    this.resources = resources;
    this.resourceProfileId = resourceProfileId;
  }

  static fromJson(src: any): ExecutorInfo {
    let host = <string> src['Host'];
    let totalCores = src['Total Cores'];
    let logUrls = LogUrls.fromJson(src['Log Urls']);
    let attributesObj = src['Attributes'];
    let attributes = (attributesObj)? new Map(Object.entries(attributesObj)) : new Map();
    let resourcesObj = src['Resources'];
    let resources = (resourcesObj)? new Map(Object.entries(resourcesObj)) : new Map();
    let resourceProfileId = <number> src['Resource Profile Id'];
    return new ExecutorInfo(host, totalCores, logUrls, attributes, resources, resourceProfileId);
  }

  static createDefault(): ExecutorInfo {
    let logUrls = LogUrls.createDefault();
    return new ExecutorInfo('', 0, logUrls, new Map(), new Map(), 0);
  }
}
