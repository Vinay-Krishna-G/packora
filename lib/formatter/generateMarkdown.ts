import { ScannedFile } from "../scanner/fileTypes";
import { sortFiles } from "../prioritizer/sortFiles";
import { analyzeRepository } from "../analyzer/repositoryAnalyzer";
import { ExportMode, ExportIntent } from "./types";

function getSemanticFileDescription(path: string, name: string): string {
    const lowerPath = path.toLowerCase();
    const lowerName = name.toLowerCase();

    if (lowerName === "package.json") return "Workspace dependencies registry and build configs";
    if (lowerName === "tsconfig.json") return "TypeScript compiler and type-resolution setups";
    if (lowerName === "schema.prisma") return "ORM database entities and schemas structure";
    if (lowerName === "tailwind.config.js" || lowerName === "tailwind.config.ts" || lowerName === "tailwind.config.cjs") return "Tailwind inline utility styling configs";
    if (lowerName === ".gitignore") return "Workspace exclusions and git ignoring boundaries";
    if (lowerName.endsWith(".d.ts")) return "TypeScript ambient global typings definition";
    if (lowerPath.includes("route") || lowerPath.includes("api/")) return "API/Web routing endpoint handler";
    if (lowerPath.includes("controller")) return "Functional business controller logic module";
    if (lowerPath.includes("model") || lowerPath.includes("db/")) return "Database database entity definitions";
    if (lowerPath.includes("store") || lowerPath.includes("state")) return "Global application state management store";
    if (lowerPath.includes("component") || lowerPath.includes("ui/")) return "Reusable presentational UI component render block";
    if (lowerPath.includes("util") || lowerPath.includes("helper")) return "Stateless helper utilities helper";
    if (lowerPath.endsWith(".css") || lowerPath.endsWith(".scss")) return "Custom styling cascade sheet";
    if (lowerPath.endsWith(".html")) return "Static HTML markup layout structure";

    return "Source code logical implementation file";
}

