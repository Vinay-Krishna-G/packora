import { ScannedFile } from "codemelt-shared";
import { AIReadinessScore, ArchitectureType, DetectionResult } from "./types.js";
import { SemanticRepositoryAnalysis } from "../summarizer/types.js";
import { CompressionStats } from "./types.js";

export function analyzeReadiness(
  files: ScannedFile[],
  ignoredCount: number,
  architecture: ArchitectureType,
  semanticAnalysis: SemanticRepositoryAnalysis | undefined,
  compression: CompressionStats,
  technologies: DetectionResult[]
): AIReadinessScore {
  let archScore = 0;
  let entrypointsScore = 0;
  let routesScore = 0;
  let criticalFilesScore = 0;
  let compressionScore = 0;
  let techDetectionScore = 0;
  const recommendations: string[] = [];

  // Helper check methods
  const hasFile = (name: string) => files.some((f) => f.name.toLowerCase() === name.toLowerCase());
  const hasExtension = (ext: string) => files.some((f) => f.extension.toLowerCase() === ext.toLowerCase());
  const hasDirectory = (dirName: string) => files.some((f) => f.path.includes(`/${dirName}/`) || f.path.startsWith(`${dirName}/`));

  // 1. Architecture Scoring (Max 20)
  if (architecture !== "unknown") {
    archScore = 20;
  } else {
    archScore = 10;
    recommendations.push("Could not cleanly identify architecture. Add standard framework configurations.");
  }

  // 2. Entrypoints Scoring (Max 15)
  if (semanticAnalysis && semanticAnalysis.entrypoints.length > 0) {
    entrypointsScore = 15;
  } else {
    entrypointsScore = 5;
    recommendations.push("Ensure main entrypoints (e.g. index.ts, main.ts) are well-defined.");
  }

  // 3. Routes Scoring (Max 15)
  if (semanticAnalysis && semanticAnalysis.routes.length > 0) {
    routesScore = 15;
  } else if (architecture === "backend-api" || architecture === "fullstack-monolith") {
    routesScore = 5;
    recommendations.push("Define API routes in recognizable patterns (e.g., api/ or controllers/).");
  } else {
    // If it's a library or frontend, routes might not be as relevant, give full score
    routesScore = 15;
  }

  // 4. Critical Files Scoring (Max 20)
  const criticalCount = files.filter(f => f.importance === "critical").length;
  if (criticalCount > 0) {
    criticalFilesScore = Math.min(20, criticalCount * 5); // 4+ critical files = max
  } else {
    criticalFilesScore = 5;
    recommendations.push("Highlight critical domain logic files to ensure AI focuses on important areas.");
  }

  // 5. Compression Scoring (Max 15)
  if (compression.savingsPercentage > 80) {
    compressionScore = 15;
  } else if (compression.savingsPercentage > 50) {
    compressionScore = 10;
  } else {
    compressionScore = 5;
    recommendations.push("Ensure large package lockfiles or build artifacts are excluded to improve compression.");
  }

  // 6. Tech Detection Scoring (Max 15)
  if (technologies.length > 2) {
    techDetectionScore = 15;
  } else if (technologies.length > 0) {
    techDetectionScore = 10;
  } else {
    techDetectionScore = 5;
    recommendations.push("Include standard configuration files (package.json, etc.) so technologies can be detected.");
  }

  const score = archScore + entrypointsScore + routesScore + criticalFilesScore + compressionScore + techDetectionScore;

  return {
    score,
    breakdown: {
      architecture: archScore,
      entrypoints: entrypointsScore,
      routes: routesScore,
      criticalFiles: criticalFilesScore,
      compression: compressionScore,
      techDetection: techDetectionScore,
    },
    recommendations: recommendations.slice(0, 4),
  };
}
