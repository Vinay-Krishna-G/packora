"use client";

import { useState } from "react";

import { scanFiles } from "@/lib/scanner/scanFiles";
import { generateMarkdown } from "@/lib/formatter/generateMarkdown";
import { downloadFile } from "@/lib/exporter/downloadFile";

import { ScannedFile } from "@/lib/scanner/fileTypes";

import { estimateTokens }
    from "@/lib/tokenizer/estimateTokens";

import FileList
    from "./preview/FileList";

export default function UploadZone() {

    const [ignoredCount, setIgnoredCount] =
        useState(0);

    const [totalFiles, setTotalFiles] =
        useState(0);

    const [processingTime, setProcessingTime] =
        useState(0);

    const [markdownContent, setMarkdownContent] =
        useState("");

    const [files, setFiles] = useState<ScannedFile[]>([]);

    const [estimatedTokens, setEstimatedTokens] =
        useState(0);

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

        const markdown = generateMarkdown(
            result.scannedFiles
        );

        setMarkdownContent(markdown);

        setEstimatedTokens(
            estimateTokens(markdown)
        );

        // downloadFile(markdown, "packora-context.md");

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
                            {files.length}
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
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold">
                        Included Files ({files.length})
                    </h2>

                    <FileList
                        files={files}
                        onToggle={toggleFile}
                    />                </div>
            </div>
            <button
                onClick={() =>
                    downloadFile(
                        markdownContent,
                        "packora-context.md"
                    )
                }
                disabled={!markdownContent}
                className="
    mt-8 rounded-xl bg-white px-6 py-3
    font-semibold text-black transition
    hover:bg-zinc-200 disabled:opacity-50
  "
            >
                Export Markdown
            </button>
        </main>
    );
}