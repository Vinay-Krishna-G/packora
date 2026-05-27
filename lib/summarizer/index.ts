import { ScannedFile } from "../scanner/fileTypes";
import { SemanticRepositoryAnalysis, FileSemanticSummary } from "./types";
import { summarizeFile } from "./summarizeFile";
import { summarizeDirectory } from "./summarizeDirectory";
import { detectFlowsAndRoutes } from "./flowDetector";

export function analyzeSemanticRepository(
  files: ScannedFile[]
): SemanticRepositoryAnalysis {
  const fileSummaries: Record<string, FileSemanticSummary> = {};

  // 1. Core file summaries loop
  for (const file of files) {
    const summary = summarizeFile(file);
    fileSummaries[file.path] = summary;
  }

  // 2. Aggregate directory summaries
  const directorySummaries = summarizeDirectory(fileSummaries);

  // 3. Extract system entrypoints
  const entrypoints = Object.values(fileSummaries).filter(
    (summary) => summary.isEntrypoint
  );

  // 4. Detect HTTP routes & flow tracks
  const { routes, flows } = detectFlowsAndRoutes(fileSummaries);

  return {
    fileSummaries,
    directorySummaries,
    entrypoints,
    routes,
    flows,
  };
}

export * from "./types";
