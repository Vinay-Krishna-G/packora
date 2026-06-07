import { useState, useMemo } from "react";
import { ExportMode, ExportIntent } from "codemelt-shared";

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
    onDownload,
}: ExportPreviewModalProps) {
    const defaultFilename = `codemelt-context.${format === "markdown" ? "md" : "xml"}`;
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

    // Calculate actual generated context size in KB/MB to prevent token confusion
    const contextSizeBytes = new Blob([content]).size;
    const contextSizeFormatted = contextSizeBytes > 1024 * 1024
        ? `${(contextSizeBytes / 1024 / 1024).toFixed(2)} MB`
        : `${(contextSizeBytes / 1024).toFixed(1)} KB`;

    const previewSnippet = content.length > 1500
        ? content.slice(0, 1500) + "\n\n... [Content Truncated in Preview] ..."
        : content;

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-2xl transition duration-150 min-w-0 animate-fadeIn">

                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-border pb-4 select-none">
                    <div>
                        <h3 className="text-base font-bold text-foreground tracking-tight">
                            Export context blueprint
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground font-mono">
                            Review structure mapping and size efficiency before downloading.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition cursor-pointer"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Metrics Matrix */}
                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono select-none">
                    <div className="rounded-xl border border-border bg-background p-3.5 shadow-sm">
                        <div className="text-muted-foreground uppercase tracking-wide text-[9px] font-bold">Export size</div>
                        <div className="mt-1 text-sm font-semibold text-foreground">{contextSizeFormatted}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3.5 shadow-sm">
                        <div className="text-muted-foreground uppercase tracking-wide text-[9px] font-bold">Total files</div>
                        <div className="mt-1 text-sm font-semibold text-foreground">{includedFilesCount + ignoredFilesCount} items</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3.5 shadow-sm">
                        <div className="text-muted-foreground uppercase tracking-wide text-[9px] font-bold">Included / Ignored</div>
                        <div className="mt-1 text-sm font-semibold text-foreground">{includedFilesCount} / {ignoredFilesCount}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3.5 shadow-sm">
                        <div className="text-muted-foreground uppercase tracking-wide text-[9px] font-bold">Context saved</div>
                        <div className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-extrabold">{savingsPercentage.toFixed(1)}% Saved</div>
                    </div>
                </div>

                {/* Configuration details */}
                <div className="mt-4 flex gap-4 text-xs font-mono text-muted-foreground select-none">
                    <div>Mode: <span className="text-foreground font-semibold uppercase">{mode}</span></div>
                    <div>Goal: <span className="text-foreground font-semibold uppercase">{intent}</span></div>
                    <div>Format: <span className="text-foreground font-semibold uppercase">{format}</span></div>
                </div>

                {/* Filename customizer */}
                <div className="mt-5 select-none">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Customize export filename
                    </label>
                    <input
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground font-mono outline-none focus:border-border/80 focus:ring-1 focus:ring-border/40 transition"
                    />
                </div>

                {/* Code Preview Section with in-snippet Quick Copier */}
                <div className="mt-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
                        Context blueprint preview
                    </span>
                    <div className="mt-2 relative w-full min-w-0">
                        <div className="mt-2 h-[180px] overflow-y-auto overflow-x-hidden rounded-xl border border-border bg-background p-4 text-[11px] text-foreground/90 font-mono leading-relaxed whitespace-pre pr-16 select-all break-all w-full shadow-inner">
                            {previewSnippet}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="absolute top-2.5 right-2.5 rounded bg-card border border-border hover:border-border/80 hover:bg-background px-2 py-1 text-[10px] font-semibold font-mono text-muted-foreground hover:text-foreground transition cursor-pointer shadow-sm select-none"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* Actions Toolbar */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-border pt-4">
                    <button
                        onClick={handleCopy}
                        className={`
                            rounded-xl border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition text-center font-mono cursor-pointer select-none shadow-sm
                            ${copied
                                ? "bg-green-600/10 text-green-650 dark:text-green-400 border-green-600/20"
                                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/40"
                            }
                        `}
                    >
                        {copied ? "Copied to Clipboard!" : "Copy Full Context"}
                    </button>

                    <button
                        onClick={() => onDownload(filename)}
                        className="rounded-xl border border-accent bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground hover:bg-accent-hover transition text-center font-mono cursor-pointer select-none shadow-md"
                    >
                        Download context
                    </button>
                </div>
            </div>
        </div>
    );
}
