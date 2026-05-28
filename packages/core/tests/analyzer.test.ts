import test from "node:test";
import assert from "node:assert";
import { analyzeRepository } from "../src/analyzer/repositoryAnalyzer.js";
import { ScannedFile } from "@codemelt/shared";

test("Repository Analyzer validation", async (t) => {
    await t.test("should identify Next.js and React signatures", () => {
        const dummyFiles: ScannedFile[] = [
            {
                name: "package.json",
                path: "package.json",
                extension: "json",
                size: 200,
                content: JSON.stringify({
                    dependencies: {
                        "next": "^14.0.0",
                        "react": "^18.0.0"
                    }
                }),
                included: true,
                type: "text",
                importance: "critical"
            },
            {
                name: "next.config.js",
                path: "next.config.js",
                extension: "js",
                size: 100,
                content: "module.exports = {};",
                included: true,
                type: "text",
                importance: "critical"
            }
        ];

        const analysis = analyzeRepository(dummyFiles);
        
        assert.strictEqual(analysis.architecture, "frontend-only");
        
        const hasNext = analysis.technologies.some(tech => tech.name === "Next.js");
        const hasReact = analysis.technologies.some(tech => tech.name === "React");
        
        assert.strictEqual(hasNext, true);
        assert.strictEqual(hasReact, true);
    });

    await t.test("should grade readiness quality details", () => {
        const dummyFiles: ScannedFile[] = [
            {
                name: "README.md",
                path: "README.md",
                extension: "md",
                size: 200,
                content: "# Project Overview",
                included: true,
                type: "text",
                importance: "critical"
            },
            {
                name: "tsconfig.json",
                path: "tsconfig.json",
                extension: "json",
                size: 150,
                content: "{}",
                included: true,
                type: "text",
                importance: "critical"
            }
        ];

        const analysis = analyzeRepository(dummyFiles);
        assert.ok(analysis.readinessScore.score >= 35);
    });
});
