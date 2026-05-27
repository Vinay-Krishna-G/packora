import { ScannedFile } from "../scanner/fileTypes";
import { CompressionStats } from "./types";

export function calculateCompression(
  files: ScannedFile[],
  totalFilesCount: number,
  ignoredCount: number
): CompressionStats {
  const originalFilesCount = totalFilesCount;
  
  // Filters active included files
  const includedFiles = files.filter((f) => f.included);
  const compressedFilesCount = includedFiles.length;

  const totalScannedBytes = files.reduce((acc, f) => acc + f.size, 0);
  const totalIncludedBytes = includedFiles.reduce((acc, f) => acc + f.size, 0);

  // Heuristic: estimate average ignored/binary file sizing (8KB per file)
  // to approximate original size before Packora ignored lockfiles/modules/images.
  const estimatedIgnoredBytes = ignoredCount * 8192; // 8KB per file
  const originalBytes = totalScannedBytes + estimatedIgnoredBytes;
  const compressedBytes = totalIncludedBytes;

  const savingsBytes = originalBytes - compressedBytes;
  const savingsPercentage = originalBytes > 0
    ? Math.max(0, Math.min(99.9, Number(((savingsBytes / originalBytes) * 100).toFixed(1))))
    : 0;

  return {
    originalBytes,
    compressedBytes,
    originalFilesCount,
    compressedFilesCount,
    savingsPercentage,
  };
}
