"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Prevent layout shift/flash by rendering a transparent placeholder button
        return (
            <div className="h-7 w-7 rounded-md border border-border/40 bg-card/30 shrink-0" />
        );
    }

    const isDark = theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            type="button"
            aria-label="Toggle theme"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/40 transition duration-150 shrink-0 cursor-pointer shadow-sm select-none"
        >
            {isDark ? (
                // Refined outward Sun Icon (open geometry, balanced outward rays)
                <svg className="h-3.5 w-3.5 animate-fadeIn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.72-12.72l-1.41 1.41" />
                </svg>
            ) : (
                // Moon Icon
                <svg className="h-3.5 w-3.5 animate-fadeIn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}
