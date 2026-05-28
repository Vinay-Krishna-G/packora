import { FileSemanticSummary, DirectorySemanticSummary } from "./types.js";

export function summarizeDirectory(
  fileSummaries: Record<string, FileSemanticSummary>
): Record<string, DirectorySemanticSummary> {
  const dirFilesMap: Record<string, FileSemanticSummary[]> = {};

  // Group file summaries under their parent directory paths
  for (const [filePath, summary] of Object.entries(fileSummaries)) {
    const parts = filePath.split("/");
    parts.pop(); // Remove the filename
    
    // Track parent folders recursively
    let currentPath = "";
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      if (!dirFilesMap[currentPath]) {
        dirFilesMap[currentPath] = [];
      }
      dirFilesMap[currentPath].push(summary);
    }
  }

  const directorySummaries: Record<string, DirectorySemanticSummary> = {};

  for (const [dirPath, summaries] of Object.entries(dirFilesMap)) {
    const totalFiles = summaries.length;
    const lowerDir = dirPath.toLowerCase();

    let componentsCount = 0;
    let controllersCount = 0;
    let servicesCount = 0;
    let middlewareCount = 0;
    let configCount = 0;
    let testCount = 0;

    for (const file of summaries) {
      const lowerName = file.name.toLowerCase();
      const lowerFilePath = file.path.toLowerCase();

      if (lowerName.includes("config") || lowerName.startsWith(".") || lowerName.endsWith(".json")) {
        configCount++;
      } else if (lowerName.includes("controller") || lowerFilePath.includes("/controllers/")) {
        controllersCount++;
      } else if (lowerName.includes("service") || lowerFilePath.includes("/services/")) {
        servicesCount++;
      } else if (lowerName.includes("middleware") || lowerFilePath.includes("/middleware/")) {
        middlewareCount++;
      } else if (lowerName.endsWith(".tsx") || lowerName.endsWith(".jsx") || lowerFilePath.includes("/components/")) {
        componentsCount++;
      }
      
      if (lowerFilePath.includes("test") || lowerFilePath.includes("spec") || lowerFilePath.includes("__tests__")) {
        testCount++;
      }
    }

    let summaryText = "";

    // Heuristics mapping to derive highly contextual summaries
    if (lowerDir.includes("controllers") || (controllersCount / totalFiles) > 0.5) {
      summaryText = "Contains logical controllers processing API routes.";
    } else if (lowerDir.includes("services") || (servicesCount / totalFiles) > 0.5) {
      summaryText = "Provides services handling backend logic and data queries.";
    } else if (lowerDir.includes("middleware") || (middlewareCount / totalFiles) > 0.5) {
      summaryText = "Contains middlewares handling request pipelines.";
    } else if (lowerDir.includes("components/ui") || lowerDir.endsWith("/ui")) {
      summaryText = "Contains styling and presentational UI components.";
    } else if (lowerDir.includes("components") || (componentsCount / totalFiles) > 0.5) {
      summaryText = "Contains user interface view components.";
    } else if (lowerDir.includes("utils") || lowerDir.includes("helpers") || lowerDir.includes("lib")) {
      summaryText = "Contains helper functions and shared utilities.";
    } else if (lowerDir.includes("app/api") || lowerDir.includes("pages/api")) {
      summaryText = "Contains API route endpoint handlers.";
    } else if (lowerDir.includes("test") || lowerDir.includes("spec") || (testCount / totalFiles) > 0.5) {
      summaryText = "Contains test files.";
    } else {
      // General fallbacks based on naming clues
      const dirName = dirPath.split("/").pop() || "modules";
      summaryText = `Contains files inside the ${dirName} folder.`;
    }

    directorySummaries[dirPath] = {
      path: dirPath,
      summary: summaryText,
      itemCount: totalFiles,
    };
  }

  return directorySummaries;
}
