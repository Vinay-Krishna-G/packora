import { ScannedFile } from "codemelt-shared";

export function scoreFile(
    file: ScannedFile
): number {
    const path = file.path.toLowerCase();

    let score = 0;

    if (path.includes("/src/")) score += 30;

    if (path.includes("/features/")) score += 25;

    if (path.includes("controller"))
        score += 20;

    if (path.includes("service"))
        score += 20;

    if (path.includes("routes"))
        score += 15;

    if (path.includes("model"))
        score += 10;

    if (path.includes("middleware"))
        score += 10;

    if (path.includes("config"))
        score -= 10;

    if (path.includes("package-lock"))
        score -= 50;

    if (path.includes("tsconfig"))
        score -= 20;

    return score;
}
