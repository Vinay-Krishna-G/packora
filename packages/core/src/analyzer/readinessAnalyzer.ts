import { ScannedFile } from "@codemelt/shared";
import { AIReadinessScore } from "./types.js";

export function analyzeReadiness(
  files: ScannedFile[],
  ignoredCount: number
): AIReadinessScore {
  let documentation = 0;
  let typingQuality = 0;
  let structureClarity = 0;
  let configCompleteness = 0;
  let contextOptimization = 0;
  const recommendations: string[] = [];

  // Helper check methods
  const hasFile = (name: string) => files.some((f) => f.name.toLowerCase() === name.toLowerCase());
  const hasExtension = (ext: string) => files.some((f) => f.extension.toLowerCase() === ext.toLowerCase());
  const hasDirectory = (dirName: string) => files.some((f) => f.path.includes(`/${dirName}/`) || f.path.startsWith(`${dirName}/`));

  // 1. Documentation Scoring (Max 20)
  const hasReadme = files.some(
    (f) =>
      f.name.toLowerCase() === "readme.md" ||
      f.name.toLowerCase() === "readme.mdx" ||
      f.name.toLowerCase() === "readme.txt" ||
      f.name.toLowerCase() === "readme"
  );
  if (hasReadme) {
    documentation += 10;
  } else {
    recommendations.push("Add a README.md file at the repository root to give AI models structural context.");
  }
  if (hasFile("contributing.md") || hasFile("api.md") || hasDirectory("docs")) {
    documentation += 10;
  } else {
    recommendations.push("Provide secondary onboarding guides (docs/ or CONTRIBUTING.md) to explain local builds.");
  }

  // 2. Typing Quality Scoring (Max 20)
  if (hasFile("tsconfig.json")) {
    typingQuality += 15;
  } else {
    recommendations.push("Transition to TypeScript or add a tsconfig.json to supply compile-time types for AI reasoning.");
  }
  if (hasExtension("ts") || hasExtension("tsx") || hasExtension("d.ts")) {
    typingQuality += 5;
  } else {
    recommendations.push("Write structured typings for data entities instead of relying on loose JS any types.");
  }

  // 3. Structure Clarity Scoring (Max 20)
  const standardizedDirs = ["src", "components", "lib", "app", "pages", "routes", "controllers", "services"];
  const matchedDirsCount = standardizedDirs.filter(dir => hasDirectory(dir)).length;
  
  if (matchedDirsCount >= 2) {
    structureClarity += 15;
  } else if (matchedDirsCount === 1) {
    structureClarity += 8;
    recommendations.push("Introduce conventional directory subdivisions (e.g. src/lib, src/components) to separate concerns.");
  } else {
    recommendations.push("Organize files into specialized directories instead of keeping flat structures in the root folder.");
  }

  // File organization balance check
  const rootFilesCount = files.filter(f => !f.path.includes("/")).length;
  if (files.length > 5 && rootFilesCount / files.length < 0.4) {
    structureClarity += 5;
  } else if (files.length > 5) {
    recommendations.push("Avoid cluttering the root folder with massive amounts of flat source files.");
  } else {
    structureClarity += 5;
  }

  // 4. Config Completeness Scoring (Max 20)
  if (hasFile(".gitignore")) {
    configCompleteness += 10;
  } else {
    recommendations.push("Include a .gitignore to inform tools which pathways are safe to ignore by default.");
  }
  if (hasFile(".env.example") || hasFile(".env.template") || hasFile(".env.local.example")) {
    configCompleteness += 5;
  } else {
    recommendations.push("Add a .env.example file detailing active environment variable structures.");
  }
  if (hasFile(".eslintrc.json") || hasFile("eslint.config.js") || hasFile(".prettierrc") || hasFile("tsconfig.json")) {
    configCompleteness += 5;
  }

  // 5. Context Optimization Scoring (Max 20)
  // Ensure huge lockfiles are not inside included scanned files list
  const hasLockfilesInScan = files.some(f => 
    f.name === "package-lock.json" || 
    f.name === "yarn.lock" || 
    f.name === "pnpm-lock.yaml"
  );
  if (!hasLockfilesInScan) {
    contextOptimization += 10;
  } else {
    recommendations.push("Ensure large package lockfiles are excluded from scans to save 80%+ context space.");
  }
  if (ignoredCount > 0) {
    contextOptimization += 10;
  } else {
    recommendations.push("Set active filter/ignore configs to prune compile and distribution noise folders.");
  }

  const score = documentation + typingQuality + structureClarity + configCompleteness + contextOptimization;

  return {
    score,
    breakdown: {
      documentation,
      typingQuality,
      structureClarity,
      configCompleteness,
      contextOptimization,
    },
    recommendations: recommendations.slice(0, 4), // Cap at 4 actionable items to avoid UI clutter
  };
}
