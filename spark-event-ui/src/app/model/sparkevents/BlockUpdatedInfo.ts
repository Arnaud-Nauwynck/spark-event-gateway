import {KeyValueObject} from './SparkPlanInfo';

export class BlockUpdatedInfo {

  props: KeyValueObject;

  constructor(props: KeyValueObject) {
    this.props = props;
  }

  static fromJson(src: KeyValueObject): BlockUpdatedInfo {
    return new BlockUpdatedInfo(src);
  }

  static createDefault(): BlockUpdatedInfo {
    return new BlockUpdatedInfo({});
  }

}
