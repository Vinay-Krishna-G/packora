"use client";

import { useState, useMemo, useRef } from "react";

import { scanFiles } from "@/lib/scanner/scanFiles";
import { generateMarkdown } from "@/lib/formatter/generateMarkdown";
import { downloadFile } from "@/lib/exporter/downloadFile";

import { ScannedFile } from "@/lib/scanner/fileTypes";
import { ExportMode, ExportIntent } from "@/lib/formatter/types";

import { estimateTokens } from "@/lib/tokenizer/estimateTokens";

import FileList from "./preview/FileList";
import RepositoryInsights from "./preview/RepositoryInsights";
import StickyToolbar from "./ui/StickyToolbar";
import ExportPreviewModal from "./preview/ExportPreviewModal";

import { analyzeRepository } from "@/lib/analyzer/repositoryAnalyzer";

export default function UploadZone() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [ignoredCount, setIgnoredCount] = useState(0);
    const [totalFiles, setTotalFiles] = useState(0);
    const [processingTime, setProcessingTime] = useState(0);
    const [files, setFiles] = useState<ScannedFile[]>([]);
    
    // Configurations state
    const [exportFormat, setExportFormat] = useState<"markdown" | "xml">("markdown");
    const [exportMode, setExportMode] = useState<ExportMode>("full");
    const [exportIntent, setExportIntent] = useState<ExportIntent>("general");
    const [searchQuery, setSearchQuery] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Dynamically derive generated content based on file array, export format, mode, and intent
    const exportContent = useMemo(() => {
        if (files.length === 0) return "";
        return generateMarkdown(files, exportFormat, exportMode, exportIntent);
    }, [files, exportFormat, exportMode, exportIntent]);

    // Dynamically derive repository intelligence heuristics
    const repositoryAnalysis = useMemo(() => {
        return analyzeRepository(files, totalFiles, ignoredCount);
    }, [files, totalFiles, ignoredCount]);

    // Dynamically derive estimated tokens based on the exported content (resolves garbage count bugs)
    const estimatedTokens = useMemo(() => {
        if (files.length === 0) return 0;
        return estimateTokens(exportContent);
    }, [files, exportContent]);

    // Dynamically derive how many files are currently included
    const includedCount = useMemo(() => {
        return files.filter((f) => f.included).length;
    }, [files]);

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleCopy = async () => {
        if (!exportContent) return;
        try {
            await navigator.clipboard.writeText(exportContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Permission fallback
        }
    };

    const handleDownload = (customFilename: string) => {
        if (!exportContent) return;
        downloadFile(exportContent, customFilename);
    };

    function toggleFile(path: string) {
        setFiles((previousFiles) =>
            previousFiles.map((file) =>
                file.path === path
                    ? {
                        ...file,
                        included: !file.included,
                    }
                    : file
            )
        );
    }

    async function handleFilesUploaded(
        uploadedFiles: File[]
    ) {
        const start = performance.now();

        const result = await scanFiles(uploadedFiles);

        setFiles(result.scannedFiles);
        setIgnoredCount(result.ignoredCount);
        setTotalFiles(result.totalFiles);

        const end = performance.now();

        setProcessingTime(
            Number(((end - start) / 1000).toFixed(2))
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-8">
            <div className="mx-auto max-w-4xl">
                {/* Sticky Toolbar Widget */}
                <StickyToolbar
                    onUploadClick={triggerUpload}
                    exportFormat={exportFormat}
                    setExportFormat={setExportFormat}
                    exportMode={exportMode}
                    setExportMode={setExportMode}
                    exportIntent={exportIntent}
                    setExportIntent={setExportIntent}
                    onPreviewClick={() => setIsPreviewOpen(true)}
                    onCopyClick={handleCopy}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filesCount={files.length}
                    copied={copied}
                />

                {/* Main branding & info headers */}
                <div className="mb-8 mt-4">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Packora
                    </h1>
                    <p className="mt-1 text-xs text-zinc-500 font-mono">
                        AI-native codebase context preparation.
                    </p>
                </div>

                {/* Hidden folder upload element */}
                <input
                    type="file"
                    multiple
                    webkitdirectory="true"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(event) => {
                        const uploadedFiles = Array.from(
                            event.target.files || []
                        );
                        handleFilesUploaded(uploadedFiles);
                    }}
                />

                {files.length === 0 ? (
                    /* Clean Empty State */
                    <div 
                        onClick={triggerUpload}
                        className="
                            mt-8 flex cursor-pointer flex-col items-center
                            justify-center rounded-2xl border border-zinc-900 bg-zinc-950/40 p-24 text-center
                            transition hover:border-zinc-800 hover:bg-zinc-950 duration-200
                        "
                    >
                        <p className="text-sm font-semibold text-zinc-300">
                            Drag & drop or click to scan project folder
                        </p>
                        <p className="mt-1.5 text-xs text-zinc-600 font-mono">
                            Client-side only. Files never leave your local device.
                        </p>
                    </div>
                ) : (
                    /* Active Dashboard Views */
                    <div className="space-y-6">
                        {/* Summary statistics grid */}
                        <div className="grid gap-3 grid-cols-2 md:grid-cols-5 text-xs font-mono">
                            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-3">
                                <div className="text-zinc-600 uppercase tracking-wide text-[9px]">Total Files</div>
                                <div className="mt-1 text-sm font-bold text-zinc-200">{totalFiles}</div>
                            </div>
                            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-3">
                                <div className="text-zinc-600 uppercase tracking-wide text-[9px]">Included</div>
                                <div className="mt-1 text-sm font-bold text-zinc-200">{includedCount}</div>
                            </div>
                            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-3">
                                <div className="text-zinc-600 uppercase tracking-wide text-[9px]">Ignored</div>
                                <div className="mt-1 text-sm font-bold text-zinc-200">{ignoredCount}</div>
                            </div>
                            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-3">
                                <div className="text-zinc-600 uppercase tracking-wide text-[9px]">Approximate Input Size</div>
                                <div className="mt-1 text-sm font-bold text-zinc-200">{estimatedTokens.toLocaleString()} tokens</div>
                            </div>
                            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-3">
                                <div className="text-zinc-600 uppercase tracking-wide text-[9px]">Scan Time</div>
                                <div className="mt-1 text-sm font-bold text-zinc-200">{processingTime}s</div>
                            </div>
                        </div>

                        {/* Collapsible Intelligence Card */}
                        <RepositoryInsights analysis={repositoryAnalysis} />

                        {/* Interactive File Listing panel */}
                        <FileList
                            files={files}
                            onToggle={toggleFile}
                            searchQuery={searchQuery}
                            semanticAnalysis={repositoryAnalysis.semanticAnalysis}
                        />
                    </div>
                )}
            </div>

            {/* Premium Export Preview modal overlay */}
            <ExportPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                content={exportContent}
                format={exportFormat}
                mode={exportMode}
                intent={exportIntent}
                includedFilesCount={includedCount}
                ignoredFilesCount={ignoredCount + (files.length - includedCount)}
                savingsPercentage={repositoryAnalysis.compression.savingsPercentage}
                estimatedTokens={estimatedTokens}
                onDownload={handleDownload}
            />
        </main>
    );
}