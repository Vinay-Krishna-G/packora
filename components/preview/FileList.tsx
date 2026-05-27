import { ScannedFile, FileImportance, FileType } from "@/lib/scanner/fileTypes";
import { useState, useMemo } from "react";
import { SemanticRepositoryAnalysis } from "@/lib/summarizer/types";

type FileListProps = {
    files: ScannedFile[];
    onToggle: (path: string) => void;
    searchQuery: string;
    semanticAnalysis?: SemanticRepositoryAnalysis;
};

export default function FileList({
    files,
    onToggle,
    searchQuery,
    semanticAnalysis,
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
            <span className="rounded bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide font-mono shrink-0 select-none">
                Critical
            </span>
        ),
        "high": (
            <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide font-mono shrink-0 select-none">
                High
            </span>
        ),
        "normal": null,
        "low": (
            <span className="rounded bg-card border border-border px-1.5 py-0.5 text-[8px] font-normal text-muted-foreground uppercase tracking-wide font-mono shrink-0 select-none">
                Low
            </span>
        )
    };

    return (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm">
            {/* Header controls bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-5 select-none">
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                    Repository files ({processedFiles.length})
                </h3>
                
                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3.5 text-[11px] font-mono">
                    {/* Status filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground uppercase text-[9px] font-bold">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="rounded bg-background border border-border px-2 py-1 text-foreground outline-none hover:border-border/80 cursor-pointer"
                        >
                            <option value="all">All</option>
                            <option value="included">Included</option>
                            <option value="excluded">Excluded</option>
                        </select>
                    </div>

                    {/* Importance filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground uppercase text-[9px] font-bold">Priority:</span>
                        <select
                            value={importanceFilter}
                            onChange={(e) => setImportanceFilter(e.target.value as any)}
                            className="rounded bg-background border border-border px-2 py-1 text-foreground outline-none hover:border-border/80 cursor-pointer"
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
                        <span className="text-muted-foreground uppercase text-[9px] font-bold">Type:</span>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="rounded bg-background border border-border px-2 py-1 text-foreground outline-none hover:border-border/80 cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            <option value="text">Text Files</option>
                            <option value="binary">Binary</option>
                            <option value="oversized">Oversized</option>
                        </select>
                    </div>

                    {/* Sorting selector */}
                    <div className="flex items-center gap-1.5 border-l border-border pl-3.5">
                        <span className="text-muted-foreground uppercase text-[9px] font-bold">Sort:</span>
                        <select
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value as any)}
                            className="rounded bg-background border border-border px-2 py-1 text-foreground outline-none hover:border-border/80 cursor-pointer"
                        >
                            <option value="name">Path Name</option>
                            <option value="size">File Size</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Files List mapping */}
            <div className="max-h-[400px] overflow-auto divide-y divide-border/50 pr-1">
                {processedFiles.length === 0 ? (
                    <div className="py-12 text-center text-xs text-muted-foreground font-mono select-none">
                        No files match the active filters or search query.
                    </div>
                ) : (
                    processedFiles.map((file) => {
                        // Resolve semantic annotations from analysis map
                        const sem = semanticAnalysis?.fileSummaries[file.path];
                        
                        // Parse folder structures for hover aggregates
                        const pathParts = file.path.split("/");
                        pathParts.pop(); // remove file name
                        const folderPath = pathParts.join("/");
                        const dirSem = folderPath ? semanticAnalysis?.directorySummaries[folderPath] : null;

                        return (
                            <div
                                key={file.path}
                                className="py-3.5 text-xs transition duration-150"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full min-w-0">
                                    <div className="flex flex-col min-w-0 w-full break-all">
                                        <div className="flex items-center gap-2 flex-wrap min-w-0 w-full">
                                            {/* Folder Hover Trigger */}
                                            <div className="group relative min-w-0 max-w-full">
                                                <span className="block truncate text-foreground/90 font-mono text-[11px] sm:text-[11.5px] cursor-help border-b border-dashed border-border pb-0.5 hover:text-foreground hover:border-border/80 transition">
                                                    {file.path}
                                                </span>
                                                {dirSem && (
                                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 w-[calc(100vw-3rem)] sm:w-72 rounded-xl border border-border bg-card p-4 text-[10px] text-muted-foreground font-mono shadow-2xl leading-relaxed select-none animate-fadeIn">
                                                        <div className="font-bold text-foreground uppercase tracking-wider mb-1.5 text-[8px]">// Folder: /{folderPath}</div>
                                                        {dirSem.summary}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Entrypoint indicators */}
                                            {sem?.isEntrypoint && (
                                                <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide font-mono shrink-0 select-none">
                                                    Entrypoint ({sem.entrypointType})
                                                </span>
                                            )}

                                            {/* Routes indicators */}
                                            {sem?.routes?.map((route) => (
                                                <span key={route} className="rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-blue-600 dark:text-blue-400 font-mono shrink-0 uppercase select-none">
                                                    {route}
                                                </span>
                                            ))}

                                            {/* Standard properties indicators */}
                                            {importanceBadges[file.importance]}
                                            {file.type === "binary" && (
                                                <span className="rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide font-mono shrink-0 select-none">
                                                    Binary
                                                </span>
                                            )}
                                            {file.type === "oversized" && (
                                                <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide font-mono shrink-0 select-none">
                                                    Oversized (&gt;1MB)
                                                </span>
                                            )}
                                            
                                            <span className="text-[10.5px] text-muted-foreground font-mono shrink-0 select-none">
                                                ({(file.size / 1024).toFixed(1)} KB)
                                            </span>
                                        </div>

                                        {/* Inline Semantic Summary text line */}
                                        {sem?.summary && (
                                            <div className="mt-1.5 text-[11px] sm:text-[11.5px] text-muted-foreground font-mono leading-relaxed max-w-3xl">
                                                {sem.summary}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Toggle Button */}
                                    <button
                                        onClick={() => onToggle(file.path)}
                                        className={`
                                            rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition shrink-0 font-mono self-start sm:self-center cursor-pointer select-none shadow-sm
                                            ${file.included
                                                ? "bg-green-600/10 text-green-650 dark:text-green-400 border border-green-600/20 hover:bg-green-600/20"
                                                : "bg-card text-muted-foreground border border-border hover:bg-background"
                                            }
                                        `}
                                    >
                                        {file.included ? "Included" : "Excluded"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}