import { ScannedFile } from "@codemelt/shared";
import { CompressionStats } from "./types.js";

export function calculateCompression(
  files: ScannedFile[],
  totalFilesCount: number,
  ignoredCount: number,
  ignoredBytes: number = 0
): CompressionStats {
  const originalFilesCount = totalFilesCount;
  
  // Filters active included files
  const includedFiles = files.filter((f) => f.included);
  const compressedFilesCount = includedFiles.length;

  const totalScannedBytes = files.reduce((acc, f) => acc + f.size, 0);
  const totalIncludedBytes = includedFiles.reduce((acc, f) => acc + f.size, 0);

  // Strictly use real ignoredBytes
  const originalBytes = totalScannedBytes + ignoredBytes;
  const compressedBytes = totalIncludedBytes;

  const savingsPercentage = originalBytes > 0 && ignoredBytes > 0
    ? Math.max(0, Math.min(99.9, Number(((ignoredBytes / originalBytes) * 100).toFixed(1))))
    : 0;

  return {
    originalBytes,
    compressedBytes,
    originalFilesCount,
    compressedFilesCount,
    savingsPercentage,
  };
}
