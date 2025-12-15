package fr.an.spark.gateway.dto.sql;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class NodeDuplicatesWithinSqlExecAnalysisDTO {

    public List<NodeEqualSemanticDuplicatesEntryDTO> sameDuplicatesEntries;
    public List<NodeEqualSemanticDuplicatesEntryDTO> semanticDuplicatesEntries;

}
