import { ScannedFile, ExportMode, ExportIntent } from "codemelt-shared";
import { SemanticRepositoryAnalysis } from "../summarizer/types.js";

export type ArchitectureType =
  | "monorepo"
  | "fullstack-monolith"
  | "frontend-only"
  | "backend-api"
  | "realtime-system"
  | "unknown";

export type RepositoryPurpose =
  | "developer-tooling"
  | "saas-dashboard"
  | "chat-application"
  | "ecommerce-platform"
  | "cms"
  | "portfolio"
  | "api-platform"
  | "unknown";

export interface PurposeResult {
  name: RepositoryPurpose;
  confidence: number; // Score from 0.0 to 1.0
  confidenceTier?: "Strong" | "Moderate" | "Low";
  matchedSignals: string[];
}

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
  confidenceTier?: "Strong" | "Moderate" | "Low";
  matchedBy: ("dependency" | "file-pattern")[];
  explainability: {
    matchedDependencies: string[];
    matchedFiles: string[];
  };
}

export interface CompressionStats {
  originalBytes: number;
  compressedBytes: number;
  originalFilesCount: number;
  compressedFilesCount: number;
  savingsPercentage: number;
}

export interface AIReadinessScore {
  score: number; // 0 to 100
  breakdown: {
    architecture: number;      // 0-20 points
    entrypoints: number;       // 0-15 points
    routes: number;            // 0-15 points
    criticalFiles: number;     // 0-20 points
    compression: number;       // 0-15 points
    techDetection: number;     // 0-15 points
  };
  recommendations: string[];
}

export interface AIWorkflowPrompt {
  title: string;
  description: string;
  prompt: string;
}

export interface ProjectAnalysis {
  technologies: DetectionResult[];
  architecture: ArchitectureType;
  purpose: PurposeResult;
  readinessScore: AIReadinessScore;
  prompts: AIWorkflowPrompt[];
  compression: CompressionStats;
  summary: string;
  fileCount: number;
  totalSize: number;
  importanceStats: {
    critical: number;
    high: number;
    normal: number;
    low: number;
  };
  tokenEstimates: {
    rawRepository: number;
    exportedContext: number;
  };
  compatibility: {
    claudeSonnet: number;
    gpt5: number;
    geminiPro: number;
    cursor: number;
    copilot: number;
  };
  semanticAnalysis?: SemanticRepositoryAnalysis;
}

export interface HeuristicRule {
  name: string;
  category: DetectionCategory;
  dependencies?: string[];  // Dependencies to seek in package.json files
  filePatterns?: string[];  // Configuration or boundary files to search for
}
