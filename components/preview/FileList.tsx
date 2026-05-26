import { ScannedFile }
    from "@/lib/scanner/fileTypes";

import { useState } from "react";

type FileListProps = {
    files: ScannedFile[];

    onToggle: (path: string) => void;
};

export default function FileList({
    files,
    onToggle,
}: FileListProps) {
    const [search, setSearch] = useState("");
    const filteredFiles = files.filter((file) =>
        file.path
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    return (

        <div className="
      mt-4 max-h-[400px]
      overflow-auto rounded-xl
      border border-zinc-800
    "><input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
                className="
    mb-4 w-full rounded-xl
    border border-zinc-800
    bg-zinc-900 px-4 py-3
    text-sm outline-none
  "
            />
            {filteredFiles.map((file) => (
                <div
                    key={file.path}
                    className="
            border-b border-zinc-800
            px-4 py-2 text-sm
            hover:bg-zinc-900
          "
                >
                    <div className="
  flex items-center justify-between
">
                        <span>{file.path}</span>

                        <button
                            onClick={() =>
                                onToggle(file.path)
                            }
                            className={`
      rounded-lg px-3 py-1 text-xs
      ${file.included
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }
    `}
                        >
                            {file.included
                                ? "Included"
                                : "Excluded"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}