#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { performance } from "node:perf_hooks";
import { scanFiles, generateRepositoryContext, shouldIgnore } from "codemelt-core";
import { DEFAULT_IGNORES, ExportMode, ExportIntent, MAX_DIRECTORY_DEPTH } from "codemelt-shared";

const majorNodeVersion = parseInt(process.versions.node.split(".")[0], 10);
if (majorNodeVersion < 18) {
  console.error("Error: CodeMelt requires Node.js version 18 or higher.");
  console.error(`Current version: ${process.versions.node}`);
  process.exit(1);
}

const program = new Command();

program
  .name("codemelt")
  .description("Repository intelligence and structured context exports for modern codebases.")
  .version("0.1.0");

// --- Helper: Parse ignore rules file lines ---
function parseIgnoreFile(content: string): string[] {
  return content
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#") && !line.startsWith("!"));
}

// --- Helper: Traverse directory recursively with early-pruning & concurrency ---
async function getFilesRecursively(
  dir: string,
  baseDir: string,
  rules: string[],
  depth: number = 0
): Promise<{ name: string; path: string; size: number; text: () => Promise<string>, readChunk?: (bytes: number) => Promise<Buffer> }[]> {
  if (depth > MAX_DIRECTORY_DEPTH) return []; // Enforce maximum directory depth
  const list = await fs.readdir(dir);
  list.sort(); // Deterministic folder list sorting

  const BATCH_SIZE = 20;
  const results: { name: string; path: string; size: number; text: () => Promise<string>; readChunk?: (bytes: number) => Promise<Buffer> }[] = [];

  for (let offset = 0; offset < list.length; offset += BATCH_SIZE) {
    const batch = list.slice(offset, offset + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(async (file: string) => {
      const absolutePath = path.join(dir, file);
      const relativePath = path.relative(baseDir, absolutePath);

      // Early Pruning: skip immediately if ignored
      if (shouldIgnore(relativePath, rules)) {
        return [] as typeof results;
      }

      try {
        const stat = await fs.lstat(absolutePath);
        if (stat.isSymbolicLink()) {
          return [] as typeof results; // Protect against symlink loops
        }

        if (stat.isDirectory()) {
          return await getFilesRecursively(absolutePath, baseDir, rules, depth + 1);
        } else if (stat.isFile()) {
          return [{
            name: file,
            path: relativePath,
            size: stat.size,
            text: () => fs.readFile(absolutePath, "utf8"),
            readChunk: async (bytes: number) => {
              const fd = await fs.open(absolutePath, 'r');
              const buffer = Buffer.alloc(bytes);
              const { bytesRead } = await fs.read(fd, buffer, 0, bytes, 0);
              await fs.close(fd);
              return buffer.subarray(0, bytesRead);
            }
          }];
        }
      } catch {
        // Safe boundary fallback for traversal failures
      }
      return [] as typeof results;
    }));

    for (const batchResult of batchResults) {
      results.push(...batchResult);
    }
  }

  // Deterministic sorting of paths for reproducible outputs
  results.sort((a, b) => a.path.localeCompare(b.path));
  return results;
}

// --- COMMAND: init ---
program
  .command("init")
  .description("Initialize a custom .codemeltignore file with standard dev-tooling defaults.")
  .action(async () => {
    const ignorePath = path.join(process.cwd(), ".codemeltignore");

    if (await fs.pathExists(ignorePath)) {
      console.log(chalk.yellow("ℹ .codemeltignore already exists in this folder."));
      return;
    }

    const defaults = parseIgnoreFile(`
# Dependencies & package caches
node_modules
dist
build
.next
coverage
*.log

# Environment configs & lockfiles
.env
.env.*
package-lock.json
pnpm-lock.yaml
yarn.lock
.DS_Store
Thumbs.db
*.tsbuildinfo

# Media and asset structures
*.png
*.jpg
*.jpeg
*.gif
*.webp
*.ico
*.mp4
*.mp3
*.zip
*.tar
*.gz
*.tar.gz
*.tgz

# Generated Context
codemelt-context.md
codemelt-context.xml
    `);

    await fs.writeFile(ignorePath, defaults.join("\n") + "\n", "utf8");
    console.log(chalk.green("✔ Generated .codemeltignore with sensible defaults."));
  });

// --- COMMAND: export ---
program
  .command("export [directory]")
  .description("Export repository files and architecture intelligence into a structured context.")
  .option("-f, --format <format>", "Export output format (markdown, xml)", "markdown")
  .option("-m, --mode <mode>", "Extraction mode details (tiny, standard, deep, maximum)", "standard")
  .option("-i, --intent <intent>", "Context goals intention (general, debugging, onboarding, architecture, security)", "general")
  .option("-o, --output <output>", "Custom context export destination filename")
  .action(async (directory: string | undefined, options: any) => {
    const targetDir = directory ? path.resolve(directory) : process.cwd();

    if (!(await fs.pathExists(targetDir))) {
      console.error(chalk.red(`Error: Target directory '${targetDir}' does not exist.`));
      process.exit(1);
    }

    const startedAt = performance.now();
    const spinner = ora("Scanning repository files...").start();

    // Clean interrupts SIGINT handler
    const sigintHandler = () => {
      spinner.stop();
      console.log(chalk.yellow("\n[CodeMelt] Export cancelled by user."));
      process.exit(130);
    };
    process.on("SIGINT", sigintHandler);

    try {
      // 1. Resolve ignore rules database (.codemeltignore preferred, fallback to .reporazorignore, then .packoraignore, then optional .gitignore)
      let ignoreRules = [...DEFAULT_IGNORES];

      const codemeltignorePath = path.join(targetDir, ".codemeltignore");
      const reporazorignorePath = path.join(targetDir, ".reporazorignore");
      const packoraignorePath = path.join(targetDir, ".packoraignore");

      if (await fs.pathExists(codemeltignorePath)) {
        const content = await fs.readFile(codemeltignorePath, "utf8");
        ignoreRules = parseIgnoreFile(content);
      } else if (await fs.pathExists(reporazorignorePath)) {
        const content = await fs.readFile(reporazorignorePath, "utf8");
        ignoreRules = parseIgnoreFile(content);
        console.log(chalk.yellow("ℹ Using existing .reporazorignore as fallback for .codemeltignore."));
      } else if (await fs.pathExists(packoraignorePath)) {
        const content = await fs.readFile(packoraignorePath, "utf8");
        ignoreRules = parseIgnoreFile(content);
        console.log(chalk.yellow("ℹ Using existing .packoraignore as fallback for .codemeltignore."));
      }

      // Merge .gitignore constraints dynamically
      const gitignorePath = path.join(targetDir, ".gitignore");
      if (await fs.pathExists(gitignorePath)) {
        const content = await fs.readFile(gitignorePath, "utf8");
        const gitRules = parseIgnoreFile(content);
        for (const rule of gitRules) {
          if (!ignoreRules.includes(rule)) {
            ignoreRules.push(rule);
          }
        }
      }

      // 2. Scan and traverse files recursively with early path exclusions
      const rawFiles = await getFilesRecursively(targetDir, targetDir, ignoreRules);

      const totalBytes = rawFiles.reduce((acc, f) => acc + f.size, 0);
      if (rawFiles.length > 500 || totalBytes > 10 * 1024 * 1024) {
        spinner.stop();
        console.log(chalk.yellow("\n⚠ Large repository detected. Export may take longer and use significant system resources."));
        console.log(chalk.yellow("Consider using --mode tiny or --mode standard for reduced memory usage."));
        console.log(chalk.yellow("Press Ctrl+C anytime to cancel.\n"));
        spinner.start("Analyzing codebase structure...");
      } else {
        spinner.text = "Analyzing codebase structure...";
      }

      // 3. Scan files using core engine
      const scanResult = await scanFiles(rawFiles, ignoreRules);

      spinner.text = "Compiling semantic context maps...";

      // 4. Generate structured context synthesizers
      const formatVal = options.format === "xml" ? "xml" : "markdown";
      const modeVal = options.mode as ExportMode;
      const intentVal = options.intent as ExportIntent;

      const outputContent = generateRepositoryContext(scanResult.scannedFiles, formatVal, modeVal, intentVal);

      // 5. Save context file safely
      const ext = formatVal === "xml" ? "xml" : "md";
      const defaultFilename = `codemelt-context.${ext}`;
      const finalFilename = options.output ? options.output : defaultFilename;
      const outputPath = path.resolve(targetDir, finalFilename);

      await fs.writeFile(outputPath, outputContent, "utf8");

      spinner.stop();
      process.off("SIGINT", sigintHandler);

      // Professional, calm progress ticks (no meme/ASCII spam)
      console.log(chalk.green("✔ Repository scanned"));
      console.log(chalk.green("✔ Ignore rules applied"));
      console.log(chalk.green("✔ Export generated"));
      const duration = ((performance.now() - startedAt) / 1000).toFixed(2);
      console.log(`Files processed: ${scanResult.scannedFiles.length}`);
      console.log(`Completed in ${duration}s`);
      console.log(chalk.gray(`Output: ${path.relative(process.cwd(), outputPath)}`));

    } catch (error: any) {
      spinner.stop();
      process.off("SIGINT", sigintHandler);
      console.error(chalk.red(`✖ Failed to export repository context: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
