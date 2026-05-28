import { ExtractedPatterns } from "./extractPatterns.js";
import { EntrypointType } from "./types.js";

interface InferredPurpose {
  summary: string;
  isEntrypoint: boolean;
  entrypointType?: EntrypointType;
}

export function inferPurpose(path: string, name: string, patterns: ExtractedPatterns): InferredPurpose {
  const lowerPath = path.toLowerCase();
  const lowerName = name.toLowerCase();
  const keywords = patterns.keywords;

  // --- 1. ENTRYPOINT DETECTION ---
  const isServerEntry = lowerName === "server.js" || lowerName === "server.ts" || lowerPath === "src/main.ts" || lowerPath === "src/index.ts" || lowerPath === "index.js";
  const isFrontendBoot = lowerPath === "src/main.tsx" || lowerPath === "src/index.tsx" || lowerPath === "src/main.jsx" || lowerPath === "src/index.jsx";
  const isAppShell = lowerName === "app.tsx" || lowerName === "app.jsx" || lowerName === "app.vue" || lowerName === "app.svelte";
  const isLayoutRoot = lowerName === "layout.tsx" || lowerName === "layout.jsx" || lowerName === "layout.html";
  const isRouterRoot = lowerName === "routes.ts" || lowerName === "routes.tsx" || lowerName === "routes.js" || lowerName === "page.tsx" && !lowerPath.includes("api");

  if (isServerEntry) {
    return {
      summary: "Server entrypoint file.",
      isEntrypoint: true,
      entrypointType: "server",
    };
  }

  if (isFrontendBoot) {
    return {
      summary: "Frontend client entrypoint.",
      isEntrypoint: true,
      entrypointType: "frontend",
    };
  }

  if (isAppShell) {
    return {
      summary: "Main application router and root layout wrapper.",
      isEntrypoint: true,
      entrypointType: "app-shell",
    };
  }

  if (isLayoutRoot) {
    return {
      summary: "Root layout component structure.",
      isEntrypoint: true,
      entrypointType: "layout-root",
    };
  }

  if (isRouterRoot) {
    return {
      summary: "Router page component.",
      isEntrypoint: true,
      entrypointType: "router-root",
    };
  }

  // --- 2. CONFIGURATION BOUNDARIES ---
  const isConfig = lowerName.includes("config") || lowerName.startsWith(".") || lowerName.endsWith(".json");
  if (isConfig) {
    if (lowerName === "package.json") return { summary: "Project dependency and build script definitions.", isEntrypoint: false };
    if (lowerName === "tsconfig.json") return { summary: "TypeScript compiler settings.", isEntrypoint: false };
    if (lowerName === "tailwind.config.js" || lowerName === "tailwind.config.ts") return { summary: "Tailwind CSS configuration rules.", isEntrypoint: false };
    if (lowerName === "schema.prisma") return { summary: "Prisma database schema and models.", isEntrypoint: false };
    if (lowerName === ".gitignore") return { summary: "Git ignore rules.", isEntrypoint: false };
    return {
      summary: "Project configuration file.",
      isEntrypoint: false,
    };
  }

  // --- 3. CONTROLLERS ---
  const isController = lowerName.endsWith("controller.ts") || lowerName.endsWith("controller.js") || lowerPath.includes("/controllers/") || lowerPath.includes("/controller/");
  if (isController) {
    if (keywords.has("auth")) {
      return { summary: "Controller handling user credentials and session management.", isEntrypoint: false };
    }
    if (keywords.has("db")) {
      return { summary: "Controller handling database requests.", isEntrypoint: false };
    }
    if (keywords.has("billing")) {
      return { summary: "Controller handling billing and webhook operations.", isEntrypoint: false };
    }
    if (keywords.has("upload")) {
      return { summary: "Controller handling file upload operations.", isEntrypoint: false };
    }
    return {
      summary: "Controller mapping incoming requests to backend logic.",
      isEntrypoint: false,
    };
  }

  // --- 4. SERVICES ---
  const isService = lowerName.endsWith("service.ts") || lowerName.endsWith("service.js") || lowerPath.includes("/services/") || lowerPath.includes("/service/");
  if (isService) {
    if (keywords.has("auth")) {
      return { summary: "Service handling user authentication workflows.", isEntrypoint: false };
    }
    if (keywords.has("db")) {
      return { summary: "Service handling database query logic.", isEntrypoint: false };
    }
    if (keywords.has("billing")) {
      return { summary: "Service handling checkout processes.", isEntrypoint: false };
    }
    return {
      summary: "Service layer encapsulating backend operations.",
      isEntrypoint: false,
    };
  }

  // --- 5. MIDDLEWARE ---
  const isMiddleware = lowerName.includes("middleware") || lowerPath.includes("/middleware/") || lowerPath.includes("/middlewares/");
  if (isMiddleware) {
    if (keywords.has("auth")) {
      return { summary: "Middleware handling user token verification.", isEntrypoint: false };
    }
    if (keywords.has("upload")) {
      return { summary: "Middleware handling file size and type filters.", isEntrypoint: false };
    }
    return {
      summary: "Middleware handling request routing filters.",
      isEntrypoint: false,
    };
  }

  // --- 6. REACT/UI VIEWS ---
  const isUI = lowerName.endsWith(".tsx") || lowerName.endsWith(".jsx") || lowerName.endsWith(".vue") || lowerName.endsWith(".svelte") || lowerPath.includes("/components/") || lowerPath.includes("/views/");
  if (isUI) {
    if (lowerName.includes("navbar") || lowerName.includes("sidebar") || lowerName.includes("header")) {
      return { summary: "Navigation component for headers or sidebars.", isEntrypoint: false };
    }
    if (lowerName.includes("modal") || lowerName.includes("dialog") || lowerName.includes("drawer")) {
      return { summary: "Interactive modal dialog component.", isEntrypoint: false };
    }
    if (lowerName.includes("button") || lowerName.includes("input") || lowerName.includes("badge") || lowerName.includes("select")) {
      return { summary: "Reusable form controls and UI elements.", isEntrypoint: false };
    }
    if (keywords.has("state")) {
      return { summary: "Interactive component bound to state management.", isEntrypoint: false };
    }
    return {
      summary: "User interface view component.",
      isEntrypoint: false,
    };
  }

  // --- 7. ROUTE HANDLERS ---
  const isRouteFile = lowerName.includes("route") || lowerPath.includes("/routes/") || lowerPath.includes("/api/");
  if (isRouteFile) {
    return {
      summary: "API route endpoint handler configuration.",
      isEntrypoint: false,
    };
  }

  // --- 8. UTILITIES ---
  const isUtil = lowerName.includes("util") || lowerName.includes("helper") || lowerPath.includes("/utils/") || lowerPath.includes("/helpers/") || lowerPath.includes("/lib/");
  if (isUtil) {
    if (keywords.has("auth")) {
      return { summary: "Utility functions handling credentials.", isEntrypoint: false };
    }
    if (keywords.has("db")) {
      return { summary: "Utility functions handling database pooling.", isEntrypoint: false };
    }
    return {
      summary: "General utility functions.",
      isEntrypoint: false,
    };
  }

  // --- 9. DEFAULT FALLBACK ---
  return {
    summary: "Logical repository code file.",
    isEntrypoint: false,
  };
}
