import { shouldIgnore } from "../filters/shouldIgnore";

import {
    ScannedFile,
    ScanResult,
} from "./fileTypes";

export async function scanFiles(
    files: File[]
): Promise<ScanResult> {
    const scannedFiles: ScannedFile[] = [];

    let ignoredCount = 0;

    for (const file of files) {
        const path =
            file.webkitRelativePath || file.name;
        console.log(file);
        console.log(file.webkitRelativePath);
        if (shouldIgnore(path)) {
            ignoredCount++;
            continue;
        }

        const content = await file.text();

        scannedFiles.push({
            name: file.name,
            path,
            extension:
                file.name.split(".").pop() || "",
            size: file.size,
            content,
        });
    }

    return {
        scannedFiles,
        ignoredCount,
        totalFiles: files.length,
    };
}