import { DEFAULT_IGNORES } from "../filters/ignoreRules";

export function loadIgnoreRules(): string[] {
    return [...DEFAULT_IGNORES];
}
