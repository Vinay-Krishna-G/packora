"use client";

import { useState, useMemo, useRef } from "react";

import { scanFiles } from "@/lib/scanner/scanFiles";
import { generateMarkdown } from "@/lib/formatter/generateMarkdown";
import { downloadFile } from "@/lib/exporter/downloadFile";

import { ScannedFile } from "@/lib/scanner/fileTypes";
import { ExportMode, ExportIntent } from "@/lib/formatter/types";

import FileList from "./preview/FileList";
import RepositoryInsights from "./preview/RepositoryInsights";
import StickyToolbar from "./ui/StickyToolbar";
import ExportPreviewModal from "./preview/ExportPreviewModal";
import Footer from "./ui/Footer";

import { analyzeRepository } from "@/lib/analyzer/repositoryAnalyzer";

type UploadZoneProps = {
    onLogoClick?: () => void;
};

export default function UploadZone({ onLogoClick }: UploadZoneProps) {
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

    // Dynamically calculate the actual context size in KB/MB to prevent token API confusion
    const formattedExportSize = useMemo(() => {
        if (files.length === 0 || !exportContent) return "0 KB";
        const bytes = new Blob([exportContent]).size;
        if (bytes > 1024 * 1024) {
            return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
        }
        return `${(bytes / 1024).toFixed(1)} KB`;
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
        <main className="min-h-screen bg-background text-foreground p-4 sm:p-8 transition duration-150 w-full overflow-x-hidden">
            <div className="mx-auto max-w-4xl w-full min-w-0">
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
                    onLogoClick={onLogoClick}
                />

                {/* Main branding & info headers */}
                <div className="mb-8 mt-4 select-none">
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                        Packora
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground font-mono">
                        Structured repository context generation for development workflows.
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
                            justify-center rounded-2xl border border-border bg-card p-16 sm:p-24 text-center shadow-sm select-none
                            transition hover:border-border/80 hover:bg-muted/30 duration-200
                        "
                    >
                        <p className="text-xs font-bold text-foreground font-mono">
                            Import a repository folder to generate structured development context.
                        </p>
                        <p className="mt-2 text-[11px] text-muted-foreground font-sans leading-relaxed max-w-md">
                            Zero-cost. Purely client-side analysis. Code never leaves your local device.
                        </p>
                    </div>
                ) : (
                    /* Active Dashboard Views */
                    <div className="space-y-8 animate-fadeIn">
                        {/* Summary statistics grid */}
                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 text-xs font-mono w-full min-w-0 select-none">
                            <div className="rounded-xl border border-border bg-card/45 p-3.5 shadow-sm">
                                <div className="text-muted-foreground uppercase tracking-wide text-[8.5px] font-bold">Total files</div>
                                <div className="mt-1 text-sm font-bold text-foreground">{totalFiles}</div>
                            </div>
                            <div className="rounded-xl border border-border bg-card/45 p-3.5 shadow-sm">
                                <div className="text-muted-foreground uppercase tracking-wide text-[8.5px] font-bold">Included files</div>
                                <div className="mt-1 text-sm font-bold text-foreground">{includedCount}</div>
                            </div>
                            <div className="rounded-xl border border-border bg-card/45 p-3.5 shadow-sm">
                                <div className="text-muted-foreground uppercase tracking-wide text-[8.5px] font-bold">Ignored files</div>
                                <div className="mt-1 text-sm font-bold text-foreground">{ignoredCount}</div>
                            </div>
                            <div className="rounded-xl border border-border bg-card/45 p-3.5 shadow-sm col-span-2 sm:col-span-1 md:col-span-1">
                                <div className="text-muted-foreground uppercase tracking-wide text-[8.5px] font-bold">Export size</div>
                                <div className="mt-1 text-sm font-bold text-foreground truncate">{formattedExportSize}</div>
                            </div>
                            <div className="rounded-xl border border-border bg-card/45 p-3.5 shadow-sm col-span-2 sm:col-span-2 md:col-span-1">
                                <div className="text-muted-foreground uppercase tracking-wide text-[8.5px] font-bold">Scan time</div>
                                <div className="mt-1 text-sm font-bold text-foreground">{processingTime}s</div>
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
                
                {/* Reusable premium developer tool footer */}
                <Footer />
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
                onDownload={handleDownload}
            />
        </main>
    );
}