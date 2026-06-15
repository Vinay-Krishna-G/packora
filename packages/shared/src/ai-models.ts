export const AI_MODELS = {
  claudeSonnet: {
    name: "Claude Sonnet",
    contextWindow: 200000,
  },
  gpt5: {
    name: "GPT-5",
    contextWindow: 128000,
  },
  geminiPro: {
    name: "Gemini Pro",
    contextWindow: 1000000,
  },
  cursor: {
    name: "Cursor",
    contextWindow: 50000,
  },
  copilot: {
    name: "GitHub Copilot",
    contextWindow: 25000,
  },
} as const;
