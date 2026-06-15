import { DependencyGraph, ExplanationResult } from "./types.js";

export function explainNode(graph: DependencyGraph, target: string): ExplanationResult | null {
  // Try to find exact path or fuzzy match (e.g. "UploadZone" matching "apps/web/components/UploadZone.tsx")
  let node = graph.nodes.get(target);
  
  if (!node) {
    const targetLower = target.toLowerCase();
    const possibleNodes = Array.from(graph.nodes.values()).filter(n => 
      n.name.toLowerCase() === targetLower || 
      n.name.toLowerCase().startsWith(targetLower + ".")
    );
    
    if (possibleNodes.length > 0) {
      // Pick the shortest path or the most imported one if tie
      possibleNodes.sort((a, b) => b.importedBy.length - a.importedBy.length);
      node = possibleNodes[0];
    }
  }

  if (!node) return null;

  // Build the basic flow (Used By -> Node -> Imports)
  const flow: string[] = [];
  if (node.importedBy.length > 0) {
    flow.push(node.importedBy[0].split('/').pop() || node.importedBy[0]);
  }
  flow.push(node.name);
  if (node.imports.length > 0) {
    flow.push(node.imports[0].split('/').pop() || node.imports[0]);
  }

  return {
    path: node.path,
    purpose: node.purpose || `Logic for ${node.name}`,
    imports: node.imports.map(p => p.split('/').pop() || p),
    usedBy: node.importedBy.map(p => p.split('/').pop() || p),
    importance: node.importance,
    complexity: node.complexity,
    flow
  };
}
