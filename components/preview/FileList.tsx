import { ScannedFile }
    from "@/lib/scanner/fileTypes";

import { useState, useMemo } from "react";

type FileListProps = {
    files: ScannedFile[];

    onToggle: (path: string) => void;
};

export default function FileList({
    files,
    onToggle,
}: FileListProps) {
    const [search, setSearch] = useState("");
    
    const filteredFiles = useMemo(() => {
        const lowerSearch = search.toLowerCase();
        return files.filter((file) =>
            file.path.toLowerCase().includes(lowerSearch)
        );
    }, [files, search]);

    return (
        <div className="
      mt-4 max-h-[400px]
      overflow-auto rounded-xl
      border border-zinc-800
      p-4 bg-zinc-950
    ">
            <input
                type="text"
                placeholder="Search files by path..."
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
                className="
                    mb-4 w-full rounded-xl
                    border border-zinc-800
                    bg-zinc-900 px-4 py-3
                    text-sm text-zinc-200 outline-none
                    placeholder-zinc-500 focus:border-zinc-700 transition
                "
            />
            <div className="divide-y divide-zinc-900">
                {filteredFiles.length === 0 ? (
                    <div className="py-8 text-center text-sm text-zinc-500">
                        No files found matching "{search}"
                    </div>
                ) : (
                    filteredFiles.map((file) => (
                        <div
                            key={file.path}
                            className="py-3 text-sm"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                    <span className="truncate text-zinc-300 font-mono text-xs">{file.path}</span>
                                    {file.type === "binary" && (
                                        <span className="rounded bg-blue-950/60 border border-blue-900 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                                            Binary
                                        </span>
                                    )}
                                    {file.type === "oversized" && (
                                        <span className="rounded bg-amber-950/60 border border-amber-900 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                                            Oversized (&gt;1MB)
                                        </span>
                                    )}
                                    <span className="text-[11px] text-zinc-500 font-mono">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>

                                <button
                                    onClick={() => onToggle(file.path)}
                                    className={`
                                        rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0
                                        ${file.included
                                            ? "bg-green-600/20 text-green-400 border border-green-800/40 hover:bg-green-600/30"
                                            : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800"
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