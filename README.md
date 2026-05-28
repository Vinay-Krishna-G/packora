# CodeMelt

Structured repository context exports for AI-assisted code understanding.

CodeMelt is a developer-focused utility that scans, filters, and prioritizes repository code and configurations, organizing them into a single, high-density context artifact. These generated context files are optimized for ingestion by Large Language Models (LLMs) during debugging, onboarding, architecture reviews, and general code analysis.

All processing occurs completely locally on your system to protect proprietary code privacy.

---

## Workspace Architecture

CodeMelt is structured as an npm workspaces monorepo:

*   **[apps/web](apps/web)**: A premium Next.js frontend portal that allows users to drag-and-drop local directory files, visually manage inclusion/exclusion rules, analyze semantic repository architectures, and export context packages.
*   **[packages/cli](packages/cli)**: The command-line interface for fast terminal-driven context generation and automation scripts.
*   **[packages/core](packages/core)**: The core processing engine containing the file scanner, the heuristics repository analyzer, importance detectors, and context formatting models.
*   **[packages/shared](packages/shared)**: Shared domain structures, safety boundary limits, and the default ignore rules list.

---

## Core Features

*   **Intelligence Repository Analysis**: Automatically profiles your stack, identifies technologies, rates AI-readiness, and flags architectural patterns.
*   **Granular Export Modes**:
    *   `tiny`: Emits only critical/high-importance files for small prompt windows.
    *   `standard`: Drops low-importance files and binaries.
    *   `deep`: Incorporates all text source files.
    *   `maximum`: Raw, comprehensive codebase export.
*   **Intent Directives**: Customizes the context layout instructions targeting specific workflows (`debugging`, `onboarding`, `architecture`, `security`, `general`).
*   **Semantic Navigation Maps**: Emits layout entrypoints, API endpoints mapping, and logical data flow paths to help LLMs build strong mental models of your system.
*   **Local-First Privacy**: No telemetry, no API keys, and no network transfers.

---

## Performance & Safety Disclosures

CodeMelt prioritizes system stability over raw scan speed. To protect resources, RAM, and CPU on large monorepos or enterprise projects:

*   **Controlled Concurrency**: Concurrency is capped at a batch size of `20` simultaneous reads to prevent thermal spikes and browser/process crashes.
*   **Granular Warning System**: Scans containing more than `500` files or exceeding `10MB` in total raw volume trigger professional, non-alarming warnings about resource consumption.
*   **Early Pruning**: Leverages a highly tuned default ignore ruleset (skipping node_modules, .next, media assets, build structures, and lockfiles) to keep context sizes minimal.
*   **Boundary Ceilings**: Implements maximum memory thresholds (e.g. 1MB per file text cap, 100KB character slicing, and total export limits) to ensure exports fit nicely in typical context windows.

---

## Monorepo Setup & Installation

Ensure you have Node.js version 18 or higher installed on your environment.

### Local Development

1. **Clone the repository and install workspaces**:
   ```bash
   git clone https://github.com/Vinay-Krishna-G/codemelt.git
   cd codemelt
   npm install
   ```

2. **Sequential Workspace Compilation**:
   ```bash
   npm run build
   ```
   *This sequentially compiles shared -> core -> cli -> web ensuring references are cleanly linked.*

3. **Verify Typecheck and Tests**:
   ```bash
   npm run typecheck
   ```

4. **Launch Next.js Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the web portal.

---

## CLI Installation & Usage

To install and run CodeMelt globally in any directory:

```bash
# Install globally from npm registry
npm install -g @codemelt/cli

# Verify installation
codemelt --help

# Initialize sensibly-tuned .codemeltignore file
codemelt init

# Run scan and export context
codemelt export
```

For comprehensive CLI documentation, refer to the [CLI README](packages/cli/README.md).
