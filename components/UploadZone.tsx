"use client";

import { useState, useMemo } from "react";

import { scanFiles } from "@/lib/scanner/scanFiles";
import { generateMarkdown } from "@/lib/formatter/generateMarkdown";
import { downloadFile } from "@/lib/exporter/downloadFile";

import { ScannedFile } from "@/lib/scanner/fileTypes";

import { estimateTokens }
    from "@/lib/tokenizer/estimateTokens";

import FileList
    from "./preview/FileList";

import RepositoryInsights
    from "./preview/RepositoryInsights";

import { analyzeRepository } from "@/lib/analyzer/repositoryAnalyzer";

export default function UploadZone() {

    const [ignoredCount, setIgnoredCount] = useState(0);
    const [totalFiles, setTotalFiles] = useState(0);
    const [processingTime, setProcessingTime] = useState(0);
    const [files, setFiles] = useState<ScannedFile[]>([]);
    const [exportFormat, setExportFormat] = useState<"markdown" | "xml">("markdown");

    // Dynamically derive generated content based on file array and export format
    const exportContent = useMemo(() => {
        return generateMarkdown(files, exportFormat);
    }, [files, exportFormat]);

    // Dynamically derive repository intelligence heuristics
    const repositoryAnalysis = useMemo(() => {
        return analyzeRepository(files);
    }, [files]);

    // Dynamically derive estimated tokens based on the exported content
    const estimatedTokens = useMemo(() => {
        return estimateTokens(exportContent);
    }, [exportContent]);

    // Dynamically derive how many files are currently included
    const includedCount = useMemo(() => {
        return files.filter((f) => f.included).length;
    }, [files]);

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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">
                        Packora
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        AI-ready project context generation.
                    </p>
                </div>

                <label
                    className="
    mt-6 flex cursor-pointer flex-col items-center
    justify-center rounded-2xl border-2 border-dashed
    border-zinc-700 bg-zinc-900 p-16 text-center
    transition hover:border-zinc-500
  "
                >
                    <input
                        type="file"
                        multiple
                        webkitdirectory="true"
                        className="hidden"
                        onChange={(event) => {
                            const uploadedFiles = Array.from(
                                event.target.files || []
                            );

                            handleFilesUploaded(uploadedFiles);
                        }}
                    />

                    <p className="text-xl font-semibold">
                        Drag & drop or click to upload
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                        Upload your entire project folder
                    </p>
                </label>

                <div className="mt-8 text-sm text-zinc-500">
                    Files never leave your device.
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-zinc-800 p-4">
                        <div className="text-sm text-zinc-400">
                            Total Files
                        </div>

                        <div className="mt-2 text-2xl font-bold">
                            {totalFiles}
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800 p-4">
                        <div className="text-sm text-zinc-400">
                            Included
                        </div>

                        <div className="mt-2 text-2xl font-bold">
                            {includedCount}
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800 p-4">
                        <div className="text-sm text-zinc-400">
                            Ignored
                        </div>

                        <div className="mt-2 text-2xl font-bold">
                            {ignoredCount}
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800 p-4">
                        <div className="text-sm text-zinc-400">
                            Estimated Tokens
                        </div>

                        <div className="mt-2 text-2xl font-bold">
                            {estimatedTokens.toLocaleString()}
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800 p-4">
                        <div className="text-sm text-zinc-400">
                            Processing Time
                        </div>

                        <div className="mt-2 text-2xl font-bold">
                            {processingTime}s
                        </div>
                    </div>
                </div>                <RepositoryInsights analysis={repositoryAnalysis} />

                <div className="mt-8">
                    <h2 className="text-xl font-semibold">
                        Included Files ({includedCount})
                    </h2>

                    <FileList
                        files={files}
                        onToggle={toggleFile}
                    />
                </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                    onClick={() =>
                        downloadFile(
                            exportContent,
                            exportFormat === "markdown" ? "packora-context.md" : "packora-context.xml"
                        )
                    }
                    disabled={!exportContent || files.length === 0}
                    className="
                        rounded-xl bg-white px-6 py-3.5
                        font-semibold text-black transition
                        hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white
                    "
                >
                    Export {exportFormat === "markdown" ? "Markdown" : "XML"}
                </button>

                <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setExportFormat("markdown")}
                        className={`
                            rounded-lg px-4 py-2 text-xs font-semibold transition
                            ${exportFormat === "markdown"
                                ? "bg-zinc-800 text-white"
                                : "text-zinc-400 hover:text-zinc-200"
                            }
                        `}
                    >
                        Markdown (+XML Tags)
                    </button>
                    <button
                        type="button"
                        onClick={() => setExportFormat("xml")}
                        className={`
                            rounded-lg px-4 py-2 text-xs font-semibold transition
                            ${exportFormat === "xml"
                                ? "bg-zinc-800 text-white"
                                : "text-zinc-400 hover:text-zinc-200"
                            }
                        `}
                    >
                        Pure XML
                    </button>
                </div>
            </div>
        </main>
    );
}