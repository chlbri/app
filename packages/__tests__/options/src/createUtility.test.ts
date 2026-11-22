import { createContract } from "@bemedev/app-contract";
import { createOptions } from "@bemedev/app-options";

import {
  configureOptions,
  createUtility,
  remove,
  same,
  type UtilityPlugin,
} from "@bemedev/app-options/plugins";

describe("TESTS", () => {
  const config = {
    initial: "idle",
    states: { idle: { on: { START: "/done" } }, done: {} },
  } as const;

  const syncContract = createContract(config, { sync: true });
  const asyncContract = createContract(config, {});

  afterEach(() => configureOptions());

  describe("#01 => createUtility / inner helpers", () => {
    test("#01 => exposes the built-in option helpers", () => {
      const utilities = createUtility({ contract: syncContract }).build();

      expect(Object.keys(utilities)).toContain("assign");
      expect(Object.keys(utilities)).toContain("filter");
      expect(Object.keys(utilities)).toContain("guardBatch");
      expect(Object.keys(utilities)).not.toContain("resolve");
    });

    test("#02 => resolves the built-in helpers for the mode", () => {
      const sync = createUtility({ contract: syncContract }).resolve("sync");
      const async = createUtility({ contract: asyncContract }).resolve("async");

      expect(typeof sync.assign).toBe("function");
      expect(typeof sync.filter).toBe("function");
      expect(typeof async.assign).toBe("function");
      expect(typeof async.filter).toBe("function");
    });

    test("#03 => requires a contract", () => {
      expect(() => createUtility({} as never)).toThrow(
        "createUtility requires a context with a contract",
      );
    });
  });

  describe("#02 => createUtility / contract context", () => {
    test("#01 => forwards the contract, config and event list", () => {
      const contextPlugin = {
        name: "context",
        create: ({ contract, config, eventsList, legacy }) => ({
          context: same(() => ({
            contract,
            config,
            eventsList: [...eventsList],
            legacy,
          })),
        }),
      } satisfies UtilityPlugin;

      const legacy = { _legacy: {} };
      const built = createUtility(
        { contract: syncContract, legacy },
        contextPlugin,
      ).build();
      const sync = built.resolve("sync");

      expect(sync.context()).toStrictEqual({
        contract: syncContract,
        config,
        eventsList: ["START"],
        legacy,
      });
    });

    test("#02 => exposes the built-in helpers to plugins", () => {
      const plugin = {
        name: "builtins",
        create: ({ utilities }: any) => ({
          builtins: same(() =>
            Object.entries(utilities)
              .filter(
                ([, descriptor]) =>
                  typeof (descriptor as any).sync === "function",
              )
              .map(([name]) => name)
              .sort(),
          ),
        }),
      } satisfies UtilityPlugin;

      const sync = createUtility({ contract: syncContract }, plugin).resolve(
        "sync",
      ) as any;

      expect(sync.builtins()).toContain("assign");
      expect(sync.builtins()).toContain("filter");
    });
  });

  describe("#03 => createUtility / plugins", () => {
    const retryPlugin = {
      name: "retry",
      create: () => ({ retry: same((value: number) => value * 2) }),
    } satisfies UtilityPlugin;

    const logPlugin = {
      name: "log",
      requires: ["retry"],
      create: ({ utilities }: any) => ({
        log: same(() => utilities.retry.sync(3)),
      }),
    } satisfies UtilityPlugin;

    test("#01 => applies a per-call plugin", () => {
      const sync = createUtility(
        { contract: syncContract },
        retryPlugin,
      ).resolve("sync") as any;

      expect(sync.retry(2)).toBe(4);
    });

    test("#02 => gives plugins access to already-built utilities", () => {
      const sync = createUtility(
        { contract: syncContract },
        logPlugin,
        retryPlugin,
      ).resolve("sync") as any;

      expect(sync.log()).toBe(6);
    });

    test("#03 => applies the globally registered plugins", () => {
      configureOptions(retryPlugin);

      const sync = createUtility({ contract: syncContract }).resolve(
        "sync",
      ) as any;

      expect(sync.retry(5)).toBe(10);
    });

    test("#04 => lets a per-call plugin override a global one", () => {
      configureOptions(retryPlugin);

      const tripler = {
        name: "retry",
        create: () => ({ retry: same((value: number) => value * 3) }),
      } satisfies UtilityPlugin;

      const sync = createUtility({ contract: syncContract }, tripler).resolve(
        "sync",
      ) as any;

      expect(sync.retry(2)).toBe(6);
    });

    test("#05 => throws on a duplicate built-in name", () => {
      const builder = createUtility({ contract: syncContract });

      expect(() =>
        builder.add(
          "assign" as never,
          same(() => undefined),
        ),
      ).toThrow('Utility "assign" already exists');
    });

    test("#06 => throws on a missing dependency", () => {
      expect(() =>
        createUtility({ contract: syncContract }, logPlugin),
      ).toThrow('Plugin "log" requires "retry", which is not provided.');
    });

    test("#07 => rejects the reserved name", () => {
      const builder = createUtility({ contract: syncContract });

      expect(() =>
        builder.add(
          "resolve" as never,
          same(() => undefined),
        ),
      ).toThrow('Utility "resolve" is reserved');
    });

    test("#08 => invalidates the cache when a plugin is removed", () => {
      configureOptions(retryPlugin);

      const withRetry = createOptions(syncContract)(((helpers: any) => ({
        hasRetry: "retry" in helpers,
      })) as any);

      expect(remove("retry")).toBe(true);
      expect(remove("retry")).toBe(false);

      const withoutRetry = createOptions(syncContract)(((helpers: any) => ({
        hasRetry: "retry" in helpers,
      })) as any);

      expect(withRetry).toStrictEqual({ hasRetry: true });
      expect(withoutRetry).toStrictEqual({ hasRetry: false });
    });
  });

  describe("#04 => createUtility / builder", () => {
    test("#01 => snapshots the map on build", () => {
      const builder = createUtility({ contract: syncContract });
      const built = builder.build();

      builder.add(
        "other" as never,
        same(() => undefined),
      );

      expect(built).not.toHaveProperty("other");
      expect(built.resolve("sync")).not.toHaveProperty("other");
    });

    test("#02 => projects each resolved mode", async () => {
      const builder = createUtility({ contract: syncContract }).add("delay", {
        sync: (value: number) => value,
        async: async (value: number) => value,
      });

      const sync = builder.resolve("sync") as any;
      const async = builder.resolve("async") as any;

      expect(sync.delay(1)).toBe(1);
      await expect(async.delay(1)).resolves.toBe(1);
    });

    test("#03 => copies the seed and skips a plugin applied twice", () => {
      const plugin = {
        name: "once",
        create: () => ({ once: same(() => 1) }),
      } satisfies UtilityPlugin;

      const builder = createUtility({ contract: syncContract }, plugin);
      builder.use(plugin);

      expect((builder.resolve("sync") as any).once()).toBe(1);
    });
  });
});
