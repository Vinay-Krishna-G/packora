import { ScannedFile } from "../scanner/fileTypes";

export function generateMarkdown(
    files: ScannedFile[]
): string {
    let markdown = "# Packora Project Context\n\n";

    for (const file of files) {
        markdown += `## ${file.path}\n\n`;

        markdown += "```" + file.extension + "\n";

        markdown += file.content + "\n";

        markdown += "```\n\n";
    }

    return markdown;
}