# Command Line Interface (CLI)

CodeMelt CLI provides clean, infrastructure-oriented utilities to initialize workspace configurations and generate semantic repository context blueprints.

## Core Commands

### 1. `codemelt init`

Initialize a custom `.codemeltignore` configuration file in your current working directory pre-populated with standard dev defaults:

```bash
codemelt init
```

### 2. `codemelt export [directory]`

Analyze the codebase files in `[directory]` (defaults to process current folder) and export them into a structured Markdown or XML file:

```bash
codemelt export
```

## Options Matrix

Customize context compilation using flags:

| Option | Shorthand | Description | Default |
| :--- | :--- | :--- | :--- |
| `--format` | `-f` | Synthesis layout format (`markdown`, `xml`) | `markdown` |
| `--mode` | `-m` | Compiling density mode (`tiny`, `standard`, `deep`, `maximum`) | `standard` |
| `--intent` | `-i` | Context specialization goals (`general`, `debugging`, `onboarding`, `architecture`, `security`) | `general` |
| `--output` | `-o` | Custom target output filename | `codemelt-context.<ext>` |

## Design UX Principles

Our CLI output remains professional and quiet, utilizing clear Success checkmarks and avoiding emoji overload or ASCII text banner spams:

```text
✔ Repository scanned
✔ Ignore rules applied
✔ Export generated
Output: codemelt-context.md
```
