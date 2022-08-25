
/**
 * 
 */
export class StorageLevel {
    
  // @JsonProperty("Use Disk") 
  useDisk: boolean;
  
  // @JsonProperty("Use Memory")
  useMemory: boolean;
  
  // @JsonProperty("Deserialized")
  deserialized: boolean;
  
  // @JsonProperty("Replication")
  replication: number;

  constructor(useDisk: boolean, useMemory: boolean, deserialized: boolean, replication: number) {
    this.useDisk = useDisk;
    this.useMemory = useMemory;
    this.deserialized = deserialized;
    this.replication = replication;
  }
  
  static fromJson(src: any): StorageLevel {
    let useDisk = <boolean> src['Use Disk'];
    let useMemory = <boolean> src['Use Memory'];
    let deserialized = <boolean> src['Deserialized'];
    let replication = <number> src['Replication'];
    return new StorageLevel(useDisk, useMemory, deserialized, replication);
  }
}

/**
 * 
 */
export class RDDInfo {

  // @JsonProperty("RDD ID")
  rddId: number

  // @JsonProperty("Name")
  name: string;
  
  // @JsonProperty("Scope")
  scope: string;
  // Map<String,String> scope; // id, name??
  
  // @JsonProperty("Callsite")
  callSite: string;
  
  // @JsonProperty("Parent IDs")
  parentIds: number[];
  
  // @JsonProperty("Storage Level")
  storageLevel: StorageLevel;
  
  // @JsonProperty("Barrier")
  barrier: boolean;
  
  // @JsonProperty("Number of Partitions")
  numberOfPartitions: number;
         
  // @JsonProperty("Number of Cached Partitions")
  numberOfCachedPartitions: number;

  // @JsonProperty("Memory Size")
  memorySize: number;
                         
  // @JsonProperty("Disk Size")
  diskSize: number;

  constructor(
      rddId: number,
      name: string,
      scope: string,
      callSite: string,
      parentIds: number[],
      storageLevel: StorageLevel,
      barrier: boolean,
      numberOfPartitions: number,
      numberOfCachedPartitions: number,
      memorySize: number,
      diskSize: number
  ) {
    this.rddId = rddId;
    this.name = name;
    this.scope = scope;
    this.callSite = callSite;
    this.parentIds = parentIds;
    this.storageLevel = storageLevel;
    this.barrier = barrier;
    this.numberOfPartitions = numberOfPartitions;
    this.numberOfCachedPartitions = numberOfCachedPartitions;
    this.memorySize = memorySize;
    this.diskSize = diskSize;
  }

  static fromJson(src: any): RDDInfo {
    let rddId = <number> src['RDD ID'];
    let name = <string> src['Name'];
    let scope = <string> src['Scope'];
    let callSite = <string> src['CallSite'];
    let parentIds = <number[]> src['Parent IDs'];
    let storageLevel = <StorageLevel> src['Storage Level'];
    let barrier = <boolean> src['Barrier'];
    let numberOfPartitions = <number> src['Number of Partitions'];
    let numberOfCachedPartitions = <number> src['Number of Cached Partitions'];
    let memorySize = <number> src['Memory Size'];
    let diskSize = <number> src['Disk Size'];
    return new RDDInfo(rddId, name, scope, callSite, parentIds,
        storageLevel, barrier, numberOfPartitions, numberOfCachedPartitions, memorySize, diskSize)
  }

  static fromJsonArray(src: any[]): RDDInfo[] {
      return src.map(x => RDDInfo.fromJson(x));
  }

}
