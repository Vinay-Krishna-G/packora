"use client";

import React from "react";

export default function LocalFirstPrivacy() {
    return (
        <section className="px-4 py-20 sm:py-28 border-t border-border select-none bg-card/5">
            <div className="mx-auto max-w-4xl">
                <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition duration-150">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                            <svg className="h-4 w-4 shrink-0 text-emerald-600/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Local browser isolation verified</span>
                        </div>
                        <h3 className="text-base font-extrabold text-foreground tracking-tight font-sans">
                            Your source code never leaves your local machine
                        </h3>
                        <p className="mt-2.5 text-[13px] text-muted-foreground leading-relaxed font-sans">
                            Packora is engineered entirely with client-side JavaScript. All directory file system traversal, technology and architecture analysis, and metadata summarization are compiled in your browser's local thread. We do not use remote servers, and we collect zero telemetry.
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4 shrink-0 flex flex-col gap-1.5 text-[11.5px] font-mono text-muted-foreground shadow-sm">
                        <div>Host environment: <span className="text-foreground font-semibold">Local Browser Thread</span></div>
                        <div>Remote connections: <span className="text-foreground font-semibold">Zero Networks</span></div>
                        <div>Persistence model: <span className="text-foreground font-semibold">Local Memory Only</span></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
