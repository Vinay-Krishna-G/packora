export function estimateWords(
    content: string
): number {
    return content
        .trim()
        .split(/\s+/)
        .length;
}
