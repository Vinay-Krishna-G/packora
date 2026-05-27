import { useState, useEffect } from "react";
import { ExportMode, ExportIntent } from "@/lib/formatter/types";

type StickyToolbarProps = {
    onUploadClick: () => void;
    exportFormat: "markdown" | "xml";
    setExportFormat: (format: "markdown" | "xml") => void;
    exportMode: ExportMode;
    setExportMode: (mode: ExportMode) => void;
    exportIntent: ExportIntent;
    setExportIntent: (intent: ExportIntent) => void;
    onPreviewClick: () => void;
    onCopyClick: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filesCount: number;
    copied: boolean;
};

export default function StickyToolbar({
    onUploadClick,
    exportFormat,
    setExportFormat,
    exportMode,
    setExportMode,
    exportIntent,
    setExportIntent,
    onPreviewClick,
    onCopyClick,
    searchQuery,
    setSearchQuery,
    filesCount,
    copied,
}: StickyToolbarProps) {
    const [localQuery, setLocalQuery] = useState(searchQuery);

    // Dynamic 200ms debouncing loop to protect list filtering performance
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localQuery);
        }, 200);
        return () => clearTimeout(timer);
    }, [localQuery, setSearchQuery]);

    // Ensure state stays synchronized if parent changes search (e.g. on clean/empty triggers)
    useEffect(() => {
        setLocalQuery(searchQuery);
    }, [searchQuery]);

    return (
        <div className="sticky top-0 z-40 -mx-8 mb-8 border-b border-zinc-900 bg-zinc-950/85 px-8 py-3.5 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Logo & Primary Import */}
                <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold tracking-widest text-white uppercase select-none">
                        Packora //
                    </span>
                    <button
                        onClick={onUploadClick}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition"
                    >
                        Import Folder
                    </button>
                    {filesCount > 0 && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                            {filesCount} active files
                        </span>
                    )}
                </div>

                {/* Configurations matrix */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Debounced Search Field */}
                    <input
                        type="text"
                        placeholder="Quick filter path..."
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        className="w-full sm:w-[160px] rounded-lg border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 outline-none placeholder-zinc-600 focus:border-zinc-800 transition font-mono"
                    />

                    {/* Format Dropdown */}
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-600 uppercase tracking-wide font-mono">Fmt:</span>
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value as "markdown" | "xml")}
                            className="rounded-lg border border-zinc-900 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 font-mono outline-none hover:border-zinc-800 cursor-pointer"
                        >
                            <option value="markdown">Markdown</option>
                            <option value="xml">Pure XML</option>
                        </select>
                    </div>

                    {/* Mode Dropdown */}
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-600 uppercase tracking-wide font-mono">Mode:</span>
                        <select
                            value={exportMode}
                            onChange={(e) => setExportMode(e.target.value as ExportMode)}
                            className="rounded-lg border border-zinc-900 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 font-mono outline-none hover:border-zinc-800 cursor-pointer"
                        >
                            <option value="full">Full (100%)</option>
                            <option value="compact">Compact (No Lows)</option>
                            <option value="architecture">Architecture (0%)</option>
                            <option value="debug">Debug (Configs)</option>
                        </select>
                    </div>

                    {/* Intent Dropdown */}
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-600 uppercase tracking-wide font-mono">Goal:</span>
                        <select
                            value={exportIntent}
                            onChange={(e) => setExportIntent(e.target.value as ExportIntent)}
                            className="rounded-lg border border-zinc-900 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 font-mono outline-none hover:border-zinc-800 cursor-pointer"
                        >
                            <option value="general">General</option>
                            <option value="onboarding">Onboarding</option>
                            <option value="debugging">Debugging</option>
                            <option value="refactoring">Refactor</option>
                            <option value="security">Security</option>
                        </select>
                    </div>

                    {/* Main Action Buttons */}
                    <div className="flex items-center gap-2 ml-auto lg:ml-2">
                        <button
                            type="button"
                            onClick={onCopyClick}
                            disabled={filesCount === 0}
                            className={`
                                rounded-lg border px-3 py-1.5 text-xs font-bold transition shrink-0
                                ${copied
                                    ? "bg-green-950/60 text-green-400 border-green-800/40"
                                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700 disabled:opacity-40"
                                }
                            `}
                        >
                            {copied ? "Copied" : "Copy"}
                        </button>
                        
                        <button
                            type="button"
                            onClick={onPreviewClick}
                            disabled={filesCount === 0}
                            className="rounded-lg border border-white bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-white transition shrink-0"
                        >
                            Preview & Export
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
