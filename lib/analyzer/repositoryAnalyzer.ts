import { ScannedFile } from "../scanner/fileTypes";
import { TECHNOLOGY_RULES } from "./rules";
import { ProjectAnalysis, DetectionResult } from "./types";

interface ParsedPackageJson {
  path: string; // File path (e.g. "packages/web/package.json")
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export function analyzeRepository(files: ScannedFile[]): ProjectAnalysis {
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
        matchedBy,
        explainability: {
          matchedDependencies: matchedDeps,
          matchedFiles: matchedFiles,
        },
      });
    }
  }

  // 3. Summarization
  const technologies = Array.from(detections.values());
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const summary = generateSummaryText(technologies, files.length, totalSize);

  return {
    technologies,
    summary,
    fileCount: files.length,
    totalSize,
  };
}

function generateSummaryText(
  technologies: DetectionResult[],
  fileCount: number,
  totalSize: number
): string {
  const frameworks = technologies.filter((t) => t.category === "framework").map((t) => t.name);
  const databases = technologies.filter((t) => t.category === "database").map((t) => t.name);
  const styling = technologies.filter((t) => t.category === "styling").map((t) => t.name);

  let summary = `Scanned ${fileCount} files (${(totalSize / 1024 / 1024).toFixed(2)} MB). `;

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
