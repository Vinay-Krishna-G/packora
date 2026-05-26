import { ScannedFile } from "../scanner/fileTypes";

import { scoreFile } from "./scoreFile";

export function sortFiles(
    files: ScannedFile[]
): ScannedFile[] {
    return [...files].sort((a, b) => {
        return scoreFile(b) - scoreFile(a);
    });
}