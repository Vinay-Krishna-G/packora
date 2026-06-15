import { ScannedFile, AI_MODELS } from "codemelt-shared";
import { TECHNOLOGY_RULES } from "./rules.js";
import { ProjectAnalysis, DetectionResult, ArchitectureType, RepositoryPurpose } from "./types.js";

import { calculateCompression } from "./compressionAnalyzer.js";
import { analyzeReadiness } from "./readinessAnalyzer.js";
import { generateWorkflows } from "./workflowGenerator.js";
import { detectPurpose } from "./purposeDetector.js";
import { analyzeSemanticRepository } from "../summarizer/index.js";
import { estimateTokens } from "../tokenizer/estimateTokens.js";

interface ParsedPackageJson {
  path: string; // File path (e.g. "packages/web/package.json")
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

function getConfidenceTier(score: number): "Strong" | "Moderate" | "Low" {
  if (score >= 0.8) return "Strong";
  if (score >= 0.5) return "Moderate";
  return "Low";
}

export function analyzeRepository(
  files: ScannedFile[],
  totalFilesCount: number = files.length,
  ignoredCount: number = 0,
  ignoredBytes: number = 0
): ProjectAnalysis {
  const detections: Map<string, DetectionResult> = new Map();
  const parsedPackages: ParsedPackageJson[] = [];

  // 1. Locate and parse EVERY package.json in the scanned files list
  for (const file of files) {
    if (file.name === "package.json" && file.type === "text") {
      try {
        const parsed = JSON.parse(file.content);
        parsedPackages.push({
          path: file.path,
          dependencies: parsed.dependencies || {},
          devDependencies: parsed.devDependencies || {},
        });
      } catch {
        // Safe fallback for broken or partially uploaded package.json files
      }
    }
  }

  // Helper: check if dependency exists across any package.json
  const findDependency = (depName: string): { version?: string; pkgPath: string }[] => {
    const matches: { version?: string; pkgPath: string }[] = [];
    for (const pkg of parsedPackages) {
      if (pkg.dependencies[depName]) {
        matches.push({ version: pkg.dependencies[depName], pkgPath: pkg.path });
      } else if (pkg.devDependencies[depName]) {
        matches.push({ version: pkg.devDependencies[depName], pkgPath: pkg.path });
      }
    }
    return matches;
  };

  // Helper: find any files matching pattern
  const findMatchingFiles = (pattern: string): string[] => {
    return files
      .filter((f) => f.path.endsWith(pattern) || f.path.includes(pattern))
      .map((f) => f.path);
  };

  // 2. Rules Pipeline Evaluator
  for (const rule of TECHNOLOGY_RULES) {
    let score = 0.0;
    const matchedDeps: string[] = [];
    const matchedFiles: string[] = [];
    const matchedBy: ("dependency" | "file-pattern")[] = [];
    let detectedVersion: string | undefined = undefined;

    // Check Dependency Signatures
    if (rule.dependencies) {
      for (const dep of rule.dependencies) {
        const matches = findDependency(dep);
        if (matches.length > 0) {
          matchedDeps.push(dep);
          if (!detectedVersion) {
            detectedVersion = matches[0].version; // Grab first resolved version
          }
        }
      }
      if (matchedDeps.length > 0) {
        score += 0.70; // Dependency matches provide 0.70 confidence
        matchedBy.push("dependency");
      }
    }

    // Check File Configuration Signatures
    if (rule.filePatterns) {
      for (const pattern of rule.filePatterns) {
        const found = findMatchingFiles(pattern);
        if (found.length > 0) {
          matchedFiles.push(...found);
        }
      }
      if (matchedFiles.length > 0) {
        score += 0.30; // File patterns provide a 0.30 confidence boost
        matchedBy.push("file-pattern");
      }
    }

    // If we have any active matches, register the detection
    if (score > 0) {
      const finalScore = Math.min(score, 1.0); // Cap at 1.0 (absolute confidence)

      detections.set(rule.name, {
        name: rule.name,
        category: rule.category,
        version: detectedVersion,
        confidence: finalScore,
        confidenceTier: getConfidenceTier(finalScore),
        matchedBy,
        explainability: {
          matchedDependencies: matchedDeps,
          matchedFiles: matchedFiles,
        },
      });
    }
  }

  // 3. Sub-modules Orchestration
  const technologies = Array.from(detections.values());
  const architecture = detectArchitecture(files, parsedPackages, detections);

  // Extract parsed dependencies set for purpose detection
  const dependenciesSet = new Set<string>();
  for (const pkg of parsedPackages) {
    Object.keys(pkg.dependencies).forEach(dep => dependenciesSet.add(dep));
    Object.keys(pkg.devDependencies).forEach(dep => dependenciesSet.add(dep));
  }

  const purpose = detectPurpose(files, dependenciesSet);
  const prompts = generateWorkflows(architecture, technologies);
  const compression = calculateCompression(files, totalFilesCount, ignoredCount, ignoredBytes);
  const semanticAnalysis = analyzeSemanticRepository(files);
  const readinessScore = analyzeReadiness(files, ignoredCount, architecture, semanticAnalysis, compression, technologies);

  // Compute file count per importance level cleanly
  const importanceStats = {
    critical: files.filter(f => f.importance === "critical").length,
    high: files.filter(f => f.importance === "high").length,
    normal: files.filter(f => f.importance === "normal").length,
    low: files.filter(f => f.importance === "low").length,
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  
  // Calculate Token Estimates
  const totalChars = files.reduce((acc, f) => acc + (f.type === "text" ? f.content.length : 0), 0);
  const exportedContextChars = files.filter(f => f.included && f.type === "text").reduce((acc, f) => acc + f.content.length, 0);
  
  // Use heuristic that 1 token is roughly 4 chars
  const rawRepositoryTokens = Math.ceil(totalChars / 4) + Math.ceil(ignoredBytes / 4);
  const exportedContextTokens = Math.ceil(exportedContextChars / 4);

  const tokenEstimates = {
    rawRepository: rawRepositoryTokens,
    exportedContext: exportedContextTokens,
  };

  // Calculate Context Usage
  const calculateUsage = (window: number) => {
    if (exportedContextTokens === 0) return 0;
    const ratio = (exportedContextTokens / window) * 100;
    return Math.min(100, Math.round(ratio));
  };

  const compatibility = {
    claudeSonnet: calculateUsage(AI_MODELS.claudeSonnet.contextWindow),
    gpt5: calculateUsage(AI_MODELS.gpt5.contextWindow),
    geminiPro: calculateUsage(AI_MODELS.geminiPro.contextWindow),
    cursor: calculateUsage(AI_MODELS.cursor.contextWindow),
    copilot: calculateUsage(AI_MODELS.copilot.contextWindow),
  };

  const summary = generateSummaryText(technologies, architecture, purpose.name, files.length, totalSize);

  return {
    technologies,
    architecture,
    purpose,
    readinessScore,
    prompts,
    compression,
    summary,
    fileCount: files.length,
    totalSize,
    importanceStats,
    tokenEstimates,
    compatibility,
    semanticAnalysis,
  };
}

function detectArchitecture(
  files: ScannedFile[],
  parsedPackages: ParsedPackageJson[],
  detections: Map<string, DetectionResult>
): ArchitectureType {
  // 1. Monorepo Detection with strict evidence
  const hasWorkspaceConfig = files.some(
    (f) =>
      f.name === "turbo.json" ||
      f.name === "nx.json" ||
      f.name === "lerna.json" ||
      f.name === "pnpm-workspace.yaml"
  );
  let hasRootWorkspaces = false;
  for (const file of files) {
    if (file.name === "package.json" && (file.path === "package.json" || file.path === "./package.json") && file.type === "text") {
      try {
        const parsed = JSON.parse(file.content);
        if (parsed.workspaces) {
          hasRootWorkspaces = true;
        }
      } catch { }
    }
  }
  const hasSubpackageJson = parsedPackages.some(
    (pkg) =>
      pkg.path.includes("packages/") ||
      pkg.path.includes("apps/") ||
      pkg.path.includes("libs/")
  );

  if (parsedPackages.length > 1 && (hasWorkspaceConfig || hasRootWorkspaces || hasSubpackageJson)) {
    return "monorepo";
  }

  const hasFramework = (name: string) => detections.has(name);
  const hasCategory = (cat: string) => Array.from(detections.values()).some((d) => d.category === cat);

  // 2. Fullstack Monolith (Next.js, Nuxt/Vue, SvelteKit + Database layers)
  const isFullstackFramework = hasFramework("Next.js") || hasFramework("Svelte / SvelteKit") || hasFramework("Vue.js");
  const hasDb = hasCategory("database");
  if (isFullstackFramework && hasDb) {
    return "fullstack-monolith";
  }

  // 3. Backend API
  const isBackendFramework = hasFramework("Express.js") || hasFramework("NestJS");
  if (isBackendFramework && hasDb && !hasFramework("React")) {
    return "backend-api";
  }

  // 4. Realtime Systems
  if (hasCategory("realtime")) {
    return "realtime-system";
  }

  // 5. Frontend Only
  if ((hasFramework("React") || hasFramework("Vue.js") || hasFramework("Angular")) && !hasDb) {
    return "frontend-only";
  }

  return "unknown";
}

function generateSummaryText(
  technologies: DetectionResult[],
  architecture: ArchitectureType,
  purpose: RepositoryPurpose,
  fileCount: number,
  totalSize: number
): string {
  const frameworks = technologies.filter((t) => t.category === "framework").map((t) => t.name);
  const databases = technologies.filter((t) => t.category === "database").map((t) => t.name);
  const styling = technologies.filter((t) => t.category === "styling").map((t) => t.name);

  const archLabels: Record<ArchitectureType, string> = {
    "monorepo": "Monorepo Workspace",
    "fullstack-monolith": "Fullstack Monolith",
    "frontend-only": "Frontend Application",
    "backend-api": "Backend API Service",
    "realtime-system": "Realtime Application",
    "unknown": "Software Repository"
  };

  const purposeLabels: Record<RepositoryPurpose, string> = {
    "developer-tooling": "Developer Tooling Project",
    "saas-dashboard": "SaaS Dashboard Portal",
    "chat-application": "Chat Application",
    "ecommerce-platform": "Ecommerce Platform",
    "cms": "Content Management System",
    "portfolio": "Portfolio Website",
    "api-platform": "API Platform Service",
    "unknown": "Application"
  };

  let summary = `Scanned ${fileCount} files (${(totalSize / 1024 / 1024).toFixed(2)} MB). `;

  if (purpose !== "unknown") {
    summary += `This project is classified as a ${purposeLabels[purpose]} configured on a ${archLabels[architecture]} layout. `;
  } else {
    summary += `The codebase is classified as a ${archLabels[architecture]}. `;
  }

  if (frameworks.length > 0) {
    summary += `Project is built using ${frameworks.join(" / ")}. `;
  } else {
    summary += `Project is structured as a basic JavaScript/TypeScript application. `;
  }

  if (databases.length > 0) {
    summary += `Uses ${databases.join(" & ")} as the data layers. `;
  }

  if (styling.length > 0) {
    summary += `Styling is implemented with ${styling.join(", ")}. `;
  }

  return summary;
}
