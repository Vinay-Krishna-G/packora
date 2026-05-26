export type ScannedFile = {
    name: string;
    path: string;
    extension: string;
    size: number;
    content: string;
    included: boolean;
};

export type ScanResult = {
    scannedFiles: ScannedFile[];
    ignoredCount: number;
    totalFiles: number;
};