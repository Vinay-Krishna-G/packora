import { shouldIgnore } from "../filters/shouldIgnore";

import {
    ScannedFile,
    ScanResult,
} from "./fileTypes";

const BINARY_EXTENSIONS = new Set([
    "png", "jpg", "jpeg", "gif", "webp", "ico",
    "pdf", "zip", "tar", "gz", "rar", "7z",
    "mp4", "mp3", "wav", "avi", "mov", "flac",
    "exe", "dll", "so", "dylib",
    "woff", "woff2", "ttf", "eot",
    "db", "sqlite", "sqlite3",
    "bin", "dat", "pyc", "class", "o", "obj",
]);

function isBinary(filename: string): boolean {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    return BINARY_EXTENSIONS.has(ext);
}

export async function scanFiles(
    files: File[]
): Promise<ScanResult> {
    const scannedFiles: ScannedFile[] = [];
    let ignoredCount = 0;
    const BATCH_SIZE = 50;

    // Filter out ignored files first to count them
    const eligibleFiles = files.filter((file) => {
        const path = file.webkitRelativePath || file.name;
        const ignored = shouldIgnore(path);
        if (ignored) {
            ignoredCount++;
        }
        return !ignored;
    });

    for (let i = 0; i < eligibleFiles.length; i += BATCH_SIZE) {
        const batch = eligibleFiles.slice(i, i + BATCH_SIZE);
        const processedBatch = await Promise.all(
            batch.map(async (file) => {
                const path = file.webkitRelativePath || file.name;
                const extension = file.name.split(".").pop()?.toLowerCase() || "";
                const size = file.size;

                let type: "text" | "binary" | "oversized" = "text";
                let content = "";

                if (isBinary(file.name)) {
                    type = "binary";
                    content = "[Binary file content omitted]";
                } else if (size > 1024 * 1024) { // 1MB
                    type = "oversized";
                    content = "[Oversized file content omitted (>1MB)]";
                } else {
                    try {
                        content = await file.text();
                    } catch (error) {
                        type = "binary";
                        content = "[Unable to read as text]";
                    }
                }

                return {
                    name: file.name,
                    path,
                    extension,
                    size,
                    content,
                    included: true,
                    type,
                };
            })
        );
        scannedFiles.push(...processedBatch);
    }

    return {
        scannedFiles,
        ignoredCount,
        totalFiles: files.length,
    };
}