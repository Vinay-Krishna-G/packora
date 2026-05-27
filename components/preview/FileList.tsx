import { ScannedFile, FileImportance, FileType } from "@/lib/scanner/fileTypes";
import { useState, useMemo } from "react";

type FileListProps = {
    files: ScannedFile[];
    onToggle: (path: string) => void;
    searchQuery: string;
};

export default function FileList({
    files,
    onToggle,
    searchQuery,
}: FileListProps) {
    const [statusFilter, setStatusFilter] = useState<"all" | "included" | "excluded">("all");
    const [importanceFilter, setImportanceFilter] = useState<"all" | "critical" | "high" | "normal" | "low">("all");
    const [typeFilter, setTypeFilter] = useState<"all" | FileType>("all");
    const [sortKey, setSortKey] = useState<"name" | "size">("name");

    // Single-pass high performance filter & sort pipeline
    const processedFiles = useMemo(() => {
        let result = [...files];

        // 1. Search filter
        if (searchQuery) {
            const lowerSearch = searchQuery.toLowerCase();
            result = result.filter((file) =>
                file.path.toLowerCase().includes(lowerSearch)
            );
        }

        // 2. Status filter
        if (statusFilter === "included") {
            result = result.filter((file) => file.included);
        } else if (statusFilter === "excluded") {
            result = result.filter((file) => !file.included);
        }

        // 3. Importance filter
        if (importanceFilter !== "all") {
            result = result.filter((file) => file.importance === importanceFilter);
        }

        // 4. File Type filter
        if (typeFilter !== "all") {
            result = result.filter((file) => file.type === typeFilter);
        }

        // 5. Sorting
        if (sortKey === "size") {
            result.sort((a, b) => b.size - a.size);
        } else {
            result.sort((a, b) => a.path.localeCompare(b.path));
        }

        return result;
    }, [files, searchQuery, statusFilter, importanceFilter, typeFilter, sortKey]);

    const importanceBadges: Record<FileImportance, React.ReactNode> = {
        "critical": (
            <span className="rounded bg-red-950/60 border border-red-900 px-1.5 py-0.5 text-[9px] font-semibold text-red-400 uppercase tracking-wide font-mono">
                Critical
            </span>
        ),
        "high": (
            <span className="rounded bg-amber-950/60 border border-amber-900 px-1.5 py-0.5 text-[9px] font-semibold text-amber-400 uppercase tracking-wide font-mono">
                High
            </span>
        ),
        "normal": null,
        "low": (
            <span className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-[9px] font-normal text-zinc-500 uppercase tracking-wide font-mono">
                Low
            </span>
        )
    };

    return (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            {/* Header controls bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-4">
                <h3 className="text-sm font-bold text-white tracking-tight">
                    Repository Files ({processedFiles.length})
                </h3>
                
                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                    {/* Status filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-zinc-600">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 outline-none hover:border-zinc-700 cursor-pointer"
                        >
                            <option value="all">All</option>
                            <option value="included">Included</option>
                            <option value="excluded">Excluded</option>
                        </select>
                    </div>

                    {/* Importance filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-zinc-600">Priority:</span>
                        <select
                            value={importanceFilter}
                            onChange={(e) => setImportanceFilter(e.target.value as any)}
                            className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 outline-none hover:border-zinc-700 cursor-pointer"
                        >
                            <option value="all">All Priorities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="normal">Normal</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    {/* Type filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-zinc-600">Type:</span>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 outline-none hover:border-zinc-700 cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            <option value="text">Text Files</option>
                            <option value="binary">Binary</option>
                            <option value="oversized">Oversized</option>
                        </select>
                    </div>

                    {/* Sorting selector */}
                    <div className="flex items-center gap-1.5 border-l border-zinc-900 pl-3">
                        <span className="text-zinc-600">Sort:</span>
                        <select
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value as any)}
                            className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 outline-none hover:border-zinc-700 cursor-pointer"
                        >
                            <option value="name">Path Name</option>
                            <option value="size">File Size</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Files List mapping */}
            <div className="max-h-[350px] overflow-auto divide-y divide-zinc-900 pr-1">
                {processedFiles.length === 0 ? (
                    <div className="py-12 text-center text-xs text-zinc-500 font-mono">
                        No files match the active filters or search query.
                    </div>
                ) : (
                    processedFiles.map((file) => (
                        <div
                            key={file.path}
                            className="py-3 text-xs"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                                    <span className="truncate text-zinc-300 font-mono text-[11px]">{file.path}</span>
                                    {importanceBadges[file.importance]}
                                    {file.type === "binary" && (
                                        <span className="rounded bg-blue-950/60 border border-blue-900 px-1.5 py-0.5 text-[9px] font-semibold text-blue-400 uppercase tracking-wide font-mono">
                                            Binary
                                        </span>
                                    )}
                                    {file.type === "oversized" && (
                                        <span className="rounded bg-amber-950/60 border border-amber-900 px-1.5 py-0.5 text-[9px] font-semibold text-amber-400 uppercase tracking-wide font-mono">
                                            Oversized (&gt;1MB)
                                        </span>
                                    )}
                                    <span className="text-[10px] text-zinc-500 font-mono">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>

                                <button
                                    onClick={() => onToggle(file.path)}
                                    className={`
                                        rounded-lg px-2.5 py-1 text-[11px] font-semibold transition shrink-0 font-mono
                                        ${file.included
                                            ? "bg-green-600/10 text-green-400 border border-green-800/30 hover:bg-green-600/20"
                                            : "bg-zinc-900/60 text-zinc-500 border border-zinc-900 hover:bg-zinc-800"
                                        }
                                    `}
                                >
                                    {file.included ? "Included" : "Excluded"}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}