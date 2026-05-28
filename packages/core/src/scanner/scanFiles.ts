import { RawFile, ScannedFile, ScanResult, normalizePath, MAX_EXPORT_FILES, MAX_FILE_SIZE, MAX_CONTENT_CHARS, MAX_EXPORT_BYTES } from "@codemelt/shared";
import { shouldIgnore } from "../filters/shouldIgnore.js";
import { detectImportance } from "./importanceDetector.js";

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
    files: RawFile[],
    customRules?: string[]
): Promise<ScanResult> {
    const scannedFiles: ScannedFile[] = [];
    let ignoredCount = 0;
    let ignoredBytes = 0;
    let totalBytesAccumulator = 0;

    // Normalizing paths across the raw files array
    const normalizedFiles = files.map(file => ({
        ...file,
        path: normalizePath(file.path)
    }));

    // Capping maximum number of files to index to protect memory
    let eligibleFilesList = normalizedFiles;
    if (eligibleFilesList.length > MAX_EXPORT_FILES) {
      console.warn(`[CodeMelt] Safety boundary cap hit: repository contains ${eligibleFilesList.length} files. Restricting active index depth to ${MAX_EXPORT_FILES} items.`);
      eligibleFilesList = eligibleFilesList.slice(0, MAX_EXPORT_FILES);
    }

    // Single-pass deterministic ignore and size tracking
    const eligibleFiles = eligibleFilesList.filter((file) => {
        const ignored = shouldIgnore(file.path, customRules);
        if (ignored) {
            ignoredCount++;
            ignoredBytes += file.size;
        }
        return !ignored;
    });

    if (files.length > 500) {
        console.warn("[CodeMelt] Large repository detected. Export may take longer and use significant system resources.");
    }

    const BATCH_SIZE = 20;

    for (let i = 0; i < eligibleFiles.length; i += BATCH_SIZE) {
        const batch = eligibleFiles.slice(i, i + BATCH_SIZE);
        const processedBatch = await Promise.all(
            batch.map(async (file) => {
                const extension = file.name.split(".").pop()?.toLowerCase() || "";
                const size = file.size;

                let type: "text" | "binary" | "oversized" = "text";
                let content = "";

                let isBin = isBinary(file.name);

                // Safe order flow: type detection ➔ sizing limits ➔ only then read textual content
                if (!isBin && file.readChunk && size > 0) {
                    try {
                        const chunk = await file.readChunk(Math.min(size, 4096));
                        let nullBytes = 0;
                        let nonPrintable = 0;
                        for (let i = 0; i < chunk.length; i++) {
                            const byte = chunk[i];
                            if (byte === 0) nullBytes++;
                            else if ((byte < 32 && byte !== 9 && byte !== 10 && byte !== 13) || byte > 126) nonPrintable++;
                        }
                        if (nullBytes > 0 || (chunk.length > 0 && nonPrintable / chunk.length > 0.3)) {
                            isBin = true;
                        }
                    } catch (e) {
                        // fallback
                    }
                }

                if (isBin) {
                    type = "binary";
                    content = "[Binary file content omitted]";
                } else if (size > MAX_FILE_SIZE) {
                    type = "oversized";
                    content = `[Oversized file content omitted (${(size / 1024 / 1024).toFixed(1)}MB > 1MB limit)]`;
                } else if (totalBytesAccumulator > MAX_EXPORT_BYTES) {
                    type = "oversized";
                    content = "[Omitted by CodeMelt due to total memory ceiling limits exceeded]";
                } else {
                    try {
                        const rawText = await file.text();
                        totalBytesAccumulator += size;
                        
                        // Safe content length characters truncation cap
                        if (rawText.length > MAX_CONTENT_CHARS) {
                            content = rawText.slice(0, MAX_CONTENT_CHARS) + "\n\n[Content truncated by CodeMelt due to size safety thresholds]";
                        } else {
                            content = rawText;
                        }
                    } catch (error) {
                        type = "binary";
                        content = "[Unable to read as text]";
                    }
                }

                // Detect importance
                const importance = detectImportance(file.path, file.name);

                return {
                    name: file.name,
                    path: file.path,
                    extension,
                    size,
                    content,
                    included: true,
                    type,
                    importance,
                };
            })
        );
        scannedFiles.push(...processedBatch);
    }

    const totalScannedBytes = files.reduce((acc, f) => acc + f.size, 0);

    return {
        scannedFiles,
        ignoredCount,
        ignoredBytes,
        totalFiles: files.length,
        totalBytes: totalScannedBytes,
    };
}
