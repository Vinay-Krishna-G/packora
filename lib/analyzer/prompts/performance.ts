import { ArchitectureType, DetectionResult } from "../types";

export function getPerformancePrompt(
  architecture: ArchitectureType,
  technologies: DetectionResult[]
): string {
  const techNames = technologies.map(t => t.name);

  let prompt = `You are a performance optimization expert auditing a repository built on a ${architecture} architecture.\n`;
  
  if (techNames.includes("React")) {
    prompt += `- React: Evaluate component render cycles, state dependencies, hook dependencies (useEffect, useMemo, useCallback), and virtualized rendering of long lists.\n`;
  }
  if (techNames.includes("Tailwind CSS")) {
    prompt += `- Styling: Identify redundant Tailwind classes, class composition overhead, or layout thrashing.\n`;
  }
  if (techNames.includes("PostgreSQL") || techNames.includes("Prisma (ORM)")) {
    prompt += `- DB Performance: Assess query join patterns, missing indexes on schemas, transaction sizes, or N+1 query scenarios.\n`;
  }

  prompt += `\nReview the provided files and supply a Performance Optimization Plan:
1. **Bottleneck Audit**: Point out specific lines, functions, or queries that will trigger performance bottlenecks.
2. **Computational Load**: Flag any CPU-heavy work running on the browser main-thread.
3. **Optimized Snippets**: Provide exact code upgrades showing how to rewrite the code (e.g. implementing React memoization, caching filters, or indexing database models) to ensure near-zero latency.`;

  return prompt;
}