export function generateMarkdown(
    files: ScannedFile[],
    format: "markdown" | "xml" = "markdown",
    mode: ExportMode = "full",
    intent: ExportIntent = "general"
): string {
    // 1. Prioritize/Filter files based on Export Mode
    let filteredFiles = files.filter((f) => f.included);

    if (mode === "compact") {
        // Compact mode excludes low-importance files, binary, and oversized
        filteredFiles = filteredFiles.filter(
            (f) => f.importance !== "low" && f.type === "text"
        );
    }

    if (mode === "debug") {
        // Debug mode filters to configs, environments, typings, tests, and critical entrypoints
        filteredFiles = filteredFiles.filter(
            (f) =>
                f.importance === "critical" ||
                f.importance === "low" ||
                f.name.endsWith(".d.ts") ||
                f.name.includes("config") ||
                f.name.startsWith(".env") ||
                f.name.includes("setup") ||
                f.path.includes("test") ||
                f.path.includes("spec") ||
                f.path.includes("__tests__")
        );
    }

    const prioritizedFiles = sortFiles(filteredFiles);
    const includedCount = filteredFiles.length;

    // 2. Perform intelligence repository analysis
    const analysis = analyzeRepository(files);

    const archLabels: Record<string, string> = {
        "monorepo": "Monorepo Workspace",
        "fullstack-monolith": "Fullstack Monolith",
        "frontend-only": "Frontend Application",
        "backend-api": "Backend API Service",
        "realtime-system": "Realtime Application",
        "unknown": "Software Repository"
    };

    const purposeLabels: Record<string, string> = {
        "developer-tooling": "Developer Tooling Project",
        "saas-dashboard": "SaaS Dashboard Portal",
        "chat-application": "Chat Application",
        "ecommerce-platform": "Ecommerce Platform",
        "cms": "Content Management System",
        "portfolio": "Portfolio Website",
        "api-platform": "API Platform Service",
        "unknown": "Application"
    };

    // Intent Directive text blocks
    const intentDirectives: Record<ExportIntent, string> = {
        "general": "Provide a comprehensive code synthesis and general structural walkthrough.",
        "debugging": "PRIORITY DIRECTIVE: Focus intensely on tracing runtime exceptions, boundary conditions, typing declarations, linter configurations, and environmental setups.",
        "onboarding": "PRIORITY DIRECTIVE: Primed for fast software onboarding. Structure responses around high-level architecture maps, topological flows, and setup triggers.",
        "architecture": "PRIORITY DIRECTIVE: Evaluate architectural structural boundaries, tight-coupling issues, database schemas alignment, and design patterns consistency.",
        "security": "PRIORITY DIRECTIVE: Evaluate third-party dependencies package licenses, environment configurations safety, input validation layers, and security-risk variables."
    };

    // --- XML EXPORT MODE FORMATTING ---
    if (format === "xml") {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<repository>\n`;
        
        xml += `  <repository_analysis>\n`;
        xml += `    <architecture>${analysis.architecture}</architecture>\n`;
        xml += `    <architecture_label>${archLabels[analysis.architecture]}</architecture_label>\n`;
        xml += `    <purpose>${analysis.purpose.name}</purpose>\n`;
        xml += `    <purpose_label>${purposeLabels[analysis.purpose.name]}</purpose_label>\n`;
        xml += `    <ai_readiness_score>${analysis.readinessScore.score}</ai_readiness_score>\n`;
        xml += `    <compression_savings>${analysis.compression.savingsPercentage.toFixed(1)}%</compression_savings>\n`;
        xml += `    <intent_directive>${intentDirectives[intent]}</intent_directive>\n`;
        
        // Compact list of technologies
        xml += `    <technologies>\n`;
        for (const tech of analysis.technologies) {
            xml += `      <technology name="${tech.name}" category="${tech.category}" confidence="${tech.confidence.toFixed(2)}" />\n`;
        }
        xml += `    </technologies>\n`;

        // Condensed Recommended Workflows (no giant verbose blocks!)
        xml += `    <recommended_workflows>\n`;
        for (const prompt of analysis.prompts) {
            xml += `      <workflow type="${prompt.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}" />\n`;
        }
        xml += `    </recommended_workflows>\n`;

        // Semantic analysis injections
        if (analysis.semanticAnalysis) {
            const sem = analysis.semanticAnalysis;
            if (sem.entrypoints.length > 0) {
                xml += `    <entrypoints>\n`;
                for (const ep of sem.entrypoints) {
                    xml += `      <entrypoint path="${ep.path}" type="${ep.entrypointType || 'general'}" summary="${ep.summary}" />\n`;
                }
                xml += `    </entrypoints>\n`;
            }
            if (sem.routes.length > 0) {
                xml += `    <routes>\n`;
                for (const r of sem.routes) {
                    xml += `      <route path="${r.path}" method="${r.method}" handler="${r.handlerFile}" />\n`;
                }
                xml += `    </routes>\n`;
            }
            if (sem.flows.length > 0) {
                xml += `    <flows>\n`;
                for (const f of sem.flows) {
                    xml += `      <flow name="${f.name}">\n`;
                    for (const step of f.steps) {
                        xml += `        <step>${step}</step>\n`;
                    }
                    xml += `      </flow>\n`;
                }
                xml += `    </flows>\n`;
            }
        }

        xml += `  </repository_analysis>\n\n`;

        xml += `  <metadata>\n`;
        xml += `    <generator>Packora AI-Context Generator</generator>\n`;
        xml += `    <export_mode>${mode}</export_mode>\n`;
        xml += `    <export_intent>${intent}</export_intent>\n`;
        xml += `    <total_files>${includedCount}</total_files>\n`;
        xml += `  </metadata>\n\n`;

        // Add Directory Structure Tree
        xml += `  <directory_structure>\n`;
        const dirRegistered = new Set<string>();
        for (const file of prioritizedFiles) {
            if (analysis.semanticAnalysis) {
                const parts = file.path.split("/");
                parts.pop();
                let currentPath = "";
                for (const part of parts) {
                    currentPath = currentPath ? `${currentPath}/${part}` : part;
                    if (!dirRegistered.has(currentPath)) {
                        dirRegistered.add(currentPath);
                        const dirSem = analysis.semanticAnalysis.directorySummaries[currentPath];
                        const dirSummary = dirSem ? dirSem.summary : "Directory subfolder";
                        xml += `    <directory path="${currentPath}" summary="${dirSummary}" />\n`;
                    }
                }
            }
            const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
            const desc = sem?.summary || getSemanticFileDescription(file.path, file.name);
            xml += `    <item path="${file.path}" type="${file.type}" importance="${file.importance}" desc="${desc}" size="${file.size}" is_entrypoint="${sem?.isEntrypoint ? 'true' : 'false'}" />\n`;
        }
        xml += `  </directory_structure>\n\n`;

        xml += `  <files>\n`;
        if (mode !== "architecture") {
            for (const file of prioritizedFiles) {
                const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
                const summaryVal = sem?.summary || getSemanticFileDescription(file.path, file.name);
                xml += `    <file path="${file.path}" type="${file.type}" importance="${file.importance}" summary="${summaryVal}" is_entrypoint="${sem?.isEntrypoint ? 'true' : 'false'}">\n`;
                if (file.type === "text") {
                    xml += `      <![CDATA[\n${file.content}\n]]>\n`;
                } else if (file.type === "binary") {
                    xml += `      <!-- Binary file content omitted (${file.size} bytes) -->\n`;
                } else if (file.type === "oversized") {
                    xml += `      <!-- Oversized file content omitted (${file.size} bytes) -->\n`;
                }
                xml += `    </file>\n`;
            }
        } else {
            for (const file of prioritizedFiles) {
                const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
                const summaryVal = sem?.summary || getSemanticFileDescription(file.path, file.name);
                xml += `    <file path="${file.path}" type="${file.type}" importance="${file.importance}" summary="${summaryVal}" is_entrypoint="${sem?.isEntrypoint ? 'true' : 'false'}">\n`;
                xml += `      <!-- File content body omitted in Architecture Mode. Purpose: ${summaryVal} -->\n`;
                xml += `    </file>\n`;
            }
        }
        xml += `  </files>\n`;
        xml += `</repository>\n`;
        return xml;
    }

    // --- MARKDOWN EXPORT MODE FORMATTING ---
    let markdown = `# Packora Project Context\n\n`;

    // Semantic XML Boundary Block for LLM Parsing in Markdown Mode
    markdown += `<repository_analysis>\n`;
    markdown += `## Repository Architecture Profile\n`;
    markdown += `- **Architecture Profile**: ${archLabels[analysis.architecture]}\n`;
    markdown += `- **Repository Purpose**: ${purposeLabels[analysis.purpose.name]} (Confidence: ${(analysis.purpose.confidence * 100).toFixed(0)}%)\n`;
    markdown += `- **AI Readiness Score**: ${analysis.readinessScore.score} / 100\n`;
    markdown += `- **Context Compression Savings**: ${analysis.compression.savingsPercentage.toFixed(1)}% (Savings calculated on lockfiles, builds, and media filters)\n`;
    markdown += `- **Export Configuration**: Mode [${mode}] / Intent [${intent}]\n`;
    markdown += `- **Workflows Directive**: ${intentDirectives[intent]}\n\n`;

    markdown += `## Detected Technology Stack\n`;
    if (analysis.technologies.length === 0) {
        markdown += `*No prominent framework or library signatures detected in dependencies or configurations.*\n`;
    } else {
        for (const tech of analysis.technologies) {
            const versionStr = tech.version ? ` (v${tech.version})` : "";
            markdown += `- **${tech.name}**${versionStr} - [Category: ${tech.category}] - Confidence: ${(tech.confidence * 100).toFixed(0)}%\n`;
        }
    }
    
    // Compact list of suggested workflows (avoids giant verbose blocks!)
    markdown += `\n## Recommended Workflow Invocations\n`;
    for (const prompt of analysis.prompts) {
        const wfKey = prompt.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
        markdown += `<recommended_workflow type="${wfKey}" />\n`;
    }

    // Semantic analysis navigation mapping
    if (analysis.semanticAnalysis) {
        const sem = analysis.semanticAnalysis;
        markdown += `\n## Navigation & Architecture Map\n`;
        if (sem.entrypoints.length > 0) {
            markdown += `### System Entrypoints\n`;
            for (const ep of sem.entrypoints) {
                markdown += `- **${ep.path}** [${ep.entrypointType || 'entrypoint'}] - ${ep.summary}\n`;
            }
            markdown += `\n`;
        }
        if (sem.routes.length > 0) {
            markdown += `### API Routing\n`;
            for (const r of sem.routes) {
                markdown += `- **${r.method} ${r.path}** -> Handled by \`${r.handlerFile.split('/').pop()}\`\n`;
            }
            markdown += `\n`;
        }
        if (sem.flows.length > 0) {
            markdown += `### Semantic Data Flows\n`;
            for (const f of sem.flows) {
                markdown += `- **${f.name}**: ${f.steps.join(" ➔ ")}\n`;
            }
            markdown += `\n`;
        }
    }

    markdown += `</repository_analysis>\n\n`;

    // Add Directory Structure Tree in Markdown with semantic descriptors
    markdown += `## Directory Structure\n\n\`\`\`text\n`;
    const dirRegisteredMd = new Set<string>();
    for (const file of prioritizedFiles) {
        if (analysis.semanticAnalysis) {
            const parts = file.path.split("/");
            parts.pop();
            let currentPath = "";
            for (const part of parts) {
                currentPath = currentPath ? `${currentPath}/${part}` : part;
                if (!dirRegisteredMd.has(currentPath)) {
                    dirRegisteredMd.add(currentPath);
                    const dirSem = analysis.semanticAnalysis.directorySummaries[currentPath];
                    const dirSummary = dirSem ? dirSem.summary : "Directory subfolder";
                    markdown += `/${currentPath} - ${dirSummary}\n`;
                }
            }
        }
        const typeStr = file.type === "text" ? "" : ` [${file.type}]`;
        const importanceStr = file.importance === "normal" ? "" : ` [${file.importance}]`;
        
        const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
        const desc = sem?.summary || getSemanticFileDescription(file.path, file.name);
        markdown += `  ├── ${file.path}${typeStr}${importanceStr} (${(file.size / 1024).toFixed(1)} KB) - ${desc}\n`;
    }
    markdown += `\`\`\`\n\n`;

    // Render Files Section (Skipped in Architecture Mode)
    markdown += `## Repository Files\n\n`;
    if (mode !== "architecture") {
        for (const file of prioritizedFiles) {
            const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
            const summaryVal = sem?.summary || getSemanticFileDescription(file.path, file.name);
            markdown += `### File: ${file.path}\n`;
            markdown += `<file path="${file.path}" type="${file.type}" importance="${file.importance}" summary="${summaryVal}" is_entrypoint="${sem?.isEntrypoint ? 'true' : 'false'}">\n\n`;

            if (file.type === "text") {
                markdown += "```" + file.extension + "\n";
                markdown += file.content + "\n";
                markdown += "```\n";
            } else if (file.type === "binary") {
                markdown += `*Binary file omitted (${(file.size / 1024).toFixed(1)} KB)*\n`;
            } else if (file.type === "oversized") {
                markdown += `*Oversized file omitted (>1MB) (${(file.size / 1024).toFixed(1)} KB)*\n`;
            }

            markdown += `\n</file>\n\n`;
        }
    } else {
        for (const file of prioritizedFiles) {
            const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
            const summaryVal = sem?.summary || getSemanticFileDescription(file.path, file.name);
            markdown += `### File: ${file.path}\n`;
            markdown += `<file path="${file.path}" type="${file.type}" importance="${file.importance}" summary="${summaryVal}" is_entrypoint="${sem?.isEntrypoint ? 'true' : 'false'}">\n\n`;
            markdown += `*File content body omitted in Architecture Mode. Purpose: ${summaryVal}*\n\n`;
            markdown += `</file>\n\n`;
        }
    }

    return markdown;
}