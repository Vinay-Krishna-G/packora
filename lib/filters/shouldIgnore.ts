import { minimatch } from "minimatch";

import { loadIgnoreRules } from "../config/loadIgnoreRules";

export function shouldIgnore(path: string): boolean {
    const rules = loadIgnoreRules();

    return rules.some((rule) =>
        minimatch(path, rule, {
            matchBase: true,
            dot: true,
        })
    );
}