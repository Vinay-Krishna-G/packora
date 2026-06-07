import { ScannedFile } from "codemelt-shared";
import { scoreFile } from "./scoreFile.js";

export function sortFiles(
    files: ScannedFile[]
): ScannedFile[] {
    return [...files].sort((a, b) => {
        const scoreDiff = scoreFile(b) - scoreFile(a);
        if (scoreDiff !== 0) return scoreDiff;
        return a.path.localeCompare(b.path);
    });
}
