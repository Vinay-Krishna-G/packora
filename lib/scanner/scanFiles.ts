import { ScannedFile } from "./fileTypes";
import { shouldIgnore } from "../filters/shouldIgnore";

export async function scanFiles(
    files: File[]
): Promise<ScannedFile[]> {
    const scannedFiles: ScannedFile[] = [];

    for (const file of files) {
        if (shouldIgnore(file.webkitRelativePath || file.name)) {
            continue;
        }
        const content = await file.text();

        scannedFiles.push({
            name: file.name,
            path: file.webkitRelativePath || file.name,
            extension: file.name.split(".").pop() || "",
            size: file.size,
            content,
        });
    }

    return scannedFiles;
}