import { useState } from "react";
import { AIWorkflowPrompt } from "@codemelt/core";

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
        <div className="mt-6 border-t border-border pt-5 transition duration-150">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 select-none">
                Adaptive workflows
            </h3>
            
            <div className="space-y-4">
                {prompts.map((prompt, index) => (
                    <div
                        key={prompt.title}
                        className="rounded-xl border border-border bg-card p-4 hover:border-border/80 transition shadow-sm"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 w-full min-w-0">
                            <div className="min-w-0 w-full">
                                <h4 className="text-sm font-semibold text-foreground/95">
                                    {prompt.title}
                                </h4>
                                <p className="mt-1 text-xs text-muted-foreground break-words leading-relaxed">
                                    {prompt.description}
                                </p>
                            </div>
                            <button
                                onClick={() => handleCopy(prompt.prompt, index)}
                                className={`
                                    rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider shrink-0 transition self-start sm:self-center cursor-pointer select-none shadow-sm
                                    ${copiedIndex === index
                                        ? "bg-green-600/10 text-green-650 dark:text-green-400 border-green-600/20"
                                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                                    }
                                `}
                            >
                                {copiedIndex === index ? "Copied!" : "Copy Prompt"}
                            </button>
                        </div>

                        {/* Monospace Scroll Block */}
                        <div className="mt-3 max-h-[120px] overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-background p-3 text-xs text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed select-all break-all w-full shadow-inner">
                            {prompt.prompt}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
