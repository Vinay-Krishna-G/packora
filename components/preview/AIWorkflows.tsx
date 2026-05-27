import { useState } from "react";
import { AIWorkflowPrompt } from "@/lib/analyzer/types";

type AIWorkflowsProps = {
    prompts: AIWorkflowPrompt[];
};

export default function AIWorkflows({
    prompts,
}: AIWorkflowsProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => {
                setCopiedIndex(null);
            }, 2000);
        } catch (err) {
            // Safe fallback in case of block permissions
        }
    };

    if (prompts.length === 0) return null;

    return (
        <div className="mt-6 border-t border-zinc-900 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Adaptive AI Workflows
            </h3>
            
            <div className="space-y-4">
                {prompts.map((prompt, index) => (
                    <div
                        key={prompt.title}
                        className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-4 hover:border-zinc-800 transition"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 w-full min-w-0">
                            <div className="min-w-0 w-full">
                                <h4 className="text-sm font-semibold text-zinc-200">
                                    {prompt.title}
                                </h4>
                                <p className="mt-1 text-xs text-zinc-550 break-words leading-relaxed">
                                    {prompt.description}
                                </p>
                            </div>
                            <button
                                onClick={() => handleCopy(prompt.prompt, index)}
                                className={`
                                    rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider shrink-0 transition self-start sm:self-center
                                    ${copiedIndex === index
                                        ? "bg-green-950/60 text-green-400 border-green-800/40"
                                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700"
                                    }
                                `}
                            >
                                {copiedIndex === index ? "Copied!" : "Copy Prompt"}
                            </button>
                        </div>

                        {/* Monospace Scroll Block */}
                        <div className="mt-3 max-h-[120px] overflow-y-auto overflow-x-hidden rounded-lg border border-zinc-900 bg-zinc-950 p-3 text-xs text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed select-all break-all w-full">
                            {prompt.prompt}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
