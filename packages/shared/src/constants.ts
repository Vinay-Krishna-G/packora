export const MAX_FILES = 3000;
export const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
export const MAX_CONTENT_CHARS = 100 * 1024; // 100KB
export const MAX_EXPORT_FILES = 3000;
export const MAX_EXPORT_BYTES = 50 * 1024 * 1024;
export const MAX_DIRECTORY_DEPTH = 10;

export const DEFAULT_IGNORES = [
    // Direct directory and recursive child ignores for early pruning
    "node_modules",
    "**/node_modules",
    "**/node_modules/**",
    ".git",
    "**/.git",
    "**/.git/**",
    ".next",
    "**/.next",
    "**/.next/**",
    "dist",
    "**/dist",
    "**/dist/**",
    "build",
    "**/build",
    "**/build/**",
    "coverage",
    "**/coverage",
    "**/coverage/**",

    ".env",
    ".env.*",

    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.gif",
    "*.webp",
    "*.ico",

    "*.mp4",
    "*.mp3",

    "*.zip",
    "*.tar",
    "*.gz",
    "*.tar.gz",
    "*.tgz",

    "codemelt-context.md",
    "codemelt-context.xml",

    "*.log",

    ".DS_Store",
    "Thumbs.db",

    "**/public/**",
    "**/assets/**",
    "**/*.svg",

    // Lockfiles & build info (AI-irrelevant noise excluded by default)
    "**/package-lock.json",
    "**/yarn.lock",
    "**/pnpm-lock.yaml",
    "**/*.tsbuildinfo",
];
