"use client";

import React from "react";
import Hero from "./Hero";
import WorkflowContrast from "./WorkflowContrast";
import DemoPreview from "./DemoPreview";
import HowItWorks from "./HowItWorks";
import EcosystemSupport from "./EcosystemSupport";
import LocalFirstPrivacy from "./LocalFirstPrivacy";
import ThemeToggle from "../ui/ThemeToggle";
import Footer from "../ui/Footer";

type LandingPageProps = {
    onOpenApp: () => void;
};

export default function LandingPage({ onOpenApp }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition duration-150">
            {/* Header Navigation Bar */}
            <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md select-none">
                <div className="mx-auto max-w-4xl px-4 sm:px-8 py-3.5 flex items-center justify-between w-full">
                    {/* Brand Identifier */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenApp}>
                        <span className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
                            CodeMelt //
                        </span>
                    </div>

                    {/* Shortcuts & Theme Widget */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <button
                            onClick={onOpenApp}
                            className="rounded-lg bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground hover:bg-accent-hover transition shadow-sm cursor-pointer select-none font-mono"
                        >
                            Enter Workspace
                        </button>
                    </div>
                </div>
            </header>

            {/* Content Sections Stacking */}
            <main className="flex-1 w-full max-w-4xl mx-auto min-w-0">
                <Hero onOpenApp={onOpenApp} />
                <WorkflowContrast />
                <DemoPreview />
                <HowItWorks />
                <EcosystemSupport />
                <LocalFirstPrivacy />
                
                {/* Standard CodeMelt Footer */}
                <div className="px-4 sm:px-8">
                    <Footer />
                </div>
            </main>
        </div>
    );
}
