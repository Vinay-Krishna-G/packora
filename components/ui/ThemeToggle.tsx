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
                // Sun Icon (render Sun in dark mode so clicking switches to light)
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 5.657a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ) : (
                // Moon Icon
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}
