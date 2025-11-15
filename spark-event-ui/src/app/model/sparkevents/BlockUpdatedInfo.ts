
export class BlockUpdatedInfo {

  props: Map<string,any>; // TODO

  constructor(props: Map<string,any>) {
    this.props = props;
  }

  static fromJson(src: any): BlockUpdatedInfo {
    return new BlockUpdatedInfo(new Map(Object.entries(src)));
  }

  static createDefault(): BlockUpdatedInfo {
    return new BlockUpdatedInfo(new Map());
  }

}
