import { ScannedFile } from "../scanner/fileTypes";
import { FileSemanticSummary } from "./types";
import { extractPatterns } from "./extractPatterns";
import { inferPurpose } from "./inferPurpose";

export function summarizeFile(file: ScannedFile): FileSemanticSummary {
  // Extract regex patterns from the text content
  const patterns = extractPatterns(file.content, file.path, file.name);

  // Infer the semantic purpose of the file
  const purpose = inferPurpose(file.path, file.name, patterns);

  // Map router details if discovered
  const routeStrings: string[] = [];
  if (patterns.routes.length > 0) {
    for (const r of patterns.routes) {
      routeStrings.push(`${r.method} ${r.path}`);
    }
  }

  // Next.js Route handlers (app/api/.../route.ts)
  if (file.path.includes("app/api/") && (file.name.startsWith("route.ts") || file.name.startsWith("route.js"))) {
    // Extract endpoint path from the relative path
    const parts = file.path.split("app/api/");
    if (parts.length > 1) {
      const endpoint = "/api/" + parts[1].replace(/\/route\.(ts|js)$/, "");
      
      // Map exported methods
      const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
      for (const m of methods) {
        if (patterns.exports.includes(m)) {
          routeStrings.push(`${m} ${endpoint}`);
        }
      }
      
      // If no explicit method exports were caught, register standard GET/POST
      if (routeStrings.length === 0) {
        routeStrings.push(`ALL ${endpoint}`);
      }
    }
  }

  return {
    path: file.path,
    name: file.name,
    summary: purpose.summary,
    importance: file.importance,
    isEntrypoint: purpose.isEntrypoint,
    entrypointType: purpose.entrypointType,
    routes: routeStrings.length > 0 ? routeStrings : undefined,
    exports: patterns.exports.length > 0 ? patterns.exports : undefined,
    imports: patterns.imports.length > 0 ? patterns.imports : undefined,
  };
}
