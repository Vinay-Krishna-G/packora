import { ScannedFile, ExportMode, ExportIntent } from "codemelt-shared";
import { sortFiles } from "../prioritizer/sortFiles.js";
import { analyzeRepository } from "../analyzer/repositoryAnalyzer.js";
import { buildDependencyGraph } from "../graph/buildDependencyGraph.js";
import { getDependencyHotspots } from "../graph/analyzeGraph.js";

function getSemanticFileDescription(path: string, name: string): string {
    const lowerPath = path.toLowerCase();
    const lowerName = name.toLowerCase();

    if (lowerName === "package.json") return "Project dependency and build script definitions";
    if (lowerName === "tsconfig.json") return "TypeScript compiler settings";
    if (lowerName === "schema.prisma") return "Prisma database schema and models";
    if (lowerName === "tailwind.config.js" || lowerName === "tailwind.config.ts" || lowerName === "tailwind.config.cjs") return "Tailwind CSS configuration rules";
    if (lowerName === ".gitignore") return "Git ignore rules";
    if (lowerName.endsWith(".d.ts")) return "TypeScript ambient declaration file";
    if (lowerPath.includes("route") || lowerPath.includes("api/")) return "API route endpoint handler configuration";
    if (lowerPath.includes("controller")) return "Controller mapping incoming requests to backend logic";
    if (lowerPath.includes("model") || lowerPath.includes("db/")) return "Database data model definition";
    if (lowerPath.includes("store") || lowerPath.includes("state")) return "State management module";
    if (lowerPath.includes("component") || lowerPath.includes("ui/")) return "User interface view component";
    if (lowerPath.includes("util") || lowerPath.includes("helper")) return "Utility functions";
    if (lowerPath.endsWith(".css") || lowerPath.endsWith(".scss")) return "Style sheet definition";
    if (lowerPath.endsWith(".html")) return "HTML template file";

    return "Source code file";
}

