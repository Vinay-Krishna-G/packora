export type FileType = "text" | "binary" | "oversized";

export type ScannedFile = {
    name: string;
    path: string;
    extension: string;
    size: number;
    content: string;
    included: boolean;
    type: FileType;
};

export type ScanResult = {
    scannedFiles: ScannedFile[];
    ignoredCount: number;
    totalFiles: number;
};