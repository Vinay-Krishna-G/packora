# Context Export Modes & Intent Specializations

CodeMelt enables granular filtering density control to tailor generated codebases context outputs to the specific tasks and parameters you are solving.

## Context Export Budget Modes (`--mode`)

1. **Tiny (`tiny`)**
   - Strictly filters down to critical and high-importance files only. Omits low/normal importance files, binaries, and oversized files. Optimized for maximum token savings and very specific queries.

2. **Standard (`standard`)**
   - The default mode. Includes most text files but automatically filters out low-importance files, binaries, and oversized files. Perfect for standard functional questions to conserve LLM tokens space.

3. **Deep (`deep`)**
   - Includes all eligible text source files regardless of importance, omitting only oversized and binary files. Optimized for comprehensive refactoring and whole-app evaluations.

4. **Maximum (`maximum`)**
   - Emits everything that passes the ignore filters, regardless of size or type, forcing truncation only at the very highest memory safety limits. Use with caution on large repos.


## Context Goals Specialization (`--intent`)

Specialization flags append targeted directive blueprints instructing LLM models on what variables to prioritize during context ingestion:

- **General (`general`)**: Standard, well-rounded repository walkthrough.
- **Onboarding (`onboarding`)**: Architectural maps, folder directories guides, and setup guidelines.
- **Debugging (`debugging`)**: Type tracing, configs check, and boundary conditions diagnostics.
- **Architecture (`architecture`)**: Tight-coupling audits, db schemas alignments, and design patterns consistency.
- **Security (`security`)**: Third-party package licenses check, cryptographic setups, and input sanitization layers.
