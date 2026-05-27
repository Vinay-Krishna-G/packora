import { ScannedFile } from "../scanner/fileTypes";
import { sortFiles } from "../prioritizer/sortFiles";
import { analyzeRepository } from "../analyzer/repositoryAnalyzer";

export function generateMarkdown(
    files: ScannedFile[],
    format: "markdown" | "xml" = "markdown"
): string {
    const includedFiles = files.filter((file) => file.included);
    const prioritizedFiles = sortFiles(includedFiles);
    
    // Core repository heuristics analysis
    const analysis = analyzeRepository(files);

    const archLabels: Record<string, string> = {
        "monorepo": "Monorepo Workspace",
        "fullstack-monolith": "Fullstack Monolith",
        "frontend-only": "Frontend Application",
        "backend-api": "Backend API Service",
        "realtime-system": "Realtime Application",
        "unknown": "Software Repository"
    };

    if (format === "xml") {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<repository>\n`;
        
        // Dynamic repository intelligence header
        xml += `  <repository_analysis>\n`;
        xml += `    <architecture>${analysis.architecture}</architecture>\n`;
        xml += `    <architecture_label>${archLabels[analysis.architecture]}</architecture_label>\n`;
        xml += `    <summary>${analysis.summary}</summary>\n`;
        xml += `    <total_scanned_files>${analysis.fileCount}</total_scanned_files>\n`;
        xml += `    <total_included_files>${includedFiles.length}</total_included_files>\n`;
        xml += `    <total_size_bytes>${analysis.totalSize}</total_size_bytes>\n`;
        xml += `    <technologies>\n`;
        for (const tech of analysis.technologies) {
            xml += `      <technology name="${tech.name}" category="${tech.category}" confidence="${tech.confidence.toFixed(2)}">\n`;
            if (tech.version) {
                xml += `        <version>${tech.version}</version>\n`;
            }
            xml += `        <explainability>\n`;
            for (const dep of tech.explainability.matchedDependencies) {
                xml += `          <matched_dependency>${dep}</matched_dependency>\n`;
            }
            for (const fileMatch of tech.explainability.matchedFiles) {
                xml += `          <matched_file>${fileMatch}</matched_file>\n`;
            }
            xml += `        </explainability>\n`;
            xml += `      </technology>\n`;
        }
        xml += `    </technologies>\n`;
        xml += `  </repository_analysis>\n\n`;

        xml += `  <metadata>\n`;
        xml += `    <generator>Packora AI-Context Generator</generator>\n`;
        xml += `    <total_files>${includedFiles.length}</total_files>\n`;
        xml += `  </metadata>\n\n`;

        // Add Directory Structure Tree
        xml += `  <directory_structure>\n`;
        for (const file of prioritizedFiles) {
            xml += `    <item path="${file.path}" type="${file.type}" size="${file.size}" />\n`;
        }
        xml += `  </directory_structure>\n\n`;

        xml += `  <files>\n`;
        for (const file of prioritizedFiles) {
            xml += `    <file path="${file.path}" type="${file.type}">\n`;
            if (file.type === "text") {
                xml += `      <![CDATA[\n${file.content}\n]]>\n`;
            } else if (file.type === "binary") {
                xml += `      <!-- Binary file content omitted (${file.size} bytes) -->\n`;
            } else if (file.type === "oversized") {
                xml += `      <!-- Oversized file content omitted (${file.size} bytes) -->\n`;
            }
            xml += `    </file>\n`;
        }
        xml += `  </files>\n`;
        xml += `</repository>\n`;
        return xml;
    }

    // Default: Premium Markdown
    let markdown = `# Packora Project Context\n\n`;

    // Semantic XML Boundary Block for LLM Parsing in Markdown Mode
    markdown += `<repository_analysis>\n`;
    markdown += `## Repository Architecture Profile\n`;
    markdown += `- **Architecture Profile**: ${archLabels[analysis.architecture]}\n`;
    markdown += `- **Summary**: ${analysis.summary}\n`;
    markdown += `- **Total Files**: ${analysis.fileCount} scanned / ${includedFiles.length} exported\n`;
    markdown += `- **Total Size**: ${(analysis.totalSize / 1024 / 1024).toFixed(2)} MB\n\n`;

    markdown += `## Detected Technology Stack\n`;
    if (analysis.technologies.length === 0) {
        markdown += `*No prominent framework or library signatures detected in dependencies or configurations.*\n`;
    } else {
        for (const tech of analysis.technologies) {
            const versionStr = tech.version ? ` (v${tech.version})` : "";
            markdown += `- **${tech.name}**${versionStr} - [Category: ${tech.category}] - Confidence: ${(tech.confidence * 100).toFixed(0)}%\n`;
            
            const reasons: string[] = [];
            if (tech.explainability.matchedDependencies.length > 0) {
                reasons.push(`Dependencies: [${tech.explainability.matchedDependencies.join(", ")}]`);
            }
            if (tech.explainability.matchedFiles.length > 0) {
                reasons.push(`Configuration: [${tech.explainability.matchedFiles.map(f => f.split("/").pop()).join(", ")}]`);
            }
            
            if (reasons.length > 0) {
                markdown += `  * *Matched by*: ${reasons.join(" and ")}\n`;
            }
        }
    }
    markdown += `</repository_analysis>\n\n`;

    // Add Directory Structure Tree in Markdown
    markdown += `## Directory Structure\n\n\`\`\`text\n`;
    for (const file of prioritizedFiles) {
        const typeStr = file.type === "text" ? "" : ` [${file.type}]`;
        markdown += `${file.path}${typeStr} (${(file.size / 1024).toFixed(1)} KB)\n`;
    }
    markdown += `\`\`\`\n\n`;

    markdown += `## Repository Files\n\n`;
    for (const file of prioritizedFiles) {
        markdown += `### File: ${file.path}\n`;
        markdown += `<file path="${file.path}" type="${file.type}">\n\n`;

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

    return markdown;
}