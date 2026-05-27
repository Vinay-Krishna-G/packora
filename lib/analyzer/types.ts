export type DetectionCategory =
  | "framework"
  | "database"
  | "runtime"
  | "state-management"
  | "realtime"
  | "styling";

export interface DetectionResult {
  name: string;
  category: DetectionCategory;
  version?: string;
  confidence: number; // Numeric score from 0.0 to 1.0
  matchedBy: ("dependency" | "file-pattern")[];
  explainability: {
    matchedDependencies: string[];
    matchedFiles: string[];
  };
}

export interface ProjectAnalysis {
  technologies: DetectionResult[];
  summary: string;
  fileCount: number;
  totalSize: number;
}

export interface HeuristicRule {
  name: string;
  category: DetectionCategory;
  dependencies?: string[];  // Dependencies to seek in package.json files
  filePatterns?: string[];  // Configuration or boundary files to search for
}
