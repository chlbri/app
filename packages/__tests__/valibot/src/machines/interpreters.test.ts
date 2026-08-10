import { validate } from "@bemedev/app-valibot";
import syncInterp_1 from "#machines/sync/interpreters/activities/pause.machine";
import syncInterp_2 from "#machines/sync/interpreters/activities/perform.bis.machine";
import syncInterp_3 from "#machines/sync/interpreters/activities/perform.machine";
import syncInterp_4 from "#machines/sync/interpreters/children.1.machine";
import syncInterp_5 from "#machines/sync/interpreters/children.2.machine";
import syncInterp_6 from "#machines/sync/interpreters/children.3.machine";
import syncInterp_7 from "#machines/sync/interpreters/children.4.machine";
import syncInterp_8 from "#machines/sync/interpreters/children.5.machine";
import syncInterp_9 from "#machines/sync/interpreters/coverage/addOptions-return.1.machine";
import syncInterp_10 from "#machines/sync/interpreters/coverage/addOptions-return.2.machine";
import syncInterp_11 from "#machines/sync/interpreters/coverage/addOptions-return.3.machine";
import syncInterp_12 from "#machines/sync/interpreters/coverage/addOptions-return.4.machine";
import syncInterp_13 from "#machines/sync/interpreters/coverage/addOptions-return.5.machine";
import syncInterp_14 from "#machines/sync/interpreters/coverage/index.machine";
import { machine1 as syncInterp_15 } from "#machines/sync/interpreters/data/machine1.fsm";
import { config2 as syncInterp_16 } from "#machines/sync/interpreters/data/machine2.fsm";
import { machine23 as syncInterp_17 } from "#machines/sync/interpreters/data/machine23.fsm";
import syncInterp_18 from "#machines/sync/interpreters/filter-erase.1.machine";
import syncInterp_19 from "#machines/sync/interpreters/filter-erase.2.machine";
import syncInterp_20 from "#machines/sync/interpreters/filter-erase.3.machine";
import syncInterp_21 from "#machines/sync/interpreters/filter-erase.4.machine";
import syncInterp_22 from "#machines/sync/interpreters/filter-erase.5.machine";
import syncInterp_23 from "#machines/sync/interpreters/filter-erase.6.machine";
import syncInterp_24 from "#machines/sync/interpreters/legacy-options.1.machine";
import syncInterp_25 from "#machines/sync/interpreters/legacy-options.10.machine";
import syncInterp_26 from "#machines/sync/interpreters/legacy-options.11.machine";
import syncInterp_27 from "#machines/sync/interpreters/legacy-options.12.machine";
import syncInterp_28 from "#machines/sync/interpreters/legacy-options.13.machine";
import syncInterp_29 from "#machines/sync/interpreters/legacy-options.14.machine";
import syncInterp_30 from "#machines/sync/interpreters/legacy-options.2.machine";
import syncInterp_31 from "#machines/sync/interpreters/legacy-options.3.machine";
import syncInterp_32 from "#machines/sync/interpreters/legacy-options.4.machine";
import syncInterp_33 from "#machines/sync/interpreters/legacy-options.5.machine";
import syncInterp_34 from "#machines/sync/interpreters/legacy-options.6.machine";
import syncInterp_35 from "#machines/sync/interpreters/legacy-options.7.machine";
import syncInterp_36 from "#machines/sync/interpreters/legacy-options.8.machine";
import syncInterp_37 from "#machines/sync/interpreters/legacy-options.9.machine";
import syncInterp_38 from "#machines/sync/interpreters/selftransitions/always.3.machine";
import syncInterp_39 from "#machines/sync/interpreters/selftransitions/index.2.machine";
import syncInterp_40 from "#machines/sync/interpreters/tags/tags.machine";
import asyncInterp_1 from "#machines/async/interpreters/activities/pause.machine";
import asyncInterp_2 from "#machines/async/interpreters/activities/perform.bis.machine";
import asyncInterp_3 from "#machines/async/interpreters/activities/perform.machine";
import asyncInterp_4 from "#machines/async/interpreters/children.1.machine";
import asyncInterp_5 from "#machines/async/interpreters/children.2.machine";
import asyncInterp_6 from "#machines/async/interpreters/children.3.machine";
import asyncInterp_7 from "#machines/async/interpreters/children.4.machine";
import asyncInterp_8 from "#machines/async/interpreters/children.5.machine";
import asyncInterp_9 from "#machines/async/interpreters/composition.1.machine";
import asyncInterp_10 from "#machines/async/interpreters/composition.2.machine";
import asyncInterp_11 from "#machines/async/interpreters/composition.3.machine";
import asyncInterp_12 from "#machines/async/interpreters/composition.4.machine";
import asyncInterp_13 from "#machines/async/interpreters/coverage/addOptions-return.1.machine";
import asyncInterp_14 from "#machines/async/interpreters/coverage/addOptions-return.2.machine";
import asyncInterp_15 from "#machines/async/interpreters/coverage/addOptions-return.3.machine";
import asyncInterp_16 from "#machines/async/interpreters/coverage/addOptions-return.4.machine";
import asyncInterp_17 from "#machines/async/interpreters/coverage/addOptions-return.5.machine";
import asyncInterp_18 from "#machines/async/interpreters/coverage/index.machine";
import { machine1 as asyncInterp_19 } from "#machines/async/interpreters/data/machine1.fsm";
import { config2 as asyncInterp_20 } from "#machines/async/interpreters/data/machine2.fsm";
import { config21 as asyncInterp_21 } from "#machines/async/interpreters/data/machine21.fsm";
import { machine23 as asyncInterp_22 } from "#machines/async/interpreters/data/machine23.fsm";
import { config3 as asyncInterp_23 } from "#machines/async/interpreters/data/machine3.fsm";
import asyncInterp_24 from "#machines/async/interpreters/erase.7.machine";
import asyncInterp_25 from "#machines/async/interpreters/filter-erase.1.machine";
import asyncInterp_26 from "#machines/async/interpreters/filter-erase.2.machine";
import asyncInterp_27 from "#machines/async/interpreters/filter-erase.3.machine";
import asyncInterp_28 from "#machines/async/interpreters/filter-erase.4.machine";
import asyncInterp_29 from "#machines/async/interpreters/filter-erase.5.machine";
import asyncInterp_30 from "#machines/async/interpreters/filter-erase.6.machine";
import asyncInterp_31 from "#machines/async/interpreters/legacy-options.1.machine";
import asyncInterp_32 from "#machines/async/interpreters/legacy-options.10.machine";
import asyncInterp_33 from "#machines/async/interpreters/legacy-options.11.machine";
import asyncInterp_34 from "#machines/async/interpreters/legacy-options.12.machine";
import asyncInterp_35 from "#machines/async/interpreters/legacy-options.13.machine";
import asyncInterp_36 from "#machines/async/interpreters/legacy-options.14.machine";
import asyncInterp_37 from "#machines/async/interpreters/legacy-options.2.machine";
import asyncInterp_38 from "#machines/async/interpreters/legacy-options.3.machine";
import asyncInterp_39 from "#machines/async/interpreters/legacy-options.4.machine";
import asyncInterp_40 from "#machines/async/interpreters/legacy-options.5.machine";
import asyncInterp_41 from "#machines/async/interpreters/legacy-options.6.machine";
import asyncInterp_42 from "#machines/async/interpreters/legacy-options.7.machine";
import asyncInterp_43 from "#machines/async/interpreters/legacy-options.8.machine";
import asyncInterp_44 from "#machines/async/interpreters/legacy-options.9.machine";
import asyncInterp_45 from "#machines/async/interpreters/selftransitions/after.1.machine";
import asyncInterp_46 from "#machines/async/interpreters/selftransitions/after.2.machine";
import asyncInterp_47 from "#machines/async/interpreters/selftransitions/after.3.machine";
import asyncInterp_48 from "#machines/async/interpreters/selftransitions/after.4.machine";
import asyncInterp_49 from "#machines/async/interpreters/selftransitions/after.5.machine";
import asyncInterp_50 from "#machines/async/interpreters/selftransitions/always.1.machine";
import asyncInterp_51 from "#machines/async/interpreters/selftransitions/always.2.machine";
import asyncInterp_52 from "#machines/async/interpreters/selftransitions/always.3.machine";
import asyncInterp_53 from "#machines/async/interpreters/selftransitions/index.1.machine";
import asyncInterp_54 from "#machines/async/interpreters/selftransitions/index.2.machine";
import asyncInterp_55 from "#machines/async/interpreters/tags/tags.machine";

describe("Interpreters machines validation", () => {

  test("#01 => interpreters/activities/pause.machine.ts", () =>
    expect(validate.safe(syncInterp_1.config).success).toBe(true));

  test("#02 => interpreters/activities/perform.bis.machine.ts", () =>
    expect(validate.safe(syncInterp_2.config).success).toBe(true));

  test("#03 => interpreters/activities/perform.machine.ts", () =>
    expect(validate.safe(syncInterp_3.config).success).toBe(true));

  test("#04 => interpreters/children.1.machine.ts", () =>
    expect(validate.safe(syncInterp_4.config).success).toBe(true));

  test("#05 => interpreters/children.2.machine.ts", () =>
    expect(validate.safe(syncInterp_5.config).success).toBe(true));

  test("#06 => interpreters/children.3.machine.ts", () =>
    expect(validate.safe(syncInterp_6.config).success).toBe(true));

  test("#07 => interpreters/children.4.machine.ts", () =>
    expect(validate.safe(syncInterp_7.config).success).toBe(true));

  test("#08 => interpreters/children.5.machine.ts", () =>
    expect(validate.safe(syncInterp_8.config).success).toBe(true));

  test("#09 => interpreters/coverage/addOptions-return.1.machine.ts", () =>
    expect(validate.safe(syncInterp_9.config).success).toBe(true));

  test("#10 => interpreters/coverage/addOptions-return.2.machine.ts", () =>
    expect(validate.safe(syncInterp_10.config).success).toBe(true));

  test("#11 => interpreters/coverage/addOptions-return.3.machine.ts", () =>
    expect(validate.safe(syncInterp_11.config).success).toBe(true));

  test("#12 => interpreters/coverage/addOptions-return.4.machine.ts", () =>
    expect(validate.safe(syncInterp_12.config).success).toBe(true));

  test("#13 => interpreters/coverage/addOptions-return.5.machine.ts", () =>
    expect(validate.safe(syncInterp_13.config).success).toBe(true));

  test("#14 => interpreters/coverage/index.machine.ts", () =>
    expect(validate.safe(syncInterp_14.config).success).toBe(true));

  test("#15 => interpreters/data/machine1.fsm.ts", () =>
    expect(validate.safe(syncInterp_15.config).success).toBe(true));

  test("#16 => interpreters/data/machine2.fsm.ts", () =>
    expect(validate.safe(syncInterp_16).success).toBe(true));

  test("#17 => interpreters/data/machine23.fsm.ts", () =>
    expect(validate.safe(syncInterp_17.config).success).toBe(true));

  test("#18 => interpreters/filter-erase.1.machine.ts", () =>
    expect(validate.safe(syncInterp_18.config).success).toBe(true));

  test("#19 => interpreters/filter-erase.2.machine.ts", () =>
    expect(validate.safe(syncInterp_19.config).success).toBe(true));

  test("#20 => interpreters/filter-erase.3.machine.ts", () =>
    expect(validate.safe(syncInterp_20.config).success).toBe(true));

  test("#21 => interpreters/filter-erase.4.machine.ts", () =>
    expect(validate.safe(syncInterp_21.config).success).toBe(true));

  test("#22 => interpreters/filter-erase.5.machine.ts", () =>
    expect(validate.safe(syncInterp_22.config).success).toBe(true));

  test("#23 => interpreters/filter-erase.6.machine.ts", () =>
    expect(validate.safe(syncInterp_23.config).success).toBe(true));

  test("#24 => interpreters/legacy-options.1.machine.ts", () =>
    expect(validate.safe(syncInterp_24.config).success).toBe(true));

  test("#25 => interpreters/legacy-options.10.machine.ts", () =>
    expect(validate.safe(syncInterp_25.config).success).toBe(true));

  test("#26 => interpreters/legacy-options.11.machine.ts", () =>
    expect(validate.safe(syncInterp_26.config).success).toBe(true));

  test("#27 => interpreters/legacy-options.12.machine.ts", () =>
    expect(validate.safe(syncInterp_27.config).success).toBe(true));

  test("#28 => interpreters/legacy-options.13.machine.ts", () =>
    expect(validate.safe(syncInterp_28.config).success).toBe(true));

  test("#29 => interpreters/legacy-options.14.machine.ts", () =>
    expect(validate.safe(syncInterp_29.config).success).toBe(true));

  test("#30 => interpreters/legacy-options.2.machine.ts", () =>
    expect(validate.safe(syncInterp_30.config).success).toBe(true));

  test("#31 => interpreters/legacy-options.3.machine.ts", () =>
    expect(validate.safe(syncInterp_31.config).success).toBe(true));

  test("#32 => interpreters/legacy-options.4.machine.ts", () =>
    expect(validate.safe(syncInterp_32.config).success).toBe(true));

  test("#33 => interpreters/legacy-options.5.machine.ts", () =>
    expect(validate.safe(syncInterp_33.config).success).toBe(true));

  test("#34 => interpreters/legacy-options.6.machine.ts", () =>
    expect(validate.safe(syncInterp_34.config).success).toBe(true));

  test("#35 => interpreters/legacy-options.7.machine.ts", () =>
    expect(validate.safe(syncInterp_35.config).success).toBe(true));

  test("#36 => interpreters/legacy-options.8.machine.ts", () =>
    expect(validate.safe(syncInterp_36.config).success).toBe(true));

  test("#37 => interpreters/legacy-options.9.machine.ts", () =>
    expect(validate.safe(syncInterp_37.config).success).toBe(true));

  test("#38 => interpreters/selftransitions/always.3.machine.ts", () =>
    expect(validate.safe(syncInterp_38.config).success).toBe(true));

  test("#39 => interpreters/selftransitions/index.2.machine.ts", () =>
    expect(validate.safe(syncInterp_39.config).success).toBe(true));

  test("#40 => interpreters/tags/tags.machine.ts", () =>
    expect(validate.safe(syncInterp_40.config).success).toBe(true));

  test("#41 => interpreters/activities/pause.machine.ts", () =>
    expect(validate.safe(asyncInterp_1.config).success).toBe(true));

  test("#42 => interpreters/activities/perform.bis.machine.ts", () =>
    expect(validate.safe(asyncInterp_2.config).success).toBe(true));

  test("#43 => interpreters/activities/perform.machine.ts", () =>
    expect(validate.safe(asyncInterp_3.config).success).toBe(true));

  test("#44 => interpreters/children.1.machine.ts", () =>
    expect(validate.safe(asyncInterp_4.config).success).toBe(true));

  test("#45 => interpreters/children.2.machine.ts", () =>
    expect(validate.safe(asyncInterp_5.config).success).toBe(true));

  test("#46 => interpreters/children.3.machine.ts", () =>
    expect(validate.safe(asyncInterp_6.config).success).toBe(true));

  test("#47 => interpreters/children.4.machine.ts", () =>
    expect(validate.safe(asyncInterp_7.config).success).toBe(true));

  test("#48 => interpreters/children.5.machine.ts", () =>
    expect(validate.safe(asyncInterp_8.config).success).toBe(true));

  test("#49 => interpreters/composition.1.machine.ts", () =>
    expect(validate.safe(asyncInterp_9.config).success).toBe(true));

  test("#50 => interpreters/composition.2.machine.ts", () =>
    expect(validate.safe(asyncInterp_10.config).success).toBe(true));

  test("#51 => interpreters/composition.3.machine.ts", () =>
    expect(validate.safe(asyncInterp_11.config).success).toBe(true));

  test("#52 => interpreters/composition.4.machine.ts", () =>
    expect(validate.safe(asyncInterp_12.config).success).toBe(true));

  test("#53 => interpreters/coverage/addOptions-return.1.machine.ts", () =>
    expect(validate.safe(asyncInterp_13.config).success).toBe(true));

  test("#54 => interpreters/coverage/addOptions-return.2.machine.ts", () =>
    expect(validate.safe(asyncInterp_14.config).success).toBe(true));

  test("#55 => interpreters/coverage/addOptions-return.3.machine.ts", () =>
    expect(validate.safe(asyncInterp_15.config).success).toBe(true));

  test("#56 => interpreters/coverage/addOptions-return.4.machine.ts", () =>
    expect(validate.safe(asyncInterp_16.config).success).toBe(true));

  test("#57 => interpreters/coverage/addOptions-return.5.machine.ts", () =>
    expect(validate.safe(asyncInterp_17.config).success).toBe(true));

  test("#58 => interpreters/coverage/index.machine.ts", () =>
    expect(validate.safe(asyncInterp_18.config).success).toBe(true));

  test("#59 => interpreters/data/machine1.fsm.ts", () =>
    expect(validate.safe(asyncInterp_19.config).success).toBe(true));

  test("#60 => interpreters/data/machine2.fsm.ts", () =>
    expect(validate.safe(asyncInterp_20).success).toBe(true));

  test("#61 => interpreters/data/machine21.fsm.ts", () =>
    expect(validate.safe(asyncInterp_21).success).toBe(true));

  test("#62 => interpreters/data/machine23.fsm.ts", () =>
    expect(validate.safe(asyncInterp_22.config).success).toBe(true));

  test("#63 => interpreters/data/machine3.fsm.ts", () =>
    expect(validate.safe(asyncInterp_23).success).toBe(true));

  test("#64 => interpreters/erase.7.machine.ts", () =>
    expect(validate.safe(asyncInterp_24.config).success).toBe(true));

  test("#65 => interpreters/filter-erase.1.machine.ts", () =>
    expect(validate.safe(asyncInterp_25.config).success).toBe(true));

  test("#66 => interpreters/filter-erase.2.machine.ts", () =>
    expect(validate.safe(asyncInterp_26.config).success).toBe(true));

  test("#67 => interpreters/filter-erase.3.machine.ts", () =>
    expect(validate.safe(asyncInterp_27.config).success).toBe(true));

  test("#68 => interpreters/filter-erase.4.machine.ts", () =>
    expect(validate.safe(asyncInterp_28.config).success).toBe(true));

  test("#69 => interpreters/filter-erase.5.machine.ts", () =>
    expect(validate.safe(asyncInterp_29.config).success).toBe(true));

  test("#70 => interpreters/filter-erase.6.machine.ts", () =>
    expect(validate.safe(asyncInterp_30.config).success).toBe(true));

  test("#71 => interpreters/legacy-options.1.machine.ts", () =>
    expect(validate.safe(asyncInterp_31.config).success).toBe(true));

  test("#72 => interpreters/legacy-options.10.machine.ts", () =>
    expect(validate.safe(asyncInterp_32.config).success).toBe(true));

  test("#73 => interpreters/legacy-options.11.machine.ts", () =>
    expect(validate.safe(asyncInterp_33.config).success).toBe(true));

  test("#74 => interpreters/legacy-options.12.machine.ts", () =>
    expect(validate.safe(asyncInterp_34.config).success).toBe(true));

  test("#75 => interpreters/legacy-options.13.machine.ts", () =>
    expect(validate.safe(asyncInterp_35.config).success).toBe(true));

  test("#76 => interpreters/legacy-options.14.machine.ts", () =>
    expect(validate.safe(asyncInterp_36.config).success).toBe(true));

  test("#77 => interpreters/legacy-options.2.machine.ts", () =>
    expect(validate.safe(asyncInterp_37.config).success).toBe(true));

  test("#78 => interpreters/legacy-options.3.machine.ts", () =>
    expect(validate.safe(asyncInterp_38.config).success).toBe(true));

  test("#79 => interpreters/legacy-options.4.machine.ts", () =>
    expect(validate.safe(asyncInterp_39.config).success).toBe(true));

  test("#80 => interpreters/legacy-options.5.machine.ts", () =>
    expect(validate.safe(asyncInterp_40.config).success).toBe(true));

  test("#81 => interpreters/legacy-options.6.machine.ts", () =>
    expect(validate.safe(asyncInterp_41.config).success).toBe(true));

  test("#82 => interpreters/legacy-options.7.machine.ts", () =>
    expect(validate.safe(asyncInterp_42.config).success).toBe(true));

  test("#83 => interpreters/legacy-options.8.machine.ts", () =>
    expect(validate.safe(asyncInterp_43.config).success).toBe(true));

  test("#84 => interpreters/legacy-options.9.machine.ts", () =>
    expect(validate.safe(asyncInterp_44.config).success).toBe(true));

  test("#85 => interpreters/selftransitions/after.1.machine.ts", () =>
    expect(validate.safe(asyncInterp_45.config).success).toBe(true));

  test("#86 => interpreters/selftransitions/after.2.machine.ts", () =>
    expect(validate.safe(asyncInterp_46.config).success).toBe(true));

  test("#87 => interpreters/selftransitions/after.3.machine.ts", () =>
    expect(validate.safe(asyncInterp_47.config).success).toBe(true));

  test("#88 => interpreters/selftransitions/after.4.machine.ts", () =>
    expect(validate.safe(asyncInterp_48.config).success).toBe(true));

  test("#89 => interpreters/selftransitions/after.5.machine.ts", () =>
    expect(validate.safe(asyncInterp_49.config).success).toBe(true));

  test("#90 => interpreters/selftransitions/always.1.machine.ts", () =>
    expect(validate.safe(asyncInterp_50.config).success).toBe(true));

  test("#91 => interpreters/selftransitions/always.2.machine.ts", () =>
    expect(validate.safe(asyncInterp_51.config).success).toBe(true));

  test("#92 => interpreters/selftransitions/always.3.machine.ts", () =>
    expect(validate.safe(asyncInterp_52.config).success).toBe(true));

  test("#93 => interpreters/selftransitions/index.1.machine.ts", () =>
    expect(validate.safe(asyncInterp_53.config).success).toBe(true));

  test("#94 => interpreters/selftransitions/index.2.machine.ts", () =>
    expect(validate.safe(asyncInterp_54.config).success).toBe(true));

  test("#95 => interpreters/tags/tags.machine.ts", () =>
    expect(validate.safe(asyncInterp_55.config).success).toBe(true));
});
