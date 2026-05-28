import { ArchitectureType, DetectionResult, AIWorkflowPrompt } from "./types.js";
import { getOnboardingPrompt } from "./prompts/onboarding.js";
import { getRefactorPrompt } from "./prompts/refactor.js";
import { getPerformancePrompt } from "./prompts/performance.js";

export function generateWorkflows(
  architecture: ArchitectureType,
  technologies: DetectionResult[]
): AIWorkflowPrompt[] {
  return [
    {
      title: "Project Onboarding",
      description: "Instructs the AI to guide a new developer through the codebase topology, entrypoints, and local workspace boot instructions.",
      prompt: getOnboardingPrompt(architecture, technologies)
    },
    {
      title: "Refactoring & Abstraction",
      description: "Instructs the AI to audit files for design violations, locate candidate files for refactoring, and provide drop-in cleaner codes.",
      prompt: getRefactorPrompt(architecture, technologies)
    },
    {
      title: "Performance Optimization",
      description: "Instructs the AI to analyze computational loads, locate memory/rendering bottlenecks, and provide high-efficiency replacements.",
      prompt: getPerformancePrompt(architecture, technologies)
    }
  ];
}
