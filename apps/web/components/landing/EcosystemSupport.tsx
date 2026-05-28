"use client";

import React from "react";

export default function EcosystemSupport() {
    const systems = [
        { name: "Node.js & Next.js", desc: "Supports Next.js pages/app shell components and package dependencies schemas." },
        { name: "Python", desc: "Recognizes Django, Flask, or FastAPI configurations and environment constraints." },
        { name: "Go & Rust", desc: "Identifies core cargo configs, main entry points, and structural routing structures." },
        { name: "Java & Kotlin", desc: "Interprets Maven pom.xml and Gradle build dependencies trees." },
        { name: "PHP", desc: "Understands Composer boundaries, controllers, and database configurations." },
        { name: "Monorepos", desc: "Understands npm workspaces topologies and isolates build noise." }
    ];

    return (
        <section className="px-4 sm:px-8 py-10 border-t border-border/60 transition duration-150 select-none">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 font-mono">// Developer Ecosystem</h3>
            <h2 className="text-base font-extrabold text-foreground tracking-tight mb-6">Supported Environments</h2>
            
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {systems.map((sys) => (
                    <div key={sys.name} className="rounded-xl border border-border bg-card p-4 hover:border-border/80 transition shadow-sm font-mono text-[12.5px]">
                        <div className="font-bold text-foreground mb-1.5">{sys.name}</div>
                        <div className="text-[11.5px] text-muted-foreground leading-relaxed">{sys.desc}</div>
                    </div>
                ))}
            </div>

            {/* Quick CLI Integration snippet block */}
            <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm font-mono text-[12.5px]">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">// Zero-Setup Terminal Access</div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-[11.5px] text-muted-foreground leading-relaxed max-w-lg">
                        Export structured context natively on any local repository in seconds using our ESM-first CLI utility. No global installation required.
                    </div>
                    <div className="rounded-lg bg-background border border-border px-4 py-2 text-foreground/95 select-all text-xs break-all shrink-0">
                        npx codemelt export
                    </div>
                </div>
            </div>
        </section>
    );
}
