package fr.an.spark.gateway.dto.sql;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor @AllArgsConstructor
public class NodeEqualSemanticDuplicatesEntryDTO {

    public int semanticHash;

    public List<Integer> nodePathIds;

}
