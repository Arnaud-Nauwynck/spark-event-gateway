
export class AccumulableInfo {

  // @JsonProperty("ID")
  readonly id: number

  // @JsonProperty("Name")
  readonly name: string;

  // @JsonProperty("Update")
  update: number;

  // @JsonProperty("Value")
  value: number;

  // @JsonProperty("Internal")
  internal: boolean;

  // @JsonProperty("Count Failed Values")
  countFailedValues: boolean;

  // @JsonProperty("Metadata")
  metadata: {}|null;

  // --------------------------------------------------------------------------

  constructor(id: number,
      name: string,
      update: number,
      value: number,
      internal: boolean,
      countFailedValues: boolean,
      metadata: {}|null) {
    this.id = id,
    this.name = name,
    this.update = update;
    this.value = value;
    this.internal = internal;
    this.countFailedValues = countFailedValues;
    this.metadata = metadata;
  }

  static fromJson(src: any): AccumulableInfo {
    let id = <number> src['ID'];
    let name = <string> src['Name'];
    let update = <number> src['Update'];
    let value = <number> src['Value'];
    let internal= <boolean>src['Internal'];
    let countFailedValues = <boolean> src['Count Failed Values'];
    let metadata = src['Metadata'];
    return new AccumulableInfo(id, name, update, value, internal, countFailedValues, metadata);
  }
  
  static fromJsonArray(src: any[]): AccumulableInfo[] {
      return src.map(x => AccumulableInfo.fromJson(x));
  }

}
