import { ProjectAnalysis, DetectionResult, ArchitectureType } from "@/lib/analyzer/types";

type RepositoryInsightsProps = {
    analysis: ProjectAnalysis;
};

export default function RepositoryInsights({
    analysis,
}: RepositoryInsightsProps) {
    const { technologies, architecture, summary, fileCount, totalSize } = analysis;

    if (fileCount === 0) return null;

    const archLabels: Record<ArchitectureType, string> = {
        "monorepo": "Monorepo Workspace",
        "fullstack-monolith": "Fullstack Monolith",
        "frontend-only": "Frontend Application",
        "backend-api": "Backend API Service",
        "realtime-system": "Realtime Application",
        "unknown": "Software Repository"
    };

    const archColors: Record<ArchitectureType, string> = {
        "monorepo": "bg-cyan-950/60 text-cyan-400 border-cyan-800/40 shadow-[0_0_15px_rgba(34,211,238,0.05)]",
        "fullstack-monolith": "bg-emerald-950/60 text-emerald-400 border-emerald-800/40 shadow-[0_0_15px_rgba(52,211,153,0.05)]",
        "frontend-only": "bg-blue-950/60 text-blue-400 border-blue-800/40 shadow-[0_0_15px_rgba(96,165,250,0.05)]",
        "backend-api": "bg-purple-950/60 text-purple-400 border-purple-800/40 shadow-[0_0_15px_rgba(192,132,252,0.05)]",
        "realtime-system": "bg-rose-950/60 text-rose-400 border-rose-800/40 shadow-[0_0_15px_rgba(251,113,133,0.05)]",
        "unknown": "bg-zinc-900 text-zinc-400 border-zinc-800"
    };

    const categoryLabels: Record<string, string> = {
        "framework": "Frameworks",
        "database": "Databases & ORMs",
        "styling": "Styling Layers",
        "runtime": "Runtimes & Builds",
        "state-management": "State Managers",
        "realtime": "Realtime Systems"
    };

    return (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 backdrop-blur-xl">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        Repository Intelligence
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                        Heuristic architectural fingerprinting and tech stack analytics.
                    </p>
                </div>
                <div className={`rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-wider shrink-0 transition ${archColors[architecture]}`}>
                    {archLabels[architecture]}
                </div>
            </div>

            {/* Natural Language Summary */}
            <div className="mt-5 rounded-xl border border-zinc-900 bg-zinc-900/30 p-4 text-sm text-zinc-300 leading-relaxed font-mono">
                <span className="text-emerald-400 font-bold mr-1">&gt;</span> {summary}
            </div>

            {/* Detected Technologies Grid */}
            <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                    Detected Stack & Explainability
                </h3>

                {technologies.length === 0 ? (
                    <div className="rounded-xl border border-zinc-900 border-dashed py-8 text-center text-sm text-zinc-500">
                        No distinct tool or framework signatures detected.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {technologies.map((tech) => (
                            <div
                                key={tech.name}
                                className="group relative rounded-xl border border-zinc-900 bg-zinc-900/10 p-4 hover:border-zinc-800 hover:bg-zinc-900/35 transition duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-zinc-200 text-sm flex items-center gap-1.5">
                                            {tech.name}
                                            {tech.version && (
                                                <span className="text-[10px] text-zinc-500 font-normal">
                                                    v{tech.version}
                                                </span>
                                            )}
                                        </h4>
                                        <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase font-mono">
                                            {categoryLabels[tech.category] || tech.category}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-zinc-400 font-mono">
                                        {(tech.confidence * 100).toFixed(0)}% Match
                                    </span>
                                </div>

                                {/* Confidence Bar */}
                                <div className="mt-3 h-1 w-full rounded-full bg-zinc-900 overflow-hidden">
                                    <div
                                        className="h-full bg-zinc-700 group-hover:bg-emerald-500 transition-all duration-300 rounded-full"
                                        style={{ width: `${tech.confidence * 100}%` }}
                                    />
                                </div>

                                {/* Explainability section */}
                                <div className="mt-3 space-y-1.5 border-t border-zinc-900/60 pt-2.5">
                                    {tech.explainability.matchedDependencies.length > 0 && (
                                        <div className="flex items-start gap-1.5 text-[10px] text-zinc-400 font-mono">
                                            <span className="text-zinc-600 font-bold select-none">dep:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {tech.explainability.matchedDependencies.map(dep => (
                                                    <span key={dep} className="rounded bg-zinc-900 border border-zinc-800 px-1 py-0.5 text-zinc-300">
                                                        {dep}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {tech.explainability.matchedFiles.length > 0 && (
                                        <div className="flex items-start gap-1.5 text-[10px] text-zinc-400 font-mono">
                                            <span className="text-zinc-600 font-bold select-none">file:</span>
                                            <div className="flex flex-wrap gap-1 min-w-0">
                                                {tech.explainability.matchedFiles.map(file => (
                                                    <span key={file} className="rounded bg-zinc-900 border border-zinc-800 px-1 py-0.5 text-zinc-300 truncate max-w-[200px]" title={file}>
                                                        {file.split("/").pop()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Metrics */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-zinc-900 pt-5 text-xs text-zinc-500 font-mono">
                <div>
                    Repository size: <span className="text-zinc-300 font-semibold">{(totalSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="text-right">
                    Total files: <span className="text-zinc-300 font-semibold">{fileCount} scanned</span>
                </div>
            </div>
        </div>
    );
}
