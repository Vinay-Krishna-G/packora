export interface RawFile {
    name: string;
    path: string;
    size: number;
    text: () => Promise<string> | string;
    readChunk?: (bytes: number) => Promise<Uint8Array | any>; // Optional for backward compat
}

export type FileType = "text" | "binary" | "oversized";

export type FileImportance = "critical" | "high" | "normal" | "low";

export interface ScannedFile {
    name: string;
    path: string;
    extension: string;
    size: number;
    content: string;
    included: boolean;
    type: FileType;
    importance: FileImportance;
    hash?: string; // Prepared for future hashing/incremental cache systems
}

export interface ScanResult {
    scannedFiles: ScannedFile[];
    ignoredCount: number;
    ignoredBytes: number; // Actual accumulated size of ignored files
    totalFiles: number;
    totalBytes: number; // Actual accumulated size of all scanned files
}

export type ExportMode = "tiny" | "standard" | "deep" | "maximum";

export type ExportIntent = "general" | "debugging" | "onboarding" | "architecture" | "security";
