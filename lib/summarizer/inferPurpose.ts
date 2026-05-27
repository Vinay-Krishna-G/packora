import { ExtractedPatterns } from "./extractPatterns";
import { EntrypointType } from "./types";

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
      summary: "Primary server entrypoint bootstraps listener routing, database links, and middleware pipes.",
      isEntrypoint: true,
      entrypointType: "server",
    };
  }

  if (isFrontendBoot) {
    return {
      summary: "Client entrypoint bootstrapping global stylesheet bundles, layout structures, and React providers.",
      isEntrypoint: true,
      entrypointType: "frontend",
    };
  }

  if (isAppShell) {
    return {
      summary: "Global application shell coordinates top-level states and routing view layouts.",
      isEntrypoint: true,
      entrypointType: "app-shell",
    };
  }

  if (isLayoutRoot) {
    return {
      summary: "Core workspace structural layout setting up CSS variables, header navigation, and child wrappers.",
      isEntrypoint: true,
      entrypointType: "layout-root",
    };
  }

  if (isRouterRoot) {
    return {
      summary: "Primary application page node resolving specific route URLs and mounting core screens.",
      isEntrypoint: true,
      entrypointType: "router-root",
    };
  }

  // --- 2. CONFIGURATION BOUNDARIES ---
  const isConfig = lowerName.includes("config") || lowerName.startsWith(".") || lowerName.endsWith(".json");
  if (isConfig) {
    if (lowerName === "package.json") return { summary: "Workspace dependencies registry and build command configurations.", isEntrypoint: false };
    if (lowerName === "tsconfig.json") return { summary: "TypeScript compiler options and type resolution boundary definitions.", isEntrypoint: false };
    if (lowerName === "tailwind.config.js" || lowerName === "tailwind.config.ts") return { summary: "Tailwind utility engine layout variables and stylesheet triggers.", isEntrypoint: false };
    if (lowerName === "schema.prisma") return { summary: "Prisma ORM database schema definitions, relations, and generators setup.", isEntrypoint: false };
    if (lowerName === ".gitignore") return { summary: "Git version control file and directories exclusion rules definition.", isEntrypoint: false };
    return {
      summary: "System configuration file setting up workspace environments, compilation, or linter rules.",
      isEntrypoint: false,
    };
  }

  // --- 3. CONTROLLERS ---
  const isController = lowerName.endsWith("controller.ts") || lowerName.endsWith("controller.js") || lowerPath.includes("/controllers/") || lowerPath.includes("/controller/");
  if (isController) {
    if (keywords.has("auth")) {
      return { summary: "Handles credentials validations, user registration, and secure JWT session creation.", isEntrypoint: false };
    }
    if (keywords.has("db")) {
      return { summary: "Coordinates relational/document database transactions, payload filters, and entity updates.", isEntrypoint: false };
    }
    if (keywords.has("billing")) {
      return { summary: "Processes Stripe billing checkouts, transaction states, and subscription webhooks.", isEntrypoint: false };
    }
    if (keywords.has("upload")) {
      return { summary: "Processes multiform files buffering, disk validations, and cloud asset allocations.", isEntrypoint: false };
    }
    return {
      summary: "Request controller mapping URI routes to business triggers and formatting payload outputs.",
      isEntrypoint: false,
    };
  }

  // --- 4. SERVICES ---
  const isService = lowerName.endsWith("service.ts") || lowerName.endsWith("service.js") || lowerPath.includes("/services/") || lowerPath.includes("/service/");
  if (isService) {
    if (keywords.has("auth")) {
      return { summary: "Orchestrates credential checks, user account lookup, and token generation adapters.", isEntrypoint: false };
    }
    if (keywords.has("db")) {
      return { summary: "Direct ORM query logic service, isolating database calls and model structures.", isEntrypoint: false };
    }
    if (keywords.has("billing")) {
      return { summary: "Payment gateway integration service wrapping invoice and checkouts pipelines.", isEntrypoint: false };
    }
    return {
      summary: "Business service logic module encapsulating shared helpers and third-party APIs.",
      isEntrypoint: false,
    };
  }

  // --- 5. MIDDLEWARE ---
  const isMiddleware = lowerName.includes("middleware") || lowerPath.includes("/middleware/") || lowerPath.includes("/middlewares/");
  if (isMiddleware) {
    if (keywords.has("auth")) {
      return { summary: "Security gateway middleware validating JWT cookie authorization tokens.", isEntrypoint: false };
    }
    if (keywords.has("upload")) {
      return { summary: "Upload boundary filter validating sizes and incoming file types parameters.", isEntrypoint: false };
    }
    return {
      summary: "Request filter middleware validating incoming schemas or sanitizing routing requests.",
      isEntrypoint: false,
    };
  }

  // --- 6. REACT/UI VIEWS ---
  const isUI = lowerName.endsWith(".tsx") || lowerName.endsWith(".jsx") || lowerName.endsWith(".vue") || lowerName.endsWith(".svelte") || lowerPath.includes("/components/") || lowerPath.includes("/views/");
  if (isUI) {
    if (lowerName.includes("navbar") || lowerName.includes("sidebar") || lowerName.includes("header")) {
      return { summary: "Primary layouts navigation node housing branding elements and links.", isEntrypoint: false };
    }
    if (lowerName.includes("modal") || lowerName.includes("dialog") || lowerName.includes("drawer")) {
      return { summary: "Interactive workflow overlay modal dialog housing context-dependent actions.", isEntrypoint: false };
    }
    if (lowerName.includes("button") || lowerName.includes("input") || lowerName.includes("badge") || lowerName.includes("select")) {
      return { summary: "Stateless atomic component rendering standard reusable visual handles.", isEntrypoint: false };
    }
    if (keywords.has("state")) {
      return { summary: "Interactive view module binding UI elements triggers to state management.", isEntrypoint: false };
    }
    return {
      summary: "Logical visual component rendering markup nodes and processing user interactions.",
      isEntrypoint: false,
    };
  }

  // --- 7. ROUTE HANDLERS ---
  const isRouteFile = lowerName.includes("route") || lowerPath.includes("/routes/") || lowerPath.includes("/api/");
  if (isRouteFile) {
    return {
      summary: "HTTP endpoints route configuration routing URLs to execute logical handlers.",
      isEntrypoint: false,
    };
  }

  // --- 8. UTILITIES ---
  const isUtil = lowerName.includes("util") || lowerName.includes("helper") || lowerPath.includes("/utils/") || lowerPath.includes("/helpers/") || lowerPath.includes("/lib/");
  if (isUtil) {
    if (keywords.has("auth")) {
      return { summary: "Security cryptographic helper hashing passwords or signing bearer keys.", isEntrypoint: false };
    }
    if (keywords.has("db")) {
      return { summary: "Database adapter bootstrapping pooling and in-memory caching clients.", isEntrypoint: false };
    }
    return {
      summary: "Stateless workspace helper utility exporting clean functional routines.",
      isEntrypoint: false,
    };
  }

  // --- 9. DEFAULT FALLBACK ---
  return {
    summary: "Logical repository code file containing core routines and logical bindings.",
    isEntrypoint: false,
  };
}
