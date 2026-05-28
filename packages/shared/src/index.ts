export * from "./types.js";
export {
    MAX_FILES,
    MAX_TOTAL_BYTES,
    MAX_FILE_SIZE,
    MAX_CONTENT_CHARS,
    MAX_EXPORT_FILES,
    MAX_EXPORT_BYTES,
    MAX_DIRECTORY_DEPTH,
    DEFAULT_IGNORES,
} from "./constants.js";

export function normalizePath(p: string): string {
    return p.replace(/\\/g, "/");
}
