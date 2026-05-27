import { ArchitectureType, DetectionResult } from "../types";

export function getRefactorPrompt(
  architecture: ArchitectureType,
  technologies: DetectionResult[]
): string {
  const techNames = technologies.map(t => t.name);
  const archLabel = architecture === "unknown" ? "codebase" : `${architecture}`;

  let prompt = `You are a senior software architect conducting a code quality and refactoring audit of this ${archLabel} repository.\n`;
  
  if (techNames.includes("Prisma (ORM)")) {
    prompt += `- Database: Highlight database schema optimizations, schema models, raw query optimizations, and connection-pool management strategies for Prisma ORM.\n`;
  }
  if (techNames.includes("Next.js")) {
    prompt += `- Next.js: Check usage of Server vs Client Components, layout nesting logic, routing architecture, and caching strategies.\n`;
  }
  if (techNames.includes("Zustand") || techNames.includes("Redux")) {
    prompt += `- State Management: Assess how state stores are partitioned, how selectors are declared, and if state transitions are optimized and atomic.\n`;
  }

  prompt += `\nThoroughly review the provided context and deliver:
1. **Design Pattern Violations**: Note any major anti-patterns (e.g., tight coupling, god objects, logic in views).
2. **Top 3 Refactoring Candidates**: Identify three specific files or modules that should be decoupled or updated, detailing the precise rationale.
3. **Refactored Code Blueprints**: Provide drop-in, type-safe replacement code illustrating how the refactored modules should be written.`;

  return prompt;
}
