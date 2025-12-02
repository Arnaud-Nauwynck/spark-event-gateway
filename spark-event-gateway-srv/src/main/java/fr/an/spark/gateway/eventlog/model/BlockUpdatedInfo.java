package fr.an.spark.gateway.eventlog.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import fr.an.spark.gateway.eventlog.model.RDDInfo.StorageLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class BlockUpdatedInfo {

    @JsonProperty("Block Manager ID") // cf JsonProtocol.blockManagerIdFromJson()
    public BlockManagerId blockManagerId;

    @JsonProperty("Block ID")
    public String blockId;

    @JsonProperty("Storage Level") // cf JsonProtocol.storageLevelFromJson
    public StorageLevel storageLevel;

    @JsonProperty("Memory Size")
    public long memSize;

    @JsonProperty("Disk Size")
    public long diskSize;

}
