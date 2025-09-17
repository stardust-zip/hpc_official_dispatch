import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Use Vitest globals (describe, it, expect) without importing
    environment: "node",
    setupFiles: ["./src/test/setup.ts"], // This file gonna run before all tests
    exclude: ["node_modules/**", "dist/**", ".direnv/**"],
  },
});
