import { useState, useMemo } from "react";
import { ProjectAnalysis, DetectionResult, ArchitectureType, RepositoryPurpose } from "@/lib/analyzer/types";
import AIWorkflows from "./AIWorkflows";

type RepositoryInsightsProps = {
    analysis: ProjectAnalysis;
};

export default function RepositoryInsights({
    analysis,
}: RepositoryInsightsProps) {
    const { technologies, architecture, purpose, readinessScore, prompts, compression, summary, fileCount, totalSize, semanticAnalysis } = analysis;

    const [showWorkflows, setShowWorkflows] = useState(false);

    if (fileCount === 0) return null;

    const archLabels: Record<ArchitectureType, string> = {
        "monorepo": "Monorepo Workspace",
        "fullstack-monolith": "Fullstack Monolith",
        "frontend-only": "Frontend App",
        "backend-api": "Backend API Service",
        "realtime-system": "Realtime System",
        "unknown": "General Repo"
    };

    const archColors: Record<ArchitectureType, string> = {
        "monorepo": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
        "fullstack-monolith": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        "frontend-only": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        "backend-api": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        "realtime-system": "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        "unknown": "bg-card text-muted-foreground border-border"
    };

    const purposeLabels: Record<RepositoryPurpose, string> = {
        "developer-tooling": "Developer Tooling",
        "saas-dashboard": "SaaS Dashboard",
        "chat-application": "Chat App",
        "ecommerce-platform": "Ecommerce Store",
        "cms": "CMS Blog",
        "portfolio": "Portfolio Profile",
        "api-platform": "API Platform",
        "unknown": "General Intent"
    };

    const getReadinessColor = (score: number) => {
        if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
        if (score >= 50) return "text-amber-600 dark:text-amber-400";
        return "text-rose-600 dark:text-rose-400";
    };

    // Helper to evaluate soft, qualitative readiness rating
    const readinessLabel = useMemo(() => {
        const score = readinessScore.score;
        if (score >= 80) return "Strong context quality";
        if (score >= 50) return "Moderate context quality";
        return "Basic context quality";
    }, [readinessScore.score]);

    // Format compression sizes to MB/KB to prevent API credit token confusion
    const formattedOriginalSize = useMemo(() => {
        if (totalSize > 1024 * 1024) {
            return `${(totalSize / 1024 / 1024).toFixed(2)} MB`;
        }
        return `${(totalSize / 1024).toFixed(1)} KB`;
    }, [totalSize]);

    return (
        <div className="mt-8 rounded-2xl border border-border bg-card/45 p-6 sm:p-7 shadow-sm transition duration-150 animate-fadeIn">
            {/* 1. Header Information Area */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-6 select-none">
                <div>
                    <h2 className="text-sm font-bold text-foreground tracking-tight">
                        Repository insights
                    </h2>
                    <p className="mt-1 text-[11px] text-muted-foreground font-mono">
                        Project architecture and technology overview.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono font-semibold uppercase tracking-wider">
                    {purpose.name !== "unknown" && (
                        <div className="rounded border border-border bg-card px-2.5 py-1 text-muted-foreground shadow-sm">
                            {purposeLabels[purpose.name]}
                        </div>
                    )}
                    <div className={`rounded border px-2.5 py-1 shadow-sm ${archColors[architecture]}`}>
                        {archLabels[architecture]}
                    </div>
                </div>
            </div>

            {/* 2. Executive Overview */}
            <div className="grid gap-5 md:grid-cols-3 mb-6">
                {/* Heuristic Summary text block (Refined to 13px font-mono for clear spacing flow) */}
                <div className="md:col-span-2 rounded-xl border border-border bg-card p-5 flex flex-col justify-center shadow-sm">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono mb-2.5">// Repository topology overview</span>
                    <div className="text-[13px] text-foreground/90 leading-relaxed font-mono whitespace-pre-wrap">
                        <span className="text-emerald-500 font-bold select-none mr-1.5">&gt;</span>{summary}
                    </div>
                </div>

                {/* Key Metrics block */}
                <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between font-mono text-[12.5px] text-foreground/90 shadow-sm">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5 select-none">// Context compression</span>
                    <div className="flex justify-between items-center border-b border-border pb-2.5 mb-2.5">
                        <span className="text-muted-foreground">Original size:</span>
                        <span className="font-semibold text-foreground">{formattedOriginalSize}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-2.5 mb-2.5">
                        <span className="text-muted-foreground">Context saved:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-bold">{compression.savingsPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Readiness:</span>
                        <span className={`font-semibold ${getReadinessColor(readinessScore.score)} font-bold`}>
                            {readinessScore.score}/100 ({readinessLabel})
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Details Grid */}
            <div className="grid gap-5 md:grid-cols-2 mb-6">
                {/* Technology list (Upscaled to 12.5px font-mono to reduce compression) */}
                <div className="rounded-xl border border-border bg-card/30 p-5 shadow-sm">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono block mb-3.5 select-none">// Technology stack ({technologies.length})</span>
                    {technologies.length === 0 ? (
                        <div className="py-8 text-center text-xs text-muted-foreground font-mono select-none">
                            No stack signatures detected.
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {technologies.map(tech => (
                                <div key={tech.name} className="rounded-lg border border-border bg-background p-3 text-[12.5px] font-mono leading-relaxed shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-foreground">{tech.name}</span>
                                        <span className="text-muted-foreground text-[9px]">{(tech.confidence * 100).toFixed(0)}% match</span>
                                    </div>
                                    <div className="mt-2 space-y-1 text-[9px] text-muted-foreground border-t border-border pt-2 leading-relaxed">
                                        {tech.explainability.matchedDependencies.length > 0 && (
                                            <div>dep: {tech.explainability.matchedDependencies.join(", ")}</div>
                                        )}
                                        {tech.explainability.matchedFiles.length > 0 && (
                                            <div className="truncate">file: {tech.explainability.matchedFiles.map(f => f.split("/").pop()).join(", ")}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Scorecard */}
                <div className="rounded-xl border border-border bg-card/30 p-5 font-mono text-[12px] shadow-sm">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3.5 select-none">// Context quality scorecard</span>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Score Breakdown list */}
                        <div className="space-y-2 rounded-lg border border-border bg-background p-3 text-foreground shadow-sm">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block border-b border-border pb-1 select-none">Metrics scorecard:</span>
                            <div className="flex justify-between text-[12px] text-foreground/90">
                                <span className="text-muted-foreground">Docs:</span>
                                <span>{readinessScore.breakdown.documentation} / 20</span>
                            </div>
                            <div className="flex justify-between text-[12px] text-foreground/90">
                                <span className="text-muted-foreground">Types:</span>
                                <span>{readinessScore.breakdown.typingQuality} / 20</span>
                            </div>
                            <div className="flex justify-between text-[12px] text-foreground/90">
                                <span className="text-muted-foreground">Clarity:</span>
                                <span>{readinessScore.breakdown.structureClarity} / 20</span>
                            </div>
                            <div className="flex justify-between text-[12px] text-foreground/90">
                                <span className="text-muted-foreground">Configs:</span>
                                <span>{readinessScore.breakdown.configCompleteness} / 20</span>
                            </div>
                        </div>

                        {/* Recommendations checklist */}
                        <div className="space-y-2 rounded-lg border border-border bg-background p-3 text-muted-foreground shadow-sm">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block border-b border-border pb-1 select-none">Grounded adjustments:</span>
                            {readinessScore.recommendations.slice(0, 3).map(rec => (
                                <div key={rec} className="text-[11.5px] leading-normal flex items-start gap-1">
                                    <span className="text-amber-500 select-none">•</span>
                                    <span className="truncate">{rec}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Request Flow Pipelines */}
            {semanticAnalysis && semanticAnalysis.flows.length > 0 && (
                <div className="rounded-xl border border-border bg-card/30 p-5 mb-6 font-mono text-[12px] shadow-sm">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3.5 select-none">// Semantic request pipelines</span>
                    <div className="space-y-3.5">
                        {semanticAnalysis.flows.map(flow => (
                            <div key={flow.name} className="rounded-lg border border-border bg-background p-3 shadow-sm">
                                <div className="text-[11px] font-bold text-foreground/90 mb-2">// {flow.name}</div>
                                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[10px]">
                                    {flow.steps.map((step, idx) => (
                                        <div key={step} className="flex items-center gap-1.5 py-0.5">
                                            {idx > 0 && <span className="text-muted-foreground/85 font-bold font-sans self-center select-none text-[8.5px]">➔</span>}
                                            <span className={`
                                                px-2 py-0.5 rounded border text-[9.5px] font-semibold select-none shadow-sm
                                                ${step.includes("API endpoint") || step.startsWith("POST ") || step.startsWith("GET ")
                                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                                    : step.includes("Database") || step.includes("model")
                                                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                                    : "bg-card border-border text-foreground/90"
                                                }
                                            `}>
                                                {step}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 5. Collapsible Prompts Templates */}
            <div className="rounded-xl border border-border bg-card/20 overflow-hidden transition shadow-sm">
                <button
                    onClick={() => setShowWorkflows(!showWorkflows)}
                    className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-card/40 transition text-left cursor-pointer select-none"
                >
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                        // Suggested prompt templates ({prompts.length})
                    </span>
                    <span className="text-muted-foreground transition duration-150 transform font-mono text-xs">
                        {showWorkflows ? "Collapse [-]" : "Expand [+]"}
                    </span>
                </button>
                {showWorkflows && (
                    <div className="px-4 pb-4 border-t border-border/40 pt-3">
                        <AIWorkflows prompts={prompts} />
                    </div>
                )}
            </div>
        </div>
    );
}
