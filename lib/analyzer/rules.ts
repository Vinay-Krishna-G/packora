import { HeuristicRule } from "./types";

export const TECHNOLOGY_RULES: HeuristicRule[] = [
  // --- 1. FRAMEWORKS & LIBRARIES ---
  {
    name: "Next.js",
    category: "framework",
    dependencies: ["next"],
    filePatterns: ["next.config.js", "next.config.mjs", "next.config.ts"]
  },
  {
    name: "React",
    category: "framework",
    dependencies: ["react", "react-dom"]
  },
  {
    name: "Vue.js",
    category: "framework",
    dependencies: ["vue"],
    filePatterns: ["nuxt.config.js", "nuxt.config.ts"]
  },
  {
    name: "Angular",
    category: "framework",
    dependencies: ["@angular/core", "@angular/cli"],
    filePatterns: ["angular.json"]
  },
  {
    name: "Svelte / SvelteKit",
    category: "framework",
    dependencies: ["svelte", "@sveltejs/kit"],
    filePatterns: ["svelte.config.js"]
  },
  {
    name: "Express.js",
    category: "framework",
    dependencies: ["express"]
  },
  {
    name: "NestJS",
    category: "framework",
    dependencies: ["@nestjs/core"],
    filePatterns: ["nest-cli.json"]
  },

  // --- 2. DATABASES & ORMS ---
  {
    name: "Prisma (ORM)",
    category: "database",
    dependencies: ["@prisma/client", "prisma"],
    filePatterns: ["schema.prisma"]
  },
  {
    name: "Drizzle (ORM)",
    category: "database",
    dependencies: ["drizzle-orm"],
    filePatterns: ["drizzle.config.ts", "drizzle.config.js"]
  },
  {
    name: "Mongoose / MongoDB",
    category: "database",
    dependencies: ["mongoose", "mongodb"]
  },
  {
    name: "PostgreSQL",
    category: "database",
    dependencies: ["pg", "postgres"]
  },
  {
    name: "MySQL / MariaDB",
    category: "database",
    dependencies: ["mysql2", "mysql"]
  },
  {
    name: "Redis",
    category: "database",
    dependencies: ["redis", "ioredis"]
  },

  // --- 3. STYLING SYSTEMS ---
  {
    name: "Tailwind CSS",
    category: "styling",
    dependencies: ["tailwindcss", "postcss"],
    filePatterns: ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.cjs"]
  },
  {
    name: "Styled Components",
    category: "styling",
    dependencies: ["styled-components"]
  },
  {
    name: "Emotion",
    category: "styling",
    dependencies: ["@emotion/react", "@emotion/styled"]
  },
  {
    name: "Sass / SCSS",
    category: "styling",
    dependencies: ["sass", "node-sass"]
  },

  // --- 4. RUNTIMES & BUILD TOOLS ---
  {
    name: "Node.js",
    category: "runtime",
    filePatterns: ["package.json"] // Virtually every JS repo uses Node runtime tooling
  },
  {
    name: "Bun",
    category: "runtime",
    filePatterns: ["bun.lockb", "bunfig.toml"]
  },
  {
    name: "Deno",
    category: "runtime",
    filePatterns: ["deno.json", "deno.jsonc"]
  },

  // --- 5. STATE MANAGEMENT ---
  {
    name: "Redux",
    category: "state-management",
    dependencies: ["redux", "@reduxjs/toolkit", "react-redux"]
  },
  {
    name: "Zustand",
    category: "state-management",
    dependencies: ["zustand"]
  },
  {
    name: "Jotai",
    category: "state-management",
    dependencies: ["jotai"]
  },
  {
    name: "Recoil",
    category: "state-management",
    dependencies: ["recoil"]
  },
  {
    name: "Pinia (Vue)",
    category: "state-management",
    dependencies: ["pinia"]
  },

  // --- 6. REALTIME & COMMUNICATION ---
  {
    name: "Socket.io",
    category: "realtime",
    dependencies: ["socket.io", "socket.io-client"]
  },
  {
    name: "Pusher",
    category: "realtime",
    dependencies: ["pusher", "pusher-js"]
  },
  {
    name: "ws (WebSocket Client)",
    category: "realtime",
    dependencies: ["ws"]
  }
];
