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
        "refactoring": "PRIORITY DIRECTIVE: Audit codebase for SOLID design principles, locate design anti-patterns, highlight tight-coupling, and provide modular refactoring mockups.",
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
        xml += `  </repository_analysis>\n\n`;

        xml += `  <metadata>\n`;
        xml += `    <generator>Packora AI-Context Generator</generator>\n`;
        xml += `    <export_mode>${mode}</export_mode>\n`;
        xml += `    <export_intent>${intent}</export_intent>\n`;
        xml += `    <total_files>${includedCount}</total_files>\n`;
        xml += `  </metadata>\n\n`;

        // Add Directory Structure Tree
        xml += `  <directory_structure>\n`;
        for (const file of prioritizedFiles) {
            const desc = getSemanticFileDescription(file.path, file.name);
            xml += `    <item path="${file.path}" type="${file.type}" importance="${file.importance}" desc="${desc}" size="${file.size}" />\n`;
        }
        xml += `  </directory_structure>\n\n`;

        xml += `  <files>\n`;
        // Architecture mode excludes file contents dumps entirely!
        if (mode !== "architecture") {
            for (const file of prioritizedFiles) {
                xml += `    <file path="${file.path}" type="${file.type}" importance="${file.importance}">\n`;
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
            xml += `    <!-- File body loads omitted due to Architecture Export Mode selection -->\n`;
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
    markdown += `</repository_analysis>\n\n`;

    // Add Directory Structure Tree in Markdown with semantic descriptors
    markdown += `## Directory Structure\n\n\`\`\`text\n`;
    for (const file of prioritizedFiles) {
        const typeStr = file.type === "text" ? "" : ` [${file.type}]`;
        const importanceStr = file.importance === "normal" ? "" : ` [${file.importance}]`;
        const desc = getSemanticFileDescription(file.path, file.name);
        markdown += `${file.path}${typeStr}${importanceStr} (${(file.size / 1024).toFixed(1)} KB) - ${desc}\n`;
    }
    markdown += `\`\`\`\n\n`;

    // Render Files Section (Skipped in Architecture Mode)
    markdown += `## Repository Files\n\n`;
    if (mode !== "architecture") {
        for (const file of prioritizedFiles) {
            markdown += `### File: ${file.path}\n`;
            markdown += `<file path="${file.path}" type="${file.type}" importance="${file.importance}">\n\n`;

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
        markdown += `*File contents body loads omitted due to Architecture Export Mode selection. High-level semantic directory structure mapped above.*\n`;
    }

    return markdown;
}