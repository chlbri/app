import { createContract, type SyncAction2 } from "@bemedev/app-contract";
import {
  createUtility,
  same,
  type UtilityBuilderContext,
  type UtilityPlugin,
} from "@bemedev/app-options";

const config = {
  initial: "idle",
  states: { idle: { on: { START: "/done" } }, done: {} },
} as const;

const syncContract = createContract(config, { sync: true });
const asyncContract = createContract(config, {});

const builder = createUtility({ contract: syncContract });
const sync = builder.resolve("sync");
const async = createUtility({ contract: asyncContract }).resolve("async");

expectTypeOf(sync.assign).toBeFunction();
expectTypeOf(sync.filter).toBeFunction();
expectTypeOf(sync.guardBatch).toBeFunction();
expectTypeOf(async.assign).toBeFunction();
expectTypeOf(async.filter).toBeFunction();

expectTypeOf(sync.assign("context.count", ({ context }) => context)).toExtend<
  SyncAction2<typeof syncContract>
>();

expectTypeOf<UtilityBuilderContext<typeof syncContract>>().toExtend<{
  contract: typeof syncContract;
}>();

const doublePlugin = {
  name: "double",
  create: () => ({ double: same((value: number) => value * 2) }),
} satisfies UtilityPlugin;

const withPlugin = createUtility(
  { contract: syncContract },
  doublePlugin,
).resolve("sync");

expectTypeOf(withPlugin.double).toEqualTypeOf<(value: number) => number>();

// @ts-expect-error - the context is required
createUtility();

// @ts-expect-error - the contract is required in the context
createUtility({});

// @ts-expect-error - an unknown helper must not compile
createUtility({ contract: syncContract }).resolve("sync").unknownHelper;

test("#01 => createUtility is typed from the contract", () => {
  expect(true).toBe(true);
});
