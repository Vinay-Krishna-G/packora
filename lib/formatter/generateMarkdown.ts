import { ScannedFile } from "../scanner/fileTypes";
import { sortFiles } from "../prioritizer/sortFiles";
export function generateMarkdown(
    files: ScannedFile[]
): string {
    let markdown = "# Packora Project Context\n\n";
    const prioritizedFiles = sortFiles(files);

    for (const file of prioritizedFiles) {
        markdown += `## ${file.path}\n\n`;

        markdown += "```" + file.extension + "\n";

        markdown += file.content + "\n";

        markdown += "```\n\n";
    }

    return markdown;
}