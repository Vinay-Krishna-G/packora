"use client";

import React from "react";
import { FOOTER_CONFIG } from "../ui/Footer";

type HeroProps = {
    onOpenApp: () => void;
};

export default function Hero({ onOpenApp }: HeroProps) {
    const handleScrollToHow = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("how-it-works");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center text-center px-4 py-24 sm:py-36 select-none">
            {/* Subtle premium accent badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3.5 py-1 text-[11px] font-mono text-muted-foreground shadow-sm mb-8 animate-fadeIn">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>v{FOOTER_CONFIG.version} Released</span>
                <span className="text-border">|</span>
                <span>Local-first processing</span>
            </div>

            {/* Premium Typography Focus */}
            <h1 className="max-w-3xl text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground font-sans animate-fadeIn">
                Transform repositories into structured development context.
            </h1>

            {/* Concise Hero Description (Refined to 14.5px/17px for fluid scanning) */}
            <p className="mt-6 max-w-xl text-[14.5px] sm:text-[17px] text-muted-foreground font-sans leading-relaxed tracking-normal animate-fadeIn" style={{ animationDelay: "100ms" }}>
                Local-first repository processing directly in your browser. <br className="hidden sm:inline" />
                CodeMelt filters repository noise and exports structured development context optimized for AI-assisted workflows.
            </p>

            {/* CTAs Group */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0 animate-fadeIn" style={{ animationDelay: "200ms" }}>
                <button
                    onClick={onOpenApp}
                    className="rounded-lg bg-accent px-6 py-2.5 text-xs font-bold text-accent-foreground hover:bg-accent-hover transition shadow-md cursor-pointer text-center font-mono"
                >
                    Enter Workspace
                </button>
                <a
                    href="#how-it-works"
                    onClick={handleScrollToHow}
                    className="rounded-lg border border-border bg-card px-6 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/40 transition shadow-sm cursor-pointer text-center font-mono"
                >
                    How It Works
                </a>
            </div>
        </section>
    );
}
