"use client";

import React from "react";

export default function WorkflowContrast() {
    return (
        <section className="px-4 py-20 sm:py-28 border-t border-border bg-card/10 select-none">
            <div className="mx-auto max-w-4xl">
                {/* Title Section */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">// Workflow Transformation</h2>
                    <p className="mt-3 text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                        Stop copying files manually. Start structuring repository intelligence.
                    </p>
                </div>

                {/* Grid Comparison */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* The Bad Way (Without CodeMelt) */}
                    <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.015] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex items-center gap-2 border-b border-red-500/10 pb-4 mb-6">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 text-red-500 font-mono text-[10px] font-bold">✕</span>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-red-500/80 font-mono">
                                    Without CodeMelt
                                </h3>
                            </div>

                            <ul className="space-y-4 text-[12.5px] font-mono text-muted-foreground tracking-tight leading-relaxed">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500/60 mt-0.5">•</span>
                                    <span>Manually copying and pasting source files one by one.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500/60 mt-0.5">•</span>
                                    <span>Uploading noisy dependencies, lockfiles, and compiler bundles.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500/60 mt-0.5">•</span>
                                    <span>Exceeding context token bounds due to unoptimized code representations.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500/60 mt-0.5">•</span>
                                    <span>Confusing AI systems with flat structures and missing entrypoints.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-8 pt-4 border-t border-red-500/5 text-[11.5px] font-mono text-red-500/50 leading-relaxed">
                            Result: Fragmented context and high noise ratio.
                        </div>
                    </div>

                    {/* The Good Way (With CodeMelt) */}
                    <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.015] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-4 mb-6">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[10px] font-bold">✓</span>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500/80 font-mono">
                                    With CodeMelt
                                </h3>
                            </div>

                            <ul className="space-y-4 text-[12.5px] font-mono text-muted-foreground tracking-tight leading-relaxed">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-emerald-500/60 mt-0.5">•</span>
                                    <span>Import whole folder locally in 1-click inside your browser thread.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-emerald-500/60 mt-0.5">•</span>
                                    <span>Automatically filter builds, node_modules, and static lockfiles.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-emerald-500/60 mt-0.5">•</span>
                                    <span>Analyze technologies, routes, semantic entrypoints, and flow paths.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-emerald-500/60 mt-0.5">•</span>
                                    <span>Export compressed, highly structured context in XML or MD formats.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-8 pt-4 border-t border-emerald-500/5 text-[11.5px] font-mono text-emerald-500/60 leading-relaxed">
                            Result: Clean, size-optimized repository context; instant understanding.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
