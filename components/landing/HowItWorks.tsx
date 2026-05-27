"use client";

import React from "react";

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="px-4 py-20 sm:py-28 border-t border-border bg-card/10 select-none scroll-mt-20">
            <div className="mx-auto max-w-4xl">
                {/* Title Section */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">// Developer Workflow</h2>
                    <p className="mt-3 text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                        Three steps from noise to structured context
                    </p>
                </div>

                {/* Steps Columns */}
                <div className="grid gap-8 sm:grid-cols-3">
                    {/* Step 1 */}
                    <div className="flex flex-col gap-3.5">
                        <div className="font-mono text-xs font-semibold text-muted-foreground border-b border-border pb-2.5">
                            01 // Local import
                        </div>
                        <h3 className="text-sm font-bold text-foreground font-sans">
                            Select Repository Folder
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                            Drag and drop or browse folders locally. Code is indexed instantly using browser filesystem readers. No servers, no uploads.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col gap-3.5">
                        <div className="font-mono text-xs font-semibold text-muted-foreground border-b border-border pb-2.5">
                            02 // Automatic filter
                        </div>
                        <h3 className="text-sm font-bold text-foreground font-sans">
                            Optimize & Exclude
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                            Packora identifies and ignores dependency files, lockfiles, build configurations, and logs. It assigns semantic importance priorities to all remaining files.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col gap-3.5">
                        <div className="font-mono text-xs font-semibold text-muted-foreground border-b border-border pb-2.5">
                            03 // AI Ingestion
                        </div>
                        <h3 className="text-sm font-bold text-foreground font-sans">
                            Export Context
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                            Copy or download the highly structured XML or Markdown blueprint. Ingest it directly into Claude, ChatGPT, or any other AI tool for instant onboarding.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
