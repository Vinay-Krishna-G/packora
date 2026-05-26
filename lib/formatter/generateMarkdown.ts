import { ScannedFile } from "../scanner/fileTypes";
import { sortFiles } from "../prioritizer/sortFiles";

export function generateMarkdown(
    files: ScannedFile[],
    format: "markdown" | "xml" = "markdown"
): string {
    const includedFiles = files.filter((file) => file.included);
    const prioritizedFiles = sortFiles(includedFiles);

    if (format === "xml") {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<repository>\n`;
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