import { aliasTs } from "@bemedev/dev-utils/vitest-alias";
import { exclude } from "@bemedev/dev-utils/vitest-exclude";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    aliasTs(tsconfig as any),
    exclude({
      ignoreCoverageFiles: [
        "**/index.ts",
        "**/types.ts",
        "**/*.example.ts",
        "**/*.types.ts",
        "**/*.typegen.ts",
        "**/*.fixtures.ts",
        "**/fixtures/**",
        "**/*.test-d.ts",
        "**/*.machine.ts",
        "**/experimental.ts",
        "**/src/utils/nothing.ts",
        "**/fixtures.ts",
        "**/libs/bemedev/**/*",
        "**/fixture.ts",
        "**/*.fixture.ts",
        "**/test.ts",
        "**/src/cli/cli.ts",
        "**/src/cli/core/helpers/**",
        "**/__tests__/**",
      ],
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
  test: {
    bail: 100,
    maxConcurrency: 10,
    allowOnly: true,
    passWithNoTests: true,
    slowTestThreshold: 3000,
    environment: "node",
    env: {
      NODE_ENV: "test",
    },
    globals: true,
    logHeapUsage: false,
    testTimeout: 30000,
    typecheck: {
      enabled: true,
      ignoreSourceErrors: false,
    },
    coverage: {
      enabled: true,
      reportsDirectory: ".coverage",
      provider: "v8",
    },
    projects: [
      {
        plugins: [],
      },
    ],
  },
});
