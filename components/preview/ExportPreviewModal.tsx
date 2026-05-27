import { useState } from "react";
import { ExportMode, ExportIntent } from "@/lib/formatter/types";

type ExportPreviewModalProps = {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    format: "markdown" | "xml";
    mode: ExportMode;
    intent: ExportIntent;
    includedFilesCount: number;
    ignoredFilesCount: number;
    savingsPercentage: number;
    estimatedTokens: number;
    onDownload: (customFilename: string) => void;
};

export default function ExportPreviewModal({
    isOpen,
    onClose,
    content,
    format,
    mode,
    intent,
    includedFilesCount,
    ignoredFilesCount,
    savingsPercentage,
    estimatedTokens,
    onDownload,
}: ExportPreviewModalProps) {
    const defaultFilename = `packora-context.${format === "markdown" ? "md" : "xml"}`;
    const [filename, setFilename] = useState(defaultFilename);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Safe permission fallback
        }
    };

    // Calculate approximate character size in KB/MB
    const contextSizeBytes = new Blob([content]).size;
    const contextSizeFormatted = contextSizeBytes > 1024 * 1024
        ? `${(contextSizeBytes / 1024 / 1024).toFixed(2)} MB`
        : `${(contextSizeBytes / 1024).toFixed(1)} KB`;

    const previewSnippet = content.length > 1500
        ? content.slice(0, 1500) + "\n\n... [Content Truncated in Preview] ..."
        : content;

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl transition duration-200">
                
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                    <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                            AI Context Export Preview
                        </h3>
                        <p className="mt-0.5 text-xs text-zinc-500 font-mono">
                            Review optimization ratios and file headers before ingesting.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Metrics Matrix */}
                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="rounded-xl border border-zinc-900/60 bg-zinc-900/10 p-3">
                        <div className="text-zinc-550 uppercase tracking-wide text-[9px] font-bold">Estimated AI Context Size</div>
                        <div className="mt-1 text-sm font-semibold text-zinc-200">{contextSizeFormatted}</div>
                    </div>
                    <div className="rounded-xl border border-zinc-900/60 bg-zinc-900/10 p-3">
                        <div className="text-zinc-550 uppercase tracking-wide text-[9px] font-bold">Approximate Input Size</div>
                        <div className="mt-1 text-sm font-semibold text-zinc-200">{estimatedTokens.toLocaleString()} tokens</div>
                    </div>
                    <div className="rounded-xl border border-zinc-900/60 bg-zinc-900/10 p-3">
                        <div className="text-zinc-550 uppercase tracking-wide text-[9px] font-bold">Included / Ignored</div>
                        <div className="mt-1 text-sm font-semibold text-zinc-200">{includedFilesCount} / {ignoredFilesCount}</div>
                    </div>
                    <div className="rounded-xl border border-zinc-900/60 bg-zinc-900/10 p-3">
                        <div className="text-zinc-550 uppercase tracking-wide text-[9px] font-bold">Compression Savings</div>
                        <div className="mt-1 text-sm font-semibold text-emerald-400">{savingsPercentage.toFixed(1)}% Saved</div>
                    </div>
                </div>

                {/* Configuration details */}
                <div className="mt-4 flex gap-4 text-xs font-mono text-zinc-500">
                    <div>Mode: <span className="text-zinc-300 font-semibold uppercase">{mode}</span></div>
                    <div>Intent: <span className="text-zinc-300 font-semibold uppercase">{intent}</span></div>
                    <div>Format: <span className="text-zinc-300 font-semibold uppercase">{format}</span></div>
                </div>

                {/* Filename customizer */}
                <div className="mt-5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Customize Export Filename
                    </label>
                    <input
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-300 font-mono outline-none focus:border-zinc-800 transition"
                    />
                </div>

                {/* Code Preview Section with in-snippet Quick Copier */}
                <div className="mt-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Context Blueprint Preview
                    </span>
                    <div className="mt-2 relative">
                        <div className="mt-2 h-[200px] overflow-auto rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-[11px] text-zinc-400 font-mono leading-relaxed whitespace-pre-wrap select-all pr-16">
                            {previewSnippet}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="absolute top-2.5 right-2.5 rounded bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 px-2 py-1 text-[10px] font-semibold font-mono text-zinc-400 hover:text-zinc-200 transition"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* Actions Toolbar */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-zinc-900 pt-4">
                    <button
                        onClick={handleCopy}
                        className={`
                            rounded-xl border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition text-center font-mono
                            ${copied
                                ? "bg-green-950/60 text-green-400 border-green-800/40"
                                : "bg-white text-black border-white hover:bg-zinc-200"
                            }
                        `}
                    >
                        {copied ? "Copied to Clipboard!" : "Copy Full Context"}
                    </button>
                    
                    <button
                        onClick={() => onDownload(filename)}
                        className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-zinc-700 transition text-center font-mono"
                    >
                        Download context
                    </button>
                </div>
            </div>
        </div>
    );
}
