import { ScannedFile } from "codemelt-shared";
import { DependencyNode, DependencyEdge, DependencyGraph, FileComplexity } from "./types.js";

// Basic regex to find imports and requires
// Covers: import x from 'y'; import { x } from 'y'; require('y')
const IMPORT_REGEX = /import(?:(?:[\w*\s{},]*)\sfrom\s+)?['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\)/g;
// Basic regex to count exports
const EXPORT_REGEX = /export\s+(?:const|let|var|function|class|interface|type|default|{)/g;

function calculateComplexity(content: string, importCount: number, exportCount: number): FileComplexity {
  const lines = content.split('\\n').length;
  
  if (lines > 300 || importCount > 10 || exportCount > 10) {
    return "high";
  }
  if (lines > 100 || importCount > 5 || exportCount > 5) {
    return "medium";
  }
  return "low";
}

// Simple path resolution (e.g. from apps/web/components/UploadZone.tsx + ../lib/utils -> apps/web/lib/utils)
// Note: This is naive and won't catch TS path aliases perfectly without tsconfig parsing, 
// but it is good enough for v1 heuristic matching.
function resolveImportPath(currentPath: string, importPath: string, allFilePaths: string[]): string | null {
  if (!importPath.startsWith(".")) {
    // Possibly a path alias or an external module. 
    // We can try to see if it exactly matches a file path without extension
    const directMatch = allFilePaths.find(p => p.startsWith(importPath + ".") || p === importPath);
    if (directMatch) return directMatch;
    return null; 
  }

  const parts = currentPath.split('/');
  parts.pop(); // remove file name
  
  const importParts = importPath.split('/');
  for (const p of importParts) {
    if (p === '.') continue;
    if (p === '..') {
      parts.pop();
    } else {
      parts.push(p);
    }
  }
  
  const resolvedBase = parts.join('/');
  
  // Try to find the actual file in the scanned files list
  // It could have .ts, .tsx, .js, .jsx, or /index.ts
  const possiblePaths = [
    resolvedBase,
    resolvedBase + ".ts",
    resolvedBase + ".tsx",
    resolvedBase + ".js",
    resolvedBase + ".jsx",
    resolvedBase + "/index.ts",
    resolvedBase + "/index.tsx",
    resolvedBase + "/index.js",
  ];

  for (const p of possiblePaths) {
    if (allFilePaths.includes(p)) {
      return p;
    }
  }
  
  return null;
}

export function buildDependencyGraph(files: ScannedFile[]): DependencyGraph {
  const nodes = new Map<string, DependencyNode>();
  const edges: DependencyEdge[] = [];
  const allFilePaths = files.map(f => f.path);

  // 1. Initialize nodes
  for (const file of files) {
    if (file.type !== "text") continue;

    // Count imports and exports
    const content = file.content;
    const importsRaw = Array.from(content.matchAll(IMPORT_REGEX)).map(m => m[1] || m[2]);
    const exportCount = (content.match(EXPORT_REGEX) || []).length;
    
    // Deduplicate raw imports
    const uniqueRawImports = Array.from(new Set(importsRaw));

    nodes.set(file.path, {
      id: file.path,
      path: file.path,
      name: file.name,
      purpose: "", // Will be populated by Semantic Summarizer if available, or heuristic
      imports: uniqueRawImports, // Temporary holding raw imports, will be resolved in pass 2
      importedBy: [],
      importance: file.importance,
      complexity: calculateComplexity(content, uniqueRawImports.length, exportCount)
    });
  }

  // 2. Resolve edges
  for (const [path, node] of nodes.entries()) {
    const resolvedImports = new Set<string>();
    
    for (const rawImport of node.imports) {
      const targetPath = resolveImportPath(path, rawImport, allFilePaths);
      if (targetPath && nodes.has(targetPath)) {
        resolvedImports.add(targetPath);
        edges.push({ source: path, target: targetPath });
        
        // Update bidirectional reference
        const targetNode = nodes.get(targetPath)!;
        targetNode.importedBy.push(path);
      }
    }
    
    node.imports = Array.from(resolvedImports);
  }

  return { nodes, edges };
}
