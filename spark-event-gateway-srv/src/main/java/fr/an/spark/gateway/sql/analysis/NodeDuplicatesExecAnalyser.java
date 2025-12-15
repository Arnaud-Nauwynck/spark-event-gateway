package fr.an.spark.gateway.sql.analysis;

import fr.an.spark.gateway.dto.sql.NodeDuplicatesWithinSqlExecAnalysisDTO;
import fr.an.spark.gateway.dto.sql.NodeEqualSemanticDuplicatesEntryDTO;
import fr.an.spark.gateway.sql.SparkPlanNode;
import fr.an.spark.gateway.sql.SparkPlanTree;
import fr.an.spark.gateway.utils.LsUtils;
import lombok.RequiredArgsConstructor;
import lombok.val;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NodeDuplicatesExecAnalyser {

    protected final Map<Integer, List<NodesByEqualSemanticEntry>> sameNodesByHash = new HashMap<>(1001);

    protected final Map<Integer, List<NodesByEqualSemanticEntry>> semanticsNodesByHash = new HashMap<>(1001);

    @RequiredArgsConstructor
    protected static class NodesByEqualSemanticEntry {
        // protected final int semanticHash; // redundant with all nodes .getSemanticHash()
        /** reference (=first) node for comparing others with equalsCanonicalized */
        protected final SparkPlanNode referenceNode;
        protected final List<SparkPlanNode> nodes = new ArrayList<>();
    }

    // -----------------------------------------------------------------------------------------------------------------

    protected NodeDuplicatesExecAnalyser() {
    }

    public static NodeDuplicatesWithinSqlExecAnalysisDTO analyseNodeDuplicatesWithinSqlExec(SparkPlanTree planTree) {
        val nodeAnalyser = new NodeDuplicatesExecAnalyser();
        // step 1: traverse all nodes to collect node (semanticHash -> compare for equality -> add to RepeatedList count
        nodeAnalyser.recursiveAddNode(planTree.rootNode);

        // step 2: collect all entries with same / semantic duplicates
        val sameDuplicatesEntryDTOs = new ArrayList<NodeEqualSemanticDuplicatesEntryDTO>();
        for (val entryListByHash : nodeAnalyser.sameNodesByHash.values()) {
            for (val entry : entryListByHash) {
                if (entry.nodes.size() > 1) {
                    val entryDto = new NodeEqualSemanticDuplicatesEntryDTO(entry.referenceNode.getSemanticHash(),
                            LsUtils.map(entry.nodes, SparkPlanNode::getNodePathId));
                    sameDuplicatesEntryDTOs.add(entryDto);
                }
            }
        }

        val semanticDuplicatesEntryDTOs = new ArrayList<NodeEqualSemanticDuplicatesEntryDTO>();
        for (val entryListByHash : nodeAnalyser.semanticsNodesByHash.values()) {
            for (val entry : entryListByHash) {
                if (entry.nodes.size() > 1) {
                    val entryDto = new NodeEqualSemanticDuplicatesEntryDTO(entry.referenceNode.getSemanticHash(),
                            LsUtils.map(entry.nodes, SparkPlanNode::getNodePathId));
                    semanticDuplicatesEntryDTOs.add(entryDto);
                }
            }
        }
        return new NodeDuplicatesWithinSqlExecAnalysisDTO(sameDuplicatesEntryDTOs, semanticDuplicatesEntryDTOs);
    }

    protected void recursiveAddNode(SparkPlanNode node) {
        val semanticHash = node.getSemanticHash();

        // TOADD ... first resolve by Exchange as in SparkPlanGraph


        {
            val sameCandidates = sameNodesByHash.computeIfAbsent(semanticHash, k -> new ArrayList<>());
            NodesByEqualSemanticEntry entry = LsUtils.findFirst(sameCandidates, x -> x.referenceNode.equalsSame(node));
            if (entry == null) {
                entry = new NodesByEqualSemanticEntry(node);
                sameCandidates.add(entry);
            }
            entry.nodes.add(node);
            node.sameDuplicatedIndex = entry.nodes.size(); // 1 for first
            if (node.sameDuplicatedIndex != 1) {
                val firstNode = entry.nodes.getFirst();
                node.sameDuplicateFirstNode = firstNode;
            }
        }

        if (node.sameDuplicatedIndex == 0) { // else already found as same-duplicate
            val semanticCandidates = semanticsNodesByHash.computeIfAbsent(semanticHash, k -> new ArrayList<>());
            NodesByEqualSemanticEntry entry = LsUtils.findFirst(semanticCandidates, x -> x.referenceNode.equalsCanonicalized(node));
            if (entry == null) {
                entry = new NodesByEqualSemanticEntry(node);
                semanticCandidates.add(entry);
            }
            entry.nodes.add(node);
            node.semanticDuplicatedIndex = entry.nodes.size(); // 1 for first
            if (node.semanticDuplicatedIndex != 1) {
                val firstNode = entry.nodes.getFirst();
                node.semanticDuplicateFirstNode = firstNode;
            }
        }

        val childLs = node.getChildren();
        if (childLs != null) {
            for (val child : childLs) {
                // *** recursive child tree ***
                recursiveAddNode(child);
            }
        }
    }

}
