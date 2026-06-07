import { FileImportance, normalizePath } from "codemelt-shared";

export function detectImportance(
  path: string,
  name: string
): FileImportance {
  const normalized = normalizePath(path);
  const lowerPath = normalized.toLowerCase();
  const lowerName = name.toLowerCase();

  // --- 1. CRITICAL: Entrypoints & Core Configs ---
  const criticalConfigs = new Set([
    "package.json",
    "tsconfig.json",
    "schema.prisma",
    "drizzle.config.ts",
    "drizzle.config.js",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "vite.config.ts",
    "vite.config.js",
    "tailwind.config.js",
    "tailwind.config.ts",
    "tailwind.config.cjs",
    ".gitignore"
  ]);

  if (criticalConfigs.has(lowerName)) {
    return "critical";
  }

  const criticalEntrypoints = new Set([
    "src/index.ts",
    "src/index.tsx",
    "src/main.ts",
    "src/main.tsx",
    "src/app.tsx",
    "src/app.ts",
    "app/layout.tsx",
    "app/page.tsx",
    "pages/_app.tsx",
    "pages/index.tsx"
  ]);

  if (criticalEntrypoints.has(lowerPath) || criticalEntrypoints.has(normalized)) {
    return "critical";
  }

  // --- 2. HIGH: Central Logic & Systems Routing ---
  if (
    lowerPath.includes("route") ||
    lowerPath.includes("controller") ||
    lowerPath.includes("schema") ||
    lowerPath.includes("store") ||
    lowerPath.includes("service") ||
    lowerPath.includes("models/") ||
    lowerPath.includes("db/") ||
    lowerName.endsWith(".d.ts")
  ) {
    return "high";
  }

  // --- 3. LOW: Secondary Configurations & Noise ---
  const lowConfigs = new Set([
    "tsconfig.node.json",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".prettierrc",
    ".eslintrc",
    ".eslintrc.json",
    "eslint.config.js",
    ".env.example",
    ".env.template"
  ]);

  if (lowConfigs.has(lowerName) || lowerName.startsWith(".env")) {
    return "low";
  }

  // --- 4. NORMAL: Standard logic files ---
  return "normal";
}
