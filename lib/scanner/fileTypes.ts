export type ScannedFile = {
    name: string;
    path: string;
    extension: string;
    size: number;
    content: string;
};

export type ScanResult = {
    scannedFiles: ScannedFile[];
    ignoredCount: number;
    totalFiles: number;
};