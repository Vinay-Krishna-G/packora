export interface ExtractedPatterns {
  exports: string[];
  imports: string[];
  functions: string[];
  routes: { method: string; path: string }[];
  keywords: Set<string>;
}

const KEYWORD_GROUPS: Record<string, string[]> = {
  auth: ["auth", "login", "register", "signup", "signin", "jwt", "token", "password", "session", "cookie", "passport", "bcrypt", "oauth"],
  db: ["db", "database", "query", "prisma", "drizzle", "mongo", "mongoose", "postgres", "sql", "schema", "model", "findmany", "insert", "select"],
  state: ["state", "store", "dispatch", "reducer", "slice", "createslice", "selector", "atom", "zustand", "redux", "jotai"],
  realtime: ["socket", "io", "ws", "websocket", "pusher", "realtime", "subscribe", "broadcast", "emit", "on("],
  billing: ["stripe", "checkout", "payment", "charge", "cart", "order", "billing", "invoice", "sub"],
  upload: ["upload", "multer", "s3", "storage", "file", "cloudinary", "aws-sdk"],
};

export function extractPatterns(content: string, path: string, name: string): ExtractedPatterns {
  const exports: string[] = [];
  const imports: string[] = [];
  const functions: string[] = [];
  const routes: { method: string; path: string }[] = [];
  const keywords = new Set<string>();

  // Skip binary, oversized or empty contents
  if (!content || content.startsWith("[") && content.endsWith("]")) {
    return { exports, imports, functions, routes, keywords };
  }

  const lowerContent = content.toLowerCase();

  // 1. Keyword Scan
  for (const [group, words] of Object.entries(KEYWORD_GROUPS)) {
    for (const word of words) {
      if (lowerContent.includes(word)) {
        keywords.add(group);
        break; // Once group is identified, move to next
      }
    }
  }

  // 2. Regex Scan (Process line-by-line or moderate size chunks to protect browser CPU)
  const lines = content.split("\n");
  
  const exportRegex = /\bexport\s+(?:const|let|var|function|async\s+function|class|type|interface)\s+([a-zA-Z0-9_]+)/;
  const importRegex = /\bimport\s+.*\s+from\s+['"]([^'"]+)['"]/;
  const functionRegex = /\bfunction\s+([a-zA-Z0-9_]+)|\bconst\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\((?:[^)]*)\)\s*=>/;
  const expressRouteRegex = /\b(?:router|app)\.(get|post|put|delete|patch)\(['"]([^'"]+)['"]/;
  const nextApiRegex = /fetch\(['"]([^'"]+)['"]|axios\.(get|post|put|delete)\(['"]([^'"]+)['"]/;

  for (const line of lines) {
    // Limit processing to reasonable length lines
    if (line.length > 500) continue;

    // A. Exports
    const exportMatch = line.match(exportRegex);
    if (exportMatch && exportMatch[1]) {
      exports.push(exportMatch[1]);
    }

    // B. Imports
    const importMatch = line.match(importRegex);
    if (importMatch && importMatch[1]) {
      imports.push(importMatch[1]);
    }

    // C. Local functions
    const fnMatch = line.match(functionRegex);
    const fnName = fnMatch ? (fnMatch[1] || fnMatch[2]) : null;
    if (fnName && fnName !== "const" && fnName !== "let") {
      functions.push(fnName);
    }

    // D. Express routes
    const routeMatch = line.match(expressRouteRegex);
    if (routeMatch && routeMatch[1] && routeMatch[2]) {
      routes.push({
        method: routeMatch[1].toUpperCase(),
        path: routeMatch[2],
      });
    }

    // E. Fetch/Axios network references (flow intelligence helper)
    const netMatch = line.match(nextApiRegex);
    if (netMatch) {
      const endpoint = netMatch[1] || netMatch[2];
      if (endpoint && endpoint.startsWith("/")) {
        routes.push({
          method: line.includes("post") || line.includes("POST") ? "POST" : "GET",
          path: endpoint,
        });
      }
    }
  }

  return {
    exports: Array.from(new Set(exports)).slice(0, 10), // cap at 10 to keep it dense
    imports: Array.from(new Set(imports)).slice(0, 10),
    functions: Array.from(new Set(functions)).slice(0, 15),
    routes,
    keywords,
  };
}
