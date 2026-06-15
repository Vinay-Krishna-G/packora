import { ScannedFile } from "codemelt-shared";

export type FileImportance = "critical" | "high" | "normal" | "low";
export type FileComplexity = "low" | "medium" | "high";

export interface DependencyNode {
  id: string; // The file path
  path: string;
  name: string;
  purpose?: string;
  imports: string[];     // IDs (paths) of files this file imports
  importedBy: string[];  // IDs (paths) of files that import this file
  importance: FileImportance;
  complexity: FileComplexity;
}

export interface DependencyEdge {
  source: string; // ID of the file doing the importing
  target: string; // ID of the file being imported
}

export interface DependencyGraph {
  nodes: Map<string, DependencyNode>;
  edges: DependencyEdge[];
}

export interface ExplanationResult {
  path: string;
  purpose: string;
  imports: string[];
  usedBy: string[];
  importance: FileImportance;
  complexity: FileComplexity;
  flow: string[];
}
