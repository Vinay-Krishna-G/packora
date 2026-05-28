# Ignore Rules & Gitignore Interoperability

CodeMelt incorporates a double-layer ignore parsing engine to keep your generated context files lightweight, relevant, and secure.

## Default Ignore Boundaries

By default, CodeMelt filters out common build noise, dependency trees, lockfiles, and media files:

- **Dependencies**: `node_modules` (saves 90%+ context size)
- **Lockfiles**: `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
- **Build folders**: `.next`, `dist`, `build`, `coverage`, `*.tsbuildinfo`
- **Environment variables**: `.env`, `.env.*` (prevents API key leakage)
- **Media Assets**: Images, videos, zips, logs, database files (`Thumbs.db`, `.DS_Store`)

## Custom Configurations (`.codemeltignore`)

Create a `.codemeltignore` file at your repository root to override or append specific ignore patterns using glob matching syntax:

```text
# Exclude mock folder
**/mocks/**

# Exclude legacy utilities
src/legacy/*
```

## `.gitignore` Interoperability

To leverage your existing repository conventions, CodeMelt's CLI automatically detects `.gitignore` rules in your folder, parses them, merges them with your default or custom ignore sets, and applies the combined boundaries transparently.

This guarantees:
1. Zero duplicate matching rules.
2. Perfect alignment with your repository's local environment boundaries.
3. Clean, deterministic context results.
