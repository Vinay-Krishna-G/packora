export type FileType = "text" | "binary" | "oversized";

export type FileImportance = "critical" | "high" | "normal" | "low";

export type ScannedFile = {
    name: string;
    path: string;
    extension: string;
    size: number;
    content: string;
    included: boolean;
    type: FileType;
    importance: FileImportance;
};

export type ScanResult = {
    scannedFiles: ScannedFile[];
    ignoredCount: number;
    totalFiles: number;
};