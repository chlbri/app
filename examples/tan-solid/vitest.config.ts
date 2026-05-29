import { aliasTs, createAlias } from "@bemedev/dev-utils/vitest-alias";
import { playwright } from "@vitest/browser-playwright";
import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";
import tsconfig from "./tsconfig.json";

export default defineConfig({
  plugins: [],
  resolve: {
    conditions: ["development", "browser"],
  },
  test: {
    globals: true,
    coverage: {
      reportsDirectory: ".coverage",
      provider: "istanbul",
      enabled: true,
    },
    passWithNoTests: true,

    projects: [
      {
        plugins: [aliasTs(tsconfig as any)],
        extends: true,

        test: {
          include: ["**/*.{spec,test}.ts"],
          environment: "node",
          name: "node-tests",
        },
      },
      {
        plugins: [solid() as any],
        extends: true,

        resolve: {
          conditions: ["development", "browser"],
        },

        test: {
          name: "integration",
          include: ["**/*.{spec,test}.tsx"],
          alias: createAlias(tsconfig as any),
          browser: {
            provider: playwright({}),
            enabled: true,
            headless: true,
            instances: [
              {
                browser: "chromium",
                bail: 15,
              },
            ],
          },
        },
      },
      {
        plugins: [solid() as any],
        extends: true,
        test: {
          name: "e2e",
          include: ["**/*.e2e.{tsx,ts}"],
          alias: createAlias(tsconfig as any),
          browser: {
            provider: playwright(),
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }, { browser: "webkit" }],
          },
        },
      },
    ],
  },
});
