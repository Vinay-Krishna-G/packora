import { minimatch } from "minimatch";
import { DEFAULT_IGNORES, normalizePath } from "codemelt-shared";

export function shouldIgnore(path: string, customRules?: string[]): boolean {
    const rules = customRules || DEFAULT_IGNORES;
    const normalized = normalizePath(path);

    return rules.some((rule: string) =>
        minimatch(normalized, rule, {
            matchBase: true,
            dot: true,
        })
    );
}
