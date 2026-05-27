import { useState } from "react";
import { ProjectAnalysis, DetectionResult, ArchitectureType, RepositoryPurpose } from "@/lib/analyzer/types";
import AIWorkflows from "./AIWorkflows";

type RepositoryInsightsProps = {
    analysis: ProjectAnalysis;
};

export default function RepositoryInsights({
    analysis,
}: RepositoryInsightsProps) {
    const { technologies, architecture, purpose, readinessScore, prompts, compression, summary, fileCount, totalSize } = analysis;

    // Accordion state tracker for clean progressive disclosure
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        overview: true,
        stack: true,
        readiness: false,
        compression: false,
        workflows: false,
    });

    if (fileCount === 0) return null;

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const archLabels: Record<ArchitectureType, string> = {
        "monorepo": "Monorepo",
        "fullstack-monolith": "Fullstack Monolith",
        "frontend-only": "Frontend App",
        "backend-api": "Backend API",
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

    const categoryLabels: Record<string, string> = {
        "framework": "Frameworks",
        "database": "Databases",
        "styling": "Styling",
        "runtime": "Runtimes",
        "state-management": "State Managers",
        "realtime": "Realtime"
    };

    const getReadinessColor = (score: number) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 50) return "text-amber-400";
        return "text-rose-400";
    };



    return (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/20 p-5">
            {/* Header info area */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-4">
                <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">
                        Repository Intelligence Card
                    </h2>
                    <p className="mt-0.5 text-[11px] text-zinc-500 font-mono">
                        Handcrafted semantic stack and layout heuristics.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono font-semibold uppercase tracking-wider">
                    {purpose.name !== "unknown" && (
                        <div className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-1 text-zinc-400">
                            {purposeLabels[purpose.name]}
                        </div>
                    )}
                    <div className={`rounded border px-2 py-1 ${archColors[architecture]}`}>
                        {archLabels[architecture]}
                    </div>
                </div>
            </div>

            {/* Accordions Matrix */}
            <div className="space-y-3">
                {/* 1. Repository Overview section */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-900/5 overflow-hidden transition">
                    <button
                        onClick={() => toggleSection("overview")}
                        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-900/10 transition text-left"
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                            // 01. Repository Overview
                        </span>
                        <span className="text-zinc-500 transition duration-150 transform">
                            {openSections.overview ? "Collapse [-]" : "Expand [+]"}
                        </span>
                    </button>
                    {openSections.overview && (
                        <div className="px-4 pb-4 border-t border-zinc-900/50 pt-3">
                            <div className="rounded-lg border border-zinc-900/60 bg-zinc-950/40 p-4 text-xs text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap">
                                <span className="text-emerald-400 font-bold select-none">&gt;</span> {summary}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Detected Stack section */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-900/5 overflow-hidden transition">
                    <button
                        onClick={() => toggleSection("stack")}
                        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-900/10 transition text-left"
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                            // 02. Tech Stack & Explainability
                        </span>
                        <span className="text-zinc-500 transition duration-150 transform">
                            {openSections.stack ? "Collapse [-]" : "Expand [+]"}
                        </span>
                    </button>
                    {openSections.stack && (
                        <div className="px-4 pb-4 border-t border-zinc-900/50 pt-3">
                            {technologies.length === 0 ? (
                                <div className="py-4 text-center text-xs text-zinc-500 font-mono">
                                    No distinct stack signatures matched in scanning.
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {technologies.map(tech => (
                                        <div key={tech.name} className="rounded-lg border border-zinc-900 bg-zinc-950/20 p-3 text-xs">
                                            <div className="flex items-center justify-between font-mono">
                                                <span className="font-semibold text-zinc-300">{tech.name}</span>
                                                <span className="text-zinc-500 text-[10px]">{(tech.confidence * 100).toFixed(0)}% score</span>
                                            </div>
                                            <div className="mt-2 space-y-1 text-[10px] text-zinc-500 border-t border-zinc-900/60 pt-2 font-mono">
                                                {tech.explainability.matchedDependencies.length > 0 && (
                                                    <div>dep: {tech.explainability.matchedDependencies.join(", ")}</div>
                                                )}
                                                {tech.explainability.matchedFiles.length > 0 && (
                                                    <div>file: {tech.explainability.matchedFiles.map(f => f.split("/").pop()).join(", ")}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. AI Readiness Scorecard */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-900/5 overflow-hidden transition">
                    <button
                        onClick={() => toggleSection("readiness")}
                        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-900/10 transition text-left"
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                            // 03. AI Context Readiness scorecard
                        </span>
                        <span className="text-zinc-500 transition duration-150 transform">
                            {openSections.readiness ? "Collapse [-]" : "Expand [+]"}
                        </span>
                    </button>
                    {openSections.readiness && (
                        <div className="px-4 pb-4 border-t border-zinc-900/50 pt-3">
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Score Breakdown */}
                                <div className="rounded-lg border border-zinc-900 bg-zinc-950/20 p-3 text-xs font-mono text-zinc-400 space-y-2">
                                    <div className="flex justify-between border-b border-zinc-900 pb-1.5 font-bold">
                                        <span>Readiness Grade:</span>
                                        <span className={getReadinessColor(readinessScore.score)}>{readinessScore.score} / 100</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span>Documentation:</span>
                                        <span>{readinessScore.breakdown.documentation} / 20</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span>Typing Integrity:</span>
                                        <span>{readinessScore.breakdown.typingQuality} / 20</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span>Structural Clarity:</span>
                                        <span>{readinessScore.breakdown.structureClarity} / 20</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span>Config Completeness:</span>
                                        <span>{readinessScore.breakdown.configCompleteness} / 20</span>
                                    </div>
                                </div>
                                {/* Recommendations */}
                                <div className="rounded-lg border border-zinc-900 bg-zinc-950/20 p-3 text-xs font-mono text-zinc-500 space-y-2">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Recommended DX Fixes</span>
                                    {readinessScore.recommendations.map(rec => (
                                        <div key={rec} className="text-[11px] leading-normal flex items-start gap-1.5">
                                            <span className="text-amber-500 font-bold select-none">•</span>
                                            <span>{rec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Compression Statistics */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-900/5 overflow-hidden transition">
                    <button
                        onClick={() => toggleSection("compression")}
                        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-900/10 transition text-left"
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                            // 04. Context Compression Statistics
                        </span>
                        <span className="text-zinc-500 transition duration-150 transform">
                            {openSections.compression ? "Collapse [-]" : "Expand [+]"}
                        </span>
                    </button>
                    {openSections.compression && (
                        <div className="px-4 pb-4 border-t border-zinc-900/50 pt-3">
                            <div className="rounded-lg border border-zinc-900 bg-zinc-950/20 p-4 text-xs font-mono text-zinc-400">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="border-r border-zinc-900">
                                        <div className="text-[10px] text-zinc-500 uppercase">Token Reduction</div>
                                        <div className="mt-1 text-sm font-bold text-emerald-400">{compression.savingsPercentage.toFixed(1)}%</div>
                                    </div>
                                    <div className="border-r border-zinc-900">
                                        <div className="text-[10px] text-zinc-500 uppercase">Original Size</div>
                                        <div className="mt-1 text-sm font-bold text-zinc-300">{(compression.originalBytes / 1024 / 1024).toFixed(1)} MB</div>
                                    </div>
                                    <div className="border-r border-zinc-900">
                                        <div className="text-[10px] text-zinc-500 uppercase">Context Size</div>
                                        <div className="mt-1 text-sm font-bold text-zinc-300">{(compression.compressedBytes / 1024).toFixed(1)} KB</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase">Ignored count</div>
                                        <div className="mt-1 text-sm font-bold text-zinc-300">{compression.originalFilesCount - compression.compressedFilesCount} items</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Workflows Prompts panel */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-900/5 overflow-hidden transition">
                    <button
                        onClick={() => toggleSection("workflows")}
                        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-900/10 transition text-left"
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                            // 05. Adaptive AI prompt templates
                        </span>
                        <span className="text-zinc-500 transition duration-150 transform">
                            {openSections.workflows ? "Collapse [-]" : "Expand [+]"}
                        </span>
                    </button>
                    {openSections.workflows && (
                        <div className="px-4 pb-4 border-t border-zinc-900/50 pt-3">
                            <AIWorkflows prompts={prompts} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
