# @codemelt/cli

Structured repository context exports for AI-assisted code understanding.

CodeMelt is a calm, developer-focused command-line tool that extracts codebase structures, configuration files, and critical modules into a single, high-density context file optimized for ingestion by LLMs.

---

## Installation

Ensure Node.js version 18 or higher is installed.

```bash
# Install globally from npm registry
npm install -g @codemelt/cli
```

Verify that the CLI has been successfully installed:

```bash
codemelt --version
codemelt --help
```

---

## Core Commands & Workflow

### 1. Initialize Ignore Profile
Initialize a custom `.codemeltignore` file containing sensible developer defaults (ignoring build folders, dependency directories, binary files, lockfiles, and generated documents):

```bash
codemelt init
```

### 2. Export Repository Context
Export the directory structures and semantic file contexts into a file:

```bash
# Standard markdown export to process.cwd()
codemelt export

# Export custom directory to XML format
codemelt export /path/to/project -f xml

# Export in Deep mode with a Debugging intent directive
codemelt export -m deep -i debugging -o build-debug-context.md
```

---

## Options & Arguments

```text
Usage: codemelt export [options] [directory]

Export repository files and architecture intelligence into a structured context.

Arguments:
  directory           The path to the target directory to scan (default: process.cwd())

Options:
  -f, --format <format>  Export output format (markdown, xml) (default: "markdown")
  -m, --mode <mode>      Extraction mode (tiny, standard, deep, maximum) (default: "standard")
  -i, --intent <intent>  Context goals intention (general, debugging, onboarding, architecture, security) (default: "general")
  -o, --output <output>  Custom context export destination filename
  -h, --help             display help for command
```

### Export Extraction Modes
*   **`tiny`**: Emits only critical/high-importance configurations and files (like `package.json`, `tsconfig.json`) to fit inside small prompts.
*   **`standard`**: Excludes low-importance files and binaries; perfect for daily debugging.
*   **`deep`**: Indexes all text files, ignoring only typical build cache outputs and media folders.
*   **`maximum`**: Comprehensive index of everything scanned in the directory.

---

## Ignore Resolution Rules

CodeMelt prioritizes directory stability by performing fast, early path pruning during recursion:
1.  Loads default rules (e.g. `node_modules`, `.next`, `dist`, `.git`).
2.  Merges `.codemeltignore` if present in the scanning root.
3.  Merges `.gitignore` rules dynamically to align with your source control.

To add custom skips, append standard glob match patterns to your `.codemeltignore` file.

---

## Troubleshooting

### Low Performance or RAM Spikes on Large Projects
*   **Issue**: Scanning an enterprise monorepo or highly nested workspace is slow.
*   **Solution**: CodeMelt uses a concurrency batch size of `20` to protect your CPU/RAM. For massive repos, refine your `.codemeltignore` to skip large generated directories (e.g. logs, testing dumps, public static assets).
```
