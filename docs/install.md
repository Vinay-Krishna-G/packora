# Installation Guide

CodeMelt is designed to be used as a zero-setup local utility or an installed global tool.

## On-Demand Execution (Recommended)

Run CodeMelt directly using `npx` to ensure you are always using the latest stable release:

```bash
npx @codemelt/cli export
```

## Global Installation

For high-frequency workspace context generation, install CodeMelt globally via npm:

```bash
npm install -g @codemelt/cli
```

Once installed, use the command anywhere in your terminal:

```bash
codemelt export
```

## Local Workspace Setup

If you are contributing to CodeMelt or developing features, clone the repository and boot the local workspace:

```bash
# Install dependencies
npm install

# Compile workspace source files
npm run build

# Boot local next dev website
npm run dev
```
