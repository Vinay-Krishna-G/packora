"use client";

import { useState } from "react";
import { scanFiles } from "@/lib/scanner/scanFiles";
import { ScannedFile } from "@/lib/scanner/fileTypes";

import { generateMarkdown } from "@/lib/formatter/generateMarkdown";

import { downloadFile } from "@/lib/exporter/downloadFile";

export default function UploadZone() {
    const [files, setFiles] = useState<ScannedFile[]>([]);

    async function handleFolderUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const uploadedFiles = Array.from(event.target.files || []);

        const scanned = await scanFiles(uploadedFiles);

        const markdown = generateMarkdown(scanned);

        downloadFile(markdown, "packora-context.md");

        setFiles(scanned);
    }

    return (
        <div className="p-8">
            <input
                type="file"
                multiple
                webkitdirectory="true"
                onChange={handleFolderUpload}
            />

            <div className="mt-6">
                <h2 className="text-xl font-bold">
                    Scanned Files: {files.length}
                </h2>

                <ul className="mt-4 space-y-2">
                    {files.map((file) => (
                        <li
                            key={file.path}
                            className="rounded border p-2"
                        >
                            {file.path}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}