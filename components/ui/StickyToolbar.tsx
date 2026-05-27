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
    const [showAdvanced, setShowAdvanced] = useState(false);

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
        <div className="sticky top-0 z-40 -mx-4 sm:-mx-8 mb-8 border-b border-zinc-900 bg-zinc-950/85 px-4 sm:px-8 py-3.5 backdrop-blur-md">
            <div className="flex flex-col gap-1">
                {/* Primary Actions Row */}
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

                    {/* Quick Search & Main Action Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        {/* Debounced Search Field */}
                        <input
                            type="text"
                            placeholder="Quick filter path..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="w-full sm:w-[160px] md:w-[180px] rounded-lg border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 outline-none placeholder-zinc-650 focus:border-zinc-800 transition font-mono"
                        />

                        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                            {/* Configure Drawer Toggle */}
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className={`
                                    rounded-lg border px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 font-mono shrink-0
                                    ${showAdvanced
                                        ? "bg-zinc-800 border-zinc-700 text-white"
                                        : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-zinc-300 hover:border-zinc-800"
                                    }
                                `}
                            >
                                <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${showAdvanced ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Configure
                            </button>

                            {/* Copy / Export Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onCopyClick}
                                    disabled={filesCount === 0}
                                    className={`
                                        rounded-lg border px-3 py-1.5 text-xs font-bold transition shrink-0 font-mono
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
                                    className="rounded-lg border border-white bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-white transition shrink-0 font-mono"
                                >
                                    Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collapsible Advanced Tray */}
                {showAdvanced && (
                    <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-zinc-900 pt-3 transition-all duration-300 animate-fadeIn">
                        {/* Format Dropdown */}
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                            <span className="text-zinc-600 uppercase tracking-wide text-[10px]">Format:</span>
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value as "markdown" | "xml")}
                                className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 outline-none hover:border-zinc-700 hover:text-white cursor-pointer transition"
                            >
                                <option value="markdown">Markdown</option>
                                <option value="xml">Pure XML</option>
                            </select>
                        </div>

                        {/* Export Mode Dropdown */}
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                            <span className="text-zinc-600 uppercase tracking-wide text-[10px]">Export Mode:</span>
                            <select
                                value={exportMode}
                                onChange={(e) => setExportMode(e.target.value as ExportMode)}
                                className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 outline-none hover:border-zinc-700 hover:text-white cursor-pointer transition"
                            >
                                <option value="full">Full (100% contents)</option>
                                <option value="compact">Compact (No Lows)</option>
                                <option value="architecture">Architecture (No code)</option>
                                <option value="debug">Curated Debug</option>
                            </select>
                        </div>

                        {/* Export Intent (Goal) Dropdown */}
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                            <span className="text-zinc-600 uppercase tracking-wide text-[10px]">Context Goal:</span>
                            <select
                                value={exportIntent}
                                onChange={(e) => setExportIntent(e.target.value as ExportIntent)}
                                className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 outline-none hover:border-zinc-700 hover:text-white cursor-pointer transition"
                            >
                                <option value="general">General Overview</option>
                                <option value="onboarding">Onboarding Guide</option>
                                <option value="debugging">Runtime Debugging</option>
                                <option value="architecture">Architecture Review</option>
                                <option value="security">Security Audit</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
