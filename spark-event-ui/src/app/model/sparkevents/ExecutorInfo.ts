import {KeyValueObject} from './SparkPlanInfo';

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
  attributes: KeyValueObject;

  // @JsonProperty("Resources")
  resources: KeyValueObject;

  // @JsonProperty("Resource Profile Id")
  resourceProfileId: number;

  constructor(host: string, totalCores: number,
              logUrls: LogUrls,
              attributes: KeyValueObject,
              resources: KeyValueObject,
              resourceProfileId: number) {
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
    let attributes = attributesObj || {};
    let resourcesObj = src['Resources'];
    let resources = resourcesObj || {};
    let resourceProfileId = <number> src['Resource Profile Id'];
    return new ExecutorInfo(host, totalCores, logUrls, attributes, resources, resourceProfileId);
  }

  static createDefault(): ExecutorInfo {
    let logUrls = LogUrls.createDefault();
    return new ExecutorInfo('', 0, logUrls, {}, {}, 0);
  }
}
