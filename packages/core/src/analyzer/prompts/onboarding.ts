import { ArchitectureType, DetectionResult } from "../types.js";

export function getOnboardingPrompt(
  architecture: ArchitectureType,
  technologies: DetectionResult[]
): string {
  const techNames = technologies.map(t => t.name);
  const archLabel = architecture === "unknown" ? "software codebase" : `${architecture} repository`;

  let prompt = `You are a staff engineer onboarding onto this ${archLabel}.\n`;
  if (techNames.length > 0) {
    prompt += `The technology stack includes: ${techNames.join(", ")}.\n`;
  }
  
  prompt += `\nReview the provided repository context and compile an onboarding document containing:
1. **Architectural Overview**: Explain the high-level data flow and structure.
2. **Key Directory Maps**: Explain what each folder is responsible for.
3. **Local Setup Guide**: Map out the steps I need to take to compile, configure, and boot the application locally based on the configurations and dependencies present.
4. **Initial Code Tracing**: Identify where the critical entrypoints, schemas, or main routes are located to start reading code.`;

  return prompt;
}
