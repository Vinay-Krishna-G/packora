import test from "node:test";
import assert from "node:assert";
import { shouldIgnore } from "../src/filters/shouldIgnore.js";

test("Ignore rules validation", async (t) => {
    await t.test("should ignore default blocked directories", () => {
        assert.strictEqual(shouldIgnore("node_modules/lodash/index.js"), true);
        assert.strictEqual(shouldIgnore(".git/config"), true);
        assert.strictEqual(shouldIgnore(".next/static/chunks/main.js"), true);
        assert.strictEqual(shouldIgnore("dist/index.js"), true);
        assert.strictEqual(shouldIgnore("build/main.js"), true);
    });

    await t.test("should allow standard files", () => {
        assert.strictEqual(shouldIgnore("src/index.ts"), false);
        assert.strictEqual(shouldIgnore("components/Button.tsx"), false);
        assert.strictEqual(shouldIgnore("app/layout.tsx"), false);
        assert.strictEqual(shouldIgnore("package.json"), false);
    });

    await t.test("should support custom rules", () => {
        const customRules = ["*.tmp", "custom-folder/**"];
        assert.strictEqual(shouldIgnore("file.tmp", customRules), true);
        assert.strictEqual(shouldIgnore("custom-folder/sub/file.js", customRules), true);
        assert.strictEqual(shouldIgnore("src/file.js", customRules), false);
    });
});
