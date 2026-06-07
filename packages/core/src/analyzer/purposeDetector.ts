import { ScannedFile } from "codemelt-shared";
import { PurposeResult, RepositoryPurpose } from "./types.js";

export function detectPurpose(
  files: ScannedFile[],
  dependencies: Set<string>
): PurposeResult {
  const scores: Record<RepositoryPurpose, number> = {
    "developer-tooling": 0.0,
    "saas-dashboard": 0.0,
    "chat-application": 0.0,
    "ecommerce-platform": 0.0,
    "cms": 0.0,
    "portfolio": 0.0,
    "api-platform": 0.0,
    "unknown": 0.0,
  };

  const signals: Record<RepositoryPurpose, string[]> = {
    "developer-tooling": [],
    "saas-dashboard": [],
    "chat-application": [],
    "ecommerce-platform": [],
    "cms": [],
    "portfolio": [],
    "api-platform": [],
    "unknown": [],
  };

  const hasFile = (name: string) => files.some((f) => f.name.toLowerCase() === name.toLowerCase());
  const hasDirectory = (dirName: string) => files.some((f) => f.path.includes(`/${dirName}/`) || f.path.startsWith(`${dirName}/`));

  // --- Heuristic Signals Mapping ---

  // 1. Developer Tooling Signals
  const genericDevDeps = ["typescript", "eslint", "prettier"];
  const specializedDevDeps = ["commander", "yargs", "tsup", "esbuild"];
  for (const dep of genericDevDeps) {
    if (dependencies.has(dep)) {
      scores["developer-tooling"] += 0.05;
      signals["developer-tooling"].push(`dependency:${dep}`);
    }
  }
  for (const dep of specializedDevDeps) {
    if (dependencies.has(dep)) {
      scores["developer-tooling"] += 0.25;
      signals["developer-tooling"].push(`dependency:${dep}`);
    }
  }
  const hasCliFolder = files.some(
    (f) =>
      f.path.includes("/cli/") ||
      f.path.startsWith("cli/") ||
      f.path.includes("/bin/") ||
      f.path.startsWith("bin/")
  );
  if (hasDirectory("scripts") || hasDirectory("bin") || hasDirectory("cli") || hasCliFolder || hasFile("eslint.config.js") || hasFile("cli.ts")) {
    scores["developer-tooling"] += 0.35;
    signals["developer-tooling"].push("file:tooling-configs");
  }

  // 2. SaaS Dashboard Signals
  const saasDeps = ["recharts", "chart.js", "d3", "stripe", "@stripe/stripe-js"];
  for (const dep of saasDeps) {
    if (dependencies.has(dep)) {
      scores["saas-dashboard"] += 0.35;
      signals["saas-dashboard"].push(`dependency:${dep}`);
    }
  }
  if (hasDirectory("dashboard") || hasDirectory("admin") || hasDirectory("billing") || hasDirectory("payments")) {
    scores["saas-dashboard"] += 0.40;
    signals["saas-dashboard"].push("folder:management-routes");
  }

  // 3. Chat Application Signals
  const chatDeps = ["socket.io", "socket.io-client", "pusher", "pusher-js", "ws"];
  for (const dep of chatDeps) {
    if (dependencies.has(dep)) {
      scores["chat-application"] += 0.45;
      signals["chat-application"].push(`dependency:${dep}`);
    }
  }
  if (hasDirectory("chat") || hasDirectory("messages") || hasDirectory("rooms")) {
    scores["chat-application"] += 0.45;
    signals["chat-application"].push("folder:communications");
  }

  // 4. Ecommerce Platform Signals
  if (dependencies.has("stripe") || dependencies.has("@stripe/stripe-js") || dependencies.has("@shopify/shopify-api")) {
    scores["ecommerce-platform"] += 0.45;
    signals["ecommerce-platform"].push("dependency:billing-client");
  }
  if (hasDirectory("cart") || hasDirectory("checkout") || hasDirectory("products") || hasDirectory("orders")) {
    scores["ecommerce-platform"] += 0.45;
    signals["ecommerce-platform"].push("folder:checkout-funnel");
  }

  // 5. CMS / Static Blog Signals
  const cmsDeps = ["strapi", "contentful", "@sanity/client", "ghost", "wordpress"];
  for (const dep of cmsDeps) {
    if (dependencies.has(dep)) {
      scores["cms"] += 0.50;
      signals["cms"].push(`dependency:${dep}`);
    }
  }
  if (hasDirectory("posts") || hasDirectory("content") || hasDirectory("blog") || hasDirectory("articles")) {
    scores["cms"] += 0.35;
    signals["cms"].push("folder:content-data");
  }

  // 6. Portfolio Signals
  if (hasFile("portfolio") || hasFile("resume.pdf") || hasDirectory("portfolio")) {
    scores["portfolio"] += 0.60;
    signals["portfolio"].push("file:portfolio-assets");
  }

  // 7. API Platform Signals
  const apiDeps = ["express", "@nestjs/core", "fastify", "koa", "swagger-ui-express", "@tuner/trpc"];
  for (const dep of apiDeps) {
    if (dependencies.has(dep)) {
      scores["api-platform"] += 0.45;
      signals["api-platform"].push(`dependency:${dep}`);
    }
  }
  if (hasDirectory("routes") || hasDirectory("controllers") || hasDirectory("api") || hasDirectory("endpoints")) {
    scores["api-platform"] += 0.40;
    signals["api-platform"].push("folder:routing-handlers");
  }

  // --- Resolve highest scoring purpose ---
  let bestPurpose: RepositoryPurpose = "unknown";
  let maxScore = 0.0;

  for (const [purpose, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestPurpose = purpose as RepositoryPurpose;
    }
  }

  const finalConfidence = Math.min(maxScore, 1.0);

  const getConfidenceTier = (score: number): "Strong" | "Moderate" | "Low" => {
    if (score >= 0.8) return "Strong";
    if (score >= 0.5) return "Moderate";
    return "Low";
  };

  if (finalConfidence < 0.25) {
    return {
      name: "unknown",
      confidence: 0.0,
      confidenceTier: "Low",
      matchedSignals: [],
    };
  }

  return {
    name: bestPurpose,
    confidence: finalConfidence,
    confidenceTier: getConfidenceTier(finalConfidence),
    matchedSignals: signals[bestPurpose] || [],
  };
}
