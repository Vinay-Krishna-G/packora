import { useState } from "react";
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
        "monorepo": "bg-cyan-950/40 text-cyan-400 border-cyan-900/50",
        "fullstack-monolith": "bg-emerald-950/40 text-emerald-400 border-emerald-900/50",
        "frontend-only": "bg-blue-950/40 text-blue-400 border-blue-900/50",
        "backend-api": "bg-purple-950/40 text-purple-400 border-purple-900/50",
        "realtime-system": "bg-rose-950/40 text-rose-400 border-rose-900/50",
        "unknown": "bg-zinc-900 text-zinc-400 border-zinc-800"
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
        if (score >= 80) return "text-emerald-400";
        if (score >= 50) return "text-amber-400";
        return "text-rose-400";
    };

    return (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/20 p-5">
            {/* 1. Header Information Area */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-4">
                <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">
                        Repository Intelligence Dashboard
                    </h2>
                    <p className="mt-0.5 text-[11px] text-zinc-500 font-mono">
                        Handcrafted semantic stack analysis and flow maps.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono font-semibold uppercase tracking-wider">
                    {purpose.name !== "unknown" && (
                        <div className="rounded border border-zinc-850 bg-zinc-900/60 px-2 py-1 text-zinc-400">
                            {purposeLabels[purpose.name]}
                        </div>
                    )}
                    <div className={`rounded border px-2 py-1 ${archColors[architecture]}`}>
                        {archLabels[architecture]}
                    </div>
                </div>
            </div>

            {/* 2. Intelligence Executive Overview Card */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                {/* Heuristic Summary text block */}
                <div className="md:col-span-2 rounded-xl border border-zinc-900 bg-zinc-950/45 p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider font-mono mb-2">// Heuristic Executive Summary</span>
                    <div className="text-xs text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap">
                        <span className="text-emerald-400 font-bold select-none mr-1.5">&gt;</span>{summary}
                    </div>
                </div>

                {/* Key Metrics block */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/45 p-4 flex flex-col justify-between font-mono text-xs text-zinc-400">
                    <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider mb-2">// Context Compression</span>
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-2">
                        <span>Original Files:</span>
                        <span className="font-semibold text-zinc-200">{compression.originalFilesCount} items</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-2">
                        <span>Context Saved:</span>
                        <span className="font-semibold text-emerald-400">{compression.savingsPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Readiness Grade:</span>
                        <span className={`font-semibold ${getReadinessColor(readinessScore.score)}`}>{readinessScore.score} / 100</span>
                    </div>
                </div>
            </div>

            {/* 3. Static Details Grid (Tech Stack vs Readiness Scorecard) */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
                {/* A. Heuristic Tech Stack flat list */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/10 p-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono block mb-3">// Matched Technology stack ({technologies.length})</span>
                    {technologies.length === 0 ? (
                        <div className="py-6 text-center text-xs text-zinc-650 font-mono">
                            No distinct stack signatures matched in scanning.
                        </div>
                    ) : (
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            {technologies.map(tech => (
                                <div key={tech.name} className="rounded-lg border border-zinc-900/60 bg-zinc-950/40 p-3 text-xs font-mono">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-zinc-300">{tech.name}</span>
                                        <span className="text-zinc-600 text-[9px]">{(tech.confidence * 100).toFixed(0)}% match</span>
                                    </div>
                                    <div className="mt-2 space-y-1 text-[9px] text-zinc-550 border-t border-zinc-900/60 pt-2 leading-relaxed">
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

                {/* B. AI Readiness Scorecard flat lists */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/10 p-4 font-mono text-xs">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-3">// AI Context Readiness Checklist</span>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Score Breakdown list */}
                        <div className="space-y-2 rounded-lg border border-zinc-900/60 bg-zinc-950/40 p-3 text-zinc-400">
                            <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wide block border-b border-zinc-900 pb-1">Scorecard:</span>
                            <div className="flex justify-between text-[11px]">
                                <span>Docs Ratio:</span>
                                <span>{readinessScore.breakdown.documentation} / 20</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span>Typing Quality:</span>
                                <span>{readinessScore.breakdown.typingQuality} / 20</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span>Clarity Level:</span>
                                <span>{readinessScore.breakdown.structureClarity} / 20</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span>Config Match:</span>
                                <span>{readinessScore.breakdown.configCompleteness} / 20</span>
                            </div>
                        </div>

                        {/* Recommendations checklist */}
                        <div className="space-y-2 rounded-lg border border-zinc-900/60 bg-zinc-950/40 p-3 text-zinc-500">
                            <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wide block border-b border-zinc-900 pb-1">Recommendations:</span>
                            {readinessScore.recommendations.slice(0, 3).map(rec => (
                                <div key={rec} className="text-[10.5px] leading-normal flex items-start gap-1">
                                    <span className="text-amber-500 select-none">•</span>
                                    <span className="truncate">{rec}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Request Flow Pipelines (Phase 4) */}
            {semanticAnalysis && semanticAnalysis.flows.length > 0 && (
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/10 p-4 mb-6 font-mono text-xs">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-3">// Semantic Request Flow pipelines</span>
                    <div className="space-y-3.5">
                        {semanticAnalysis.flows.map(flow => (
                            <div key={flow.name} className="rounded-lg border border-zinc-900/60 bg-zinc-950/45 p-3">
                                <div className="text-[10px] font-bold text-zinc-300 mb-2">// {flow.name}</div>
                                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                    {flow.steps.map((step, idx) => (
                                        <div key={step} className="flex items-center gap-1.5">
                                            {idx > 0 && <span className="text-zinc-650 font-bold font-sans">➔</span>}
                                            <span className={`
                                                px-2 py-0.5 rounded border text-[9.5px] font-semibold
                                                ${step.includes("API endpoint") || step.startsWith("POST ") || step.startsWith("GET ")
                                                    ? "bg-blue-950/40 text-blue-400 border-blue-900/40"
                                                    : step.includes("Database") || step.includes("model")
                                                    ? "bg-purple-950/40 text-purple-400 border-purple-900/40"
                                                    : "bg-zinc-900 border-zinc-800 text-zinc-300"
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

            {/* 5. Collapsible Prompts Templates (Only accordion) */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/5 overflow-hidden transition">
                <button
                    onClick={() => setShowWorkflows(!showWorkflows)}
                    className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-900/10 transition text-left"
                >
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                        // 06. Suggested AI prompt templates ({prompts.length})
                    </span>
                    <span className="text-zinc-550 transition duration-150 transform font-mono text-xs select-none">
                        {showWorkflows ? "Collapse [-]" : "Expand [+]"}
                    </span>
                </button>
                {showWorkflows && (
                    <div className="px-4 pb-4 border-t border-zinc-900/50 pt-3">
                        <AIWorkflows prompts={prompts} />
                    </div>
                )}
            </div>
        </div>
    );
}
