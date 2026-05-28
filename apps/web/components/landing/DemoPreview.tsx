"use client";

import React, { useState, useEffect } from "react";

// ============================================================================
// LIGHTWEIGHT DEMO VIDEO OR SIMULATION CONFIGURATION
// ============================================================================
// Set USE_VIDEO to true to use an mp4 file instead of the animated simulation!
// ============================================================================
const DEMO_CONFIG = {
    useVideo: false,
    videoPath: "/demo.mp4"
};

export default function DemoPreview() {
    const { useVideo, videoPath } = DEMO_CONFIG;
    
    // Looping simulation state pipeline: idle -> step1 -> step2 -> step3 -> step4 -> step5 -> finished
    const [simStep, setSimStep] = useState<"idle" | "step1" | "step2" | "step3" | "step4" | "step5" | "finished">("idle");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (useVideo) return;

        let interval: NodeJS.Timeout;

        if (simStep === "step1") {
            // Step 1: Import repository (100% traversal)
            interval = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        setSimStep("step2");
                        return 0;
                    }
                    return p + 20;
                });
            }, 100);
        } else if (simStep === "step2") {
            // Step 2: Repository scanning (Framework matching)
            interval = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        setSimStep("step3");
                        return 0;
                    }
                    return p + 25;
                });
            }, 120);
        } else if (simStep === "step3") {
            // Step 3: Analysis appears (0.4s brief highlight)
            interval = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        setSimStep("step4");
                        return 0;
                    }
                    return p + 50;
                });
            }, 150);
        } else if (simStep === "step4") {
            // Step 4: Export preview (0.3s display)
            interval = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        setSimStep("step5");
                        return 0;
                    }
                    return p + 50;
                });
            }, 150);
        } else if (simStep === "step5") {
            // Step 5: Download context / Paste into AI workspace
            interval = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        setSimStep("finished");
                        return 0;
                    }
                    return p + 25;
                });
            }, 100);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [simStep, useVideo]);

    const handleSimulate = () => {
        setSimStep("step1");
        setProgress(0);
    };

    const handleReset = () => {
        setSimStep("idle");
    };

    return (
        <section className="px-4 py-20 sm:py-28 border-t border-border select-none bg-card/5">
            <div className="mx-auto max-w-4xl">
                {/* Title Section */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">// Workflow Preview</h2>
                    <p className="mt-3 text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                        See CodeMelt's analysis in action
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground font-sans">
                        Observe the loop below showing local traversal, structure scanning, and structured downloads.
                    </p>
                </div>

                {/* Video vs Simulation Display Container */}
                {useVideo ? (
                    <div className="rounded-2xl border border-border bg-card p-2 shadow-xl max-w-2xl mx-auto overflow-hidden">
                        <video
                            src={videoPath}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-auto rounded-lg border border-border/60"
                        />
                    </div>
                ) : (
                    /* Dashboard Simulation Frame */
                    <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden font-mono text-xs max-w-2xl mx-auto transition duration-150">
                        {/* Toolbar Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/85 select-none">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border border-amber-500/30" />
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                                <span className="ml-2 text-[10px] text-muted-foreground font-bold uppercase">codemelt-sandbox // local-scanner</span>
                            </div>
                            <div className="rounded bg-background border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground font-bold">
                                SIMULATION
                            </div>
                        </div>

                        {/* Dashboard Workspace */}
                        <div className="p-6 sm:p-8 min-h-[300px] flex flex-col justify-between bg-background/30">
                            {simStep === "idle" && (
                                <div className="flex flex-col items-center justify-center text-center py-10">
                                    <div className="rounded-lg border border-dashed border-border px-8 py-10 bg-card/25 text-muted-foreground flex flex-col items-center gap-3 shadow-inner">
                                        <svg className="h-8 w-8 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.343a1.5 1.5 0 01-1.062-.44z" />
                                        </svg>
                                        <span className="text-[11px] font-bold">Simulate Importing Repository</span>
                                        <button
                                            onClick={handleSimulate}
                                            className="rounded border border-border bg-card px-4 py-1.5 text-[10px] font-bold text-foreground hover:border-border/80 hover:bg-muted/40 transition cursor-pointer select-none shadow-sm"
                                        >
                                            Start Preview
                                        </button>
                                    </div>
                                </div>
                            )}

                            {simStep !== "idle" && simStep !== "finished" && (
                                <div className="py-8 flex flex-col gap-6 select-none animate-fadeIn">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                            <span className="font-semibold text-foreground">
                                                {simStep === "step1" && "Step 1: Traverse local repository files..."}
                                                {simStep === "step2" && "Step 2: Scanning repository structure..."}
                                                {simStep === "step3" && "Step 3: Compiling technology analysis insights..."}
                                                {simStep === "step4" && "Step 4: Generating structured context blueprint..."}
                                                {simStep === "step5" && "Step 5: Exporting direct local downloads..."}
                                            </span>
                                            <span>{progress}%</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-1 w-full rounded bg-border overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-foreground transition-all duration-100"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 font-mono text-[10.5px] text-muted-foreground/80 pl-2.5 border-l border-border select-none">
                                        <div className={simStep === "step1" ? "text-foreground font-semibold" : ""}>&gt; Reading node directory trees in V8 browser sandboxes...</div>
                                        <div className={simStep === "step2" ? "text-foreground font-semibold" : ""}>&gt; Pruning build logs, packages, and dependency configs...</div>
                                        <div className={simStep === "step3" ? "text-foreground font-semibold" : ""}>&gt; Repository topology and tech stack analyzed successfully.</div>
                                        <div className={simStep === "step4" ? "text-foreground font-semibold" : ""}>&gt; Prompt blueprints mapped; final KB metrics generated.</div>
                                    </div>
                                </div>
                            )}

                            {simStep === "finished" && (
                                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                                    {/* Success statistics */}
                                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 font-mono text-[10px] border-b border-border pb-4 select-none">
                                        <div className="rounded border border-border bg-card/40 p-2.5 shadow-sm">
                                            <div className="text-muted-foreground uppercase text-[8px] font-bold">Total files</div>
                                            <div className="mt-1 font-bold text-foreground">34 files</div>
                                        </div>
                                        <div className="rounded border border-border bg-card/40 p-2.5 shadow-sm">
                                            <div className="text-muted-foreground uppercase text-[8px] font-bold">Included</div>
                                            <div className="mt-1 font-bold text-foreground">8 files</div>
                                        </div>
                                        <div className="rounded border border-border bg-card/40 p-2.5 shadow-sm">
                                            <div className="text-muted-foreground uppercase text-[8px] font-bold">Export size</div>
                                            <div className="mt-1 font-bold text-foreground">48 KB</div>
                                        </div>
                                        <div className="rounded border border-border bg-card/40 p-2.5 shadow-sm">
                                            <div className="text-muted-foreground uppercase text-[8px] font-bold">Savings ratio</div>
                                            <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400 font-extrabold">91.4% Saved</div>
                                        </div>
                                    </div>

                                    {/* Stack Details */}
                                    <div className="space-y-2 select-none">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">// Matched technology stack:</div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-semibold">
                                                Next.js App router
                                            </span>
                                            <span className="rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-semibold">
                                                TailwindCSS v4
                                            </span>
                                            <span className="rounded bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 text-[10px] font-semibold">
                                                SQLite DB
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ingestion Preview block */}
                                    <div className="space-y-1.5">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">// Direct local download generated:</div>
                                        <div className="max-h-[120px] overflow-y-auto rounded-lg border border-border bg-card p-3 text-[10.5px] text-muted-foreground leading-relaxed whitespace-pre font-mono shadow-inner select-all">
                                            {`<!-- CODEMELT REPOSITORY CONTEXT BLUEPRINT -->\n` +
                                             `<repository purpose="SaaS-Dashboard" architecture="frontend-only">\n` +
                                             `  <entrypoint path="app/page.tsx" type="main-view" />\n` +
                                             `  <file path="app/globals.css" importance="high" />\n` +
                                             `  <file path="components/UploadZone.tsx" importance="critical">\n` +
                                             `    <summary>Handles local scanning states, triggers react-dropzone...</summary>\n` +
                                             `  </file>\n` +
                                             `</repository>`}
                                        </div>
                                        <div className="text-[9.5px] text-emerald-600 dark:text-emerald-400 mt-2 font-mono flex items-center gap-1.5 select-none animate-pulse">
                                            <span className="h-1 w-1 rounded-full bg-emerald-500" />
                                            <span>Context download complete. Paste optimized context into AI workspace.</span>
                                        </div>
                                    </div>

                                    {/* Restart Trigger */}
                                    <div className="pt-2 flex justify-end">
                                        <button
                                            onClick={handleReset}
                                            className="rounded border border-border bg-card px-3.5 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/40 transition cursor-pointer select-none shadow-sm"
                                        >
                                            Run Again
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
