import React from "react";

// ============================================================================
// EDITABLE FOOTER CONFIGURATION OBJECT
// ============================================================================
// Edit this object directly to change any text, links, or version information in the footer!
// ============================================================================
export const FOOTER_CONFIG = {
    productName: "CodeMelt",
    version: "v0.1.0",
    copyright: "© 2026 CodeMelt",
    description: "Structured repository context generation for development workflows.",
    privacyStatement: "All repository processing happens locally in your browser.",
    builtBy: "Built by Vinay Krishna",

    // Developer Contact & Project Repository Links
    links: {
        github: "https://github.com/Vinay-Krishna-G/",
        linkedin: "https://www.linkedin.com/in/vinay-krishna-gudikandula-44b889279/",
        bugReportEmail: "vinaykrishna1515@gmail.com"
    }
};

export default function Footer() {
    const { productName, version, copyright, description, privacyStatement, builtBy, links } = FOOTER_CONFIG;

    return (
        <footer className="mt-20 border-t border-border pt-8 pb-12 font-mono text-[11px] text-muted-foreground select-none transition duration-150">
            <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-4 w-full min-w-0">

                {/* LEFT BLOCK: Identity, Description & Security Heuristics */}
                <div className="flex flex-col gap-2.5 w-full md:max-w-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground tracking-wider uppercase text-xs">
                            {productName}
                        </span>
                        <span className="rounded bg-card border border-border px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground shadow-sm">
                            {version}
                        </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-sans text-xs">
                        {description}
                    </p>
                    <div className="flex items-center gap-1.5 text-muted-foreground/80 mt-1 select-none">
                        <svg className="h-3.5 w-3.5 shrink-0 text-emerald-600/70 dark:text-emerald-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="font-sans text-[10.5px]">
                            {privacyStatement}
                        </span>
                    </div>
                </div>

                {/* RIGHT BLOCK: Links & Author Details */}
                <div className="flex flex-col md:items-end justify-between gap-4 w-full md:w-auto">
                    {/* Navigation handles */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground w-full md:justify-end">
                        <a
                            href={links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition border-b border-transparent hover:border-foreground/40 pb-0.5"
                        >
                            GitHub
                        </a>
                        <a
                            href={links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition border-b border-transparent hover:border-foreground/40 pb-0.5"
                        >
                            LinkedIn
                        </a>
                        <a
                            href={`mailto:${links.bugReportEmail}?subject=CodeMelt Bug Report`}
                            className="hover:text-foreground transition border-b border-transparent hover:border-foreground/40 pb-0.5"
                        >
                            Report Bug
                        </a>
                    </div>

                    {/* builtBy info */}
                    <div className="text-muted-foreground/80 text-[10px] w-full md:text-right">
                        <span>{builtBy}</span>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: Copyright legal parameters */}
            <div className="mt-8 border-t border-border/40 pt-4 flex flex-col md:flex-row md:justify-between gap-2 text-muted-foreground/80 text-[10px] w-full">
                <div>{copyright}</div>
                <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground/60 select-none">
                    Local browser isolation verified
                </div>
            </div>
        </footer>
    );
}