export function* generateRepositoryContextChunks(
    files: ScannedFile[],
    format: "markdown" | "xml" = "markdown",
    mode: ExportMode = "standard",
    intent: ExportIntent = "general"
): Generator<string, void, unknown> {
    // 1. Prioritize/Filter files based on Export Mode
    let filteredFiles = files.filter((f) => f.included);

    if (mode === "tiny") {
        // Tiny mode excludes low/normal-importance files, binary, and oversized
        filteredFiles = filteredFiles.filter(
            (f) => (f.importance === "critical" || f.importance === "high") && f.type === "text"
        );
    }

    if (mode === "standard") {
        // Standard mode excludes low-importance files, binary, and oversized
        filteredFiles = filteredFiles.filter(
            (f) => f.importance !== "low" && f.type === "text"
        );
    }

    if (mode === "deep") {
        // Deep mode includes all text files, but excludes oversized/binary
        filteredFiles = filteredFiles.filter(
            (f) => f.type === "text"
        );
    }

    // Maximum mode (mode === "maximum") includes everything (except what's ignored).

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
        yield `<?xml version="1.0" encoding="UTF-8"?>\n`;
        yield `<repository>\n`;

        let xmlHeader = `  <repository_analysis>\n`;
        xmlHeader += `    <architecture>${analysis.architecture}</architecture>\n`;
        xmlHeader += `    <architecture_label>${archLabels[analysis.architecture]}</architecture_label>\n`;
        xmlHeader += `    <purpose>${analysis.purpose.name}</purpose>\n`;
        xmlHeader += `    <purpose_label>${purposeLabels[analysis.purpose.name]}</purpose_label>\n`;
        xmlHeader += `    <ai_readiness_score>${analysis.readinessScore.score}</ai_readiness_score>\n`;
        if (analysis.compression.savingsPercentage > 0) {
            xmlHeader += `    <compression_savings>${analysis.compression.savingsPercentage.toFixed(1)}%</compression_savings>\n`;
        }
        xmlHeader += `    <intent_directive>${intentDirectives[intent]}</intent_directive>\n`;

        // Compact list of technologies
        xmlHeader += `    <technologies>\n`;
        for (const tech of analysis.technologies) {
            xmlHeader += `      <technology name="${tech.name}" category="${tech.category}" confidence="${tech.confidence.toFixed(2)}" confidence_tier="${tech.confidenceTier || 'Low'}" />\n`;
        }
        xmlHeader += `    </technologies>\n`;

        // Condensed Recommended Workflows
        xmlHeader += `    <recommended_workflows>\n`;
        for (const prompt of analysis.prompts) {
            xmlHeader += `      <workflow type="${prompt.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}" />\n`;
        }
        xmlHeader += `    </recommended_workflows>\n`;

        // Semantic analysis injections
        if (analysis.semanticAnalysis) {
            const sem = analysis.semanticAnalysis;
            if (sem.entrypoints.length > 0) {
                xmlHeader += `    <entrypoints>\n`;
                for (const ep of sem.entrypoints) {
                    xmlHeader += `      <entrypoint path="${ep.path}" type="${ep.entrypointType || 'general'}" summary="${ep.summary}" />\n`;
                }
                xmlHeader += `    </entrypoints>\n`;
            }
            if (sem.routes.length > 0) {
                xmlHeader += `    <routes>\n`;
                for (const r of sem.routes) {
                    xmlHeader += `      <route path="${r.path}" method="${r.method}" handler="${r.handlerFile}" />\n`;
                }
                xmlHeader += `    </routes>\n`;
            }
            if (sem.flows.length > 0) {
                xmlHeader += `    <flows>\n`;
                for (const f of sem.flows) {
                    xmlHeader += `      <flow name="${f.name}">\n`;
                    for (const step of f.steps) {
                        xmlHeader += `        <step>${step}</step>\n`;
                    }
                    xmlHeader += `      </flow>\n`;
                }
                xmlHeader += `    </flows>\n`;
            }
        }

        xmlHeader += `  </repository_analysis>\n\n`;
        yield xmlHeader;

        let xmlMeta = `  <metadata>\n`;
        xmlMeta += `    <generator>CodeMelt AI-Context Generator</generator>\n`;
        xmlMeta += `    <export_mode>${mode}</export_mode>\n`;
        xmlMeta += `    <export_intent>${intent}</export_intent>\n`;
        xmlMeta += `    <total_files>${includedCount}</total_files>\n`;
        xmlMeta += `  </metadata>\n\n`;
        yield xmlMeta;

        // Add Directory Structure Tree
        let xmlDir = `  <directory_structure>\n`;
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
                        xmlDir += `    <directory path="${currentPath}" summary="${dirSummary}" />\n`;
                    }
                }
            }
            const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
            const desc = sem?.summary || getSemanticFileDescription(file.path, file.name);
            xmlDir += `    <item path="${file.path}" type="${file.type}" importance="${file.importance}" desc="${desc}" size="${file.size}" is_entrypoint="${sem?.isEntrypoint ? 'true' : 'false'}" />\n`;
        }
        xmlDir += `  </directory_structure>\n\n`;
        yield xmlDir;

        yield `  <files>\n`;
        for (const file of prioritizedFiles) {
            const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
            const summaryVal = sem?.summary || getSemanticFileDescription(file.path, file.name);
            let xmlFile = `    <file path="${file.path}" type="${file.type}" importance="${file.importance}" summary="${summaryVal}" is_entrypoint="${sem?.isEntrypoint ? 'true' : 'false'}">\n`;
            if (file.type === "text") {
                xmlFile += `      <![CDATA[\n${file.content}\n]]>\n`;
            } else if (file.type === "binary") {
                xmlFile += `      <!-- Binary file content omitted (${file.size} bytes) -->\n`;
            } else if (file.type === "oversized") {
                xmlFile += `      <!-- Oversized file content omitted (${file.size} bytes) -->\n`;
            }
            xmlFile += `    </file>\n`;
            yield xmlFile;
        }
        yield `  </files>\n`;
        yield `</repository>\n`;
        return;
    }

    // --- MARKDOWN EXPORT MODE FORMATTING ---
    // 1. Export Metadata Header
    yield `<!-- CODEMELT CONTEXT -->\n`;
    yield `<!-- Generated: ${new Date().toISOString().split("T")[0]} -->\n`;
    yield `<!-- Repository: ${files.length > 0 && files[0].path.includes("/") ? files[0].path.split("/")[0] : "local-repo"} -->\n`;
    yield `<!-- Raw Tokens: ${analysis.tokenEstimates?.rawRepository || 0} -->\n`;
    yield `<!-- Export Tokens: ${analysis.tokenEstimates?.exportedContext || 0} -->\n`;
    yield `<!-- Compression: ${analysis.compression.savingsPercentage.toFixed(1)}% -->\n`;
    yield `<!-- AI Readiness: ${analysis.readinessScore.score}/100 -->\n\n`;

    // 2. PROJECT SUMMARY
    yield `# PROJECT SUMMARY\n\n`;
    let mdHeader = `<repository_analysis>\n`;
    mdHeader += `- **Architecture Profile**: ${archLabels[analysis.architecture]}\n`;
    mdHeader += `- **Repository Purpose**: ${purposeLabels[analysis.purpose.name]} (Confidence: ${analysis.purpose.confidenceTier || 'Low'} - ${(analysis.purpose.confidence * 100).toFixed(0)}%)\n`;
    mdHeader += `- **AI Readiness Score**: ${analysis.readinessScore.score} / 100\n`;
    if (analysis.compression.savingsPercentage > 0) {
        mdHeader += `- **Context Compression Savings**: ${analysis.compression.savingsPercentage.toFixed(1)}% (Savings calculated on lockfiles, builds, and media filters)\n`;
    }
    mdHeader += `- **Export Configuration**: Mode [${mode}] / Intent [${intent}]\n`;
    mdHeader += `- **Workflows Directive**: ${intentDirectives[intent]}\n\n`;
    yield mdHeader;

    // 3. TECH STACK
    let mdTech = `# TECH STACK\n\n`;
    if (analysis.technologies.length === 0) {
        mdTech += `*No prominent framework or library signatures detected in dependencies or configurations.*\n\n`;
    } else {
        for (const tech of analysis.technologies) {
            const versionStr = tech.version ? ` (v${tech.version})` : "";
            mdTech += `- **${tech.name}**${versionStr} - [Category: ${tech.category}] - Confidence: ${tech.confidenceTier || 'Low'} (${(tech.confidence * 100).toFixed(0)}%)\n`;
        }
        mdTech += `\n`;
    }
    yield mdTech;

    // 4. ARCHITECTURE, 5. ENTRYPOINTS, 6. ROUTES, 8. DATA FLOW (from semantic analysis)
    let mdArch = `# ARCHITECTURE\n\n`;
    for (const prompt of analysis.prompts) {
        const wfKey = prompt.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
        mdArch += `<recommended_workflow type="${wfKey}" />\n`;
    }
    mdArch += `\n`;
    yield mdArch;

    if (analysis.semanticAnalysis) {
        const sem = analysis.semanticAnalysis;
        
        let mdEntry = `# ENTRYPOINTS\n\n`;
        if (sem.entrypoints.length > 0) {
            for (const ep of sem.entrypoints) {
                mdEntry += `- **${ep.path}** [${ep.entrypointType || 'entrypoint'}] - ${ep.summary}\n`;
            }
            mdEntry += `\n`;
        } else {
            mdEntry += `*No system entrypoints explicitly identified.*\n\n`;
        }
        yield mdEntry;

        let mdRoutes = `# ROUTES\n\n`;
        if (sem.routes.length > 0) {
            for (const r of sem.routes) {
                mdRoutes += `- **${r.method} ${r.path}** -> Handled by \`${r.handlerFile.split('/').pop()}\`\n`;
            }
            mdRoutes += `\n`;
        } else {
            mdRoutes += `*No explicit API routes detected.*\n\n`;
        }
        yield mdRoutes;
        
        let mdDataFlow = `# DATA FLOW\n\n`;
        if (sem.flows.length > 0) {
            for (const f of sem.flows) {
                mdDataFlow += `- **${f.name}**: ${f.steps.join(" ➔ ")}\n`;
            }
            mdDataFlow += `\n`;
        } else {
            mdDataFlow += `*No explicit data flows extracted.*\n\n`;
        }
        yield mdDataFlow;
    } else {
        yield `# ENTRYPOINTS\n\n*No entrypoints extracted.*\n\n`;
        yield `# ROUTES\n\n*No explicit API routes detected.*\n\n`;
        yield `# DATA FLOW\n\n*No explicit data flows extracted.*\n\n`;
    }

    yield `</repository_analysis>\n\n`;

    // 7. DEPENDENCY HOTSPOTS (Using real Dependency Graph)
    let mdHotspots = `# DEPENDENCY HOTSPOTS\n\n`;
    
    // Build the graph and get real hotspots
    const graph = buildDependencyGraph(prioritizedFiles);
    const hotspots = getDependencyHotspots(graph, 5);

    if (hotspots.length > 0) {
        hotspots.forEach((node, index) => {
            mdHotspots += `${index + 1}. **${node.name}**\n`;
            mdHotspots += `   Imported by: ${node.importedBy.length} files\n\n`;
        });
    } else {
        mdHotspots += `*No significant dependency hotspots identified.*\n\n`;
    }

    yield mdHotspots;

    // TOP FILES (Directory Structure)
    let mdDir = `# TOP FILES\n\n\`\`\`text\n`;
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
                    mdDir += `/${currentPath} - ${dirSummary}\n`;
                }
            }
        }
        const typeStr = file.type === "text" ? "" : ` [${file.type}]`;
        const importanceStr = file.importance === "normal" ? "" : ` [${file.importance}]`;

        const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
        const desc = sem?.summary || getSemanticFileDescription(file.path, file.name);
        mdDir += `  ├── ${file.path}${typeStr}${importanceStr} (${(file.size / 1024).toFixed(1)} KB) - ${desc}\n`;
    }
    mdDir += `\`\`\`\n\n`;
    yield mdDir;

    // 9. FILE SUMMARIES
    yield `# FILE SUMMARIES\n\n`;
    for (const file of prioritizedFiles) {
        const sem = analysis.semanticAnalysis?.fileSummaries[file.path];
        const summaryVal = sem?.summary || getSemanticFileDescription(file.path, file.name);
        let mdFile = `### File: ${file.path}\n`;
        mdFile += `<file path="${file.path}" type="${file.type}" importance="${file.importance}" summary="${summaryVal}" is_entrypoint="${sem?.isEntrypoint ? 'true' : 'false'}">\n\n`;

        if (file.type === "text") {
            mdFile += "```" + file.extension + "\n";
            mdFile += file.content + "\n";
            mdFile += "```\n";
        } else if (file.type === "binary") {
            mdFile += `*Binary file omitted (${(file.size / 1024).toFixed(1)} KB)*\n`;
        } else if (file.type === "oversized") {
            mdFile += `*Oversized file omitted (>1MB) (${(file.size / 1024).toFixed(1)} KB)*\n`;
        }

        mdFile += `\n</file>\n\n`;
        yield mdFile;
    }
}

/**
 * Standard in-memory context generation.
 * NOTE: For extremely large repositories where memory overhead must be kept to zero,
 * developers should consume the chunk-friendly generator function `generateRepositoryContextChunks`
 * directly (e.g., piping yielded strings into a writable file stream or network response).
 */
export function generateRepositoryContext(
    files: ScannedFile[],
    format: "markdown" | "xml" = "markdown",
    mode: ExportMode = "standard",
    intent: ExportIntent = "general"
): string {
    let result = "";
    // Append-friendly iteration avoiding Array.from memory spikes
    for (const chunk of generateRepositoryContextChunks(files, format, mode, intent)) {
        result += chunk;
    }
    return result;
}
