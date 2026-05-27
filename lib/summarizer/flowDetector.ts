import { FileSemanticSummary, RouteDetail, RequestFlow } from "./types";

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

  // 2. Trace and establish key workflow pipelines deterministically
  const hasAuth = fileKeys.some(k => k.toLowerCase().includes("auth"));
  const hasPrompt = fileKeys.some(k => k.toLowerCase().includes("prompt"));
  const hasUpload = fileKeys.some(k => k.toLowerCase().includes("upload"));
  const hasBilling = fileKeys.some(k => k.toLowerCase().includes("billing") || k.toLowerCase().includes("payment") || k.toLowerCase().includes("stripe"));

  // Pipeline A: Authentication & Session flow
  if (hasAuth) {
    const steps = ["Frontend component (pages/login)"];
    
    const clientAuthService = fileKeys.find(k => k.includes("services/auth") || k.includes("authService"));
    if (clientAuthService) {
      steps.push(`authService (API Client)`);
    } else {
      steps.push("network client fetch()");
    }

    const route = routes.find(r => r.path.includes("auth") || r.path.includes("login"));
    if (route) {
      steps.push(`${route.method} ${route.path} (API endpoint)`);
      steps.push(`${route.handlerFile.split("/").pop()} (Controller handler)`);
    } else {
      steps.push("POST /api/auth/login");
      const controller = fileKeys.find(k => k.includes("controller") && k.includes("auth"));
      if (controller) steps.push(controller.split("/").pop()!);
    }

    const schema = fileKeys.find(k => k.includes("model") && k.includes("user"));
    if (schema) {
      steps.push(`User database model (${schema.split("/").pop()})`);
    } else {
      steps.push("Database User Schema");
    }

    flows.push({
      name: "Authentication credentials verification pipeline",
      steps,
    });
  }

  // Pipeline B: Prompt/AI Context Generation flow
  if (hasPrompt) {
    const steps = ["Dashboard interface (FileList)"];

    const clientPromptService = fileKeys.find(k => k.includes("services/prompt") || k.includes("promptService"));
    if (clientPromptService) {
      steps.push(`promptService (API Client)`);
    } else {
      steps.push("network client fetch()");
    }

    const route = routes.find(r => r.path.includes("prompt") || r.path.includes("context"));
    if (route) {
      steps.push(`${route.method} ${route.path} (API endpoint)`);
      steps.push(`${route.handlerFile.split("/").pop()} (Controller handler)`);
    } else {
      steps.push("POST /api/prompts");
      const controller = fileKeys.find(k => k.includes("controller") && k.includes("prompt"));
      if (controller) steps.push(controller.split("/").pop()!);
    }

    const schema = fileKeys.find(k => k.includes("model") && k.includes("prompt"));
    if (schema) {
      steps.push(`Prompt model layer (${schema.split("/").pop()})`);
    } else {
      steps.push("Database prompt logs");
    }

    flows.push({
      name: "AI Prompt templates validation & loading flow",
      steps,
    });
  }

  // Pipeline C: Cloud upload buffering flow
  if (hasUpload) {
    const steps = ["UploadZone dashboard (drag-n-drop dropzone)"];

    const clientUploadService = fileKeys.find(k => k.includes("services/upload") || k.includes("uploadService"));
    if (clientUploadService) {
      steps.push(`uploadService (API Client)`);
    }

    const route = routes.find(r => r.path.includes("upload") || r.path.includes("file"));
    if (route) {
      steps.push(`${route.method} ${route.path} (API endpoint)`);
      steps.push(`${route.handlerFile.split("/").pop()} (Controller handler)`);
    } else {
      steps.push("POST /api/uploads");
      const controller = fileKeys.find(k => k.includes("controller") && k.includes("upload"));
      if (controller) steps.push(controller.split("/").pop()!);
    }

    steps.push("Cloud storage buffer (Disk / S3 bucket)");

    flows.push({
      name: "File parsing and context buffer pipeline",
      steps,
    });
  }

  // Pipeline D: Payments webhook updates flow
  if (hasBilling) {
    const steps = ["Payment checkout pricing page"];

    const route = routes.find(r => r.path.includes("billing") || r.path.includes("checkout") || r.path.includes("webhook"));
    if (route) {
      steps.push(`${route.method} ${route.path} (Stripe checkout)`);
      steps.push(`${route.handlerFile.split("/").pop()} (Webhook controller)`);
    } else {
      steps.push("POST /api/billing/webhook");
    }

    steps.push("Stripe Webhook processor");
    steps.push("Database Subscription update");

    flows.push({
      name: "Payment subcription licensing pipeline",
      steps,
    });
  }

  // If no flows matched, synthesize a standard frontend-to-logic fallback pipeline
  if (flows.length === 0) {
    const steps = ["Client view UI component"];
    const routerRoot = fileKeys.find(k => k.includes("route") || k.includes("App.tsx") || k.includes("main.tsx"));
    if (routerRoot) {
      steps.push(`App shell router (${routerRoot.split("/").pop()})`);
    }
    steps.push("logical codebase execution");

    flows.push({
      name: "General frontend context interaction flow",
      steps,
    });
  }

  return { routes, flows };
}
