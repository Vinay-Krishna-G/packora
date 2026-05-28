import { FileSemanticSummary, RouteDetail, RequestFlow } from "./types.js";

export function detectFlowsAndRoutes(
  fileSummaries: Record<string, FileSemanticSummary>
): { routes: RouteDetail[]; flows: RequestFlow[] } {
  const routes: RouteDetail[] = [];
  const flows: RequestFlow[] = [];

  const fileKeys = Object.keys(fileSummaries);

  // 1. Gather all registered routes across files
  for (const [filePath, summary] of Object.entries(fileSummaries)) {
    if (summary.routes && summary.routes.length > 0) {
      for (const r of summary.routes) {
        const parts = r.split(" ");
        if (parts.length > 1) {
          const method = parts[0].toUpperCase() as any;
          const path = parts[1];
          
          // Avoid duplicate routes registration
          const exists = routes.some(existing => existing.path === path && existing.method === method);
          if (!exists) {
            routes.push({
              path,
              method,
              handlerFile: filePath,
            });
          }
        }
      }
    }
  }

  // 2. Speculative pipelines are completely disabled to prevent hallucinations.
  // We strictly return an empty array for flows.
  return { routes, flows: [] };
}
