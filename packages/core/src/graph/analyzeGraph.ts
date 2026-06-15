import { DependencyGraph, DependencyNode } from "./types.js";

export function getDependencyHotspots(graph: DependencyGraph, limit: number = 10): DependencyNode[] {
  // Sort nodes by how many times they are imported (in-degree)
  const nodes = Array.from(graph.nodes.values());
  nodes.sort((a, b) => b.importedBy.length - a.importedBy.length);
  
  // Filter out node_modules or standard configs if needed, but in v1 we just take top N
  return nodes.filter(n => n.importedBy.length > 0).slice(0, limit);
}
