import { validate } from "@bemedev/app-valibot";
import asyncEmitter1 from "#machines/async/emitters/emitter1.machine";
import asyncEmitter3 from "#machines/async/emitters/emitter3.machine";
import asyncErrorEmitter from "#machines/async/emitters/error.machine";
import syncEmitter1 from "#machines/sync/emitters/emitter1.machine";
import syncEmitter3 from "#machines/sync/emitters/emitter3.machine";
import syncErrorEmitter from "#machines/sync/emitters/error.machine";
import asyncChildren1 from "#machines/async/interpreters/children.1.machine";
import asyncChildren3 from "#machines/async/interpreters/children.3.machine";
import syncChildren1 from "#machines/sync/interpreters/children.1.machine";
import syncChildren2 from "#machines/sync/interpreters/children.2.machine";
import syncChildren3 from "#machines/sync/interpreters/children.3.machine";
import syncChildren4 from "#machines/sync/interpreters/children.4.machine";
import syncChildren5 from "#machines/sync/interpreters/children.5.machine";
import syncActors2ids1 from "#machines/sync/interpreters/coverage/actors/2ids.1.machine";
import syncActors2ids2 from "#machines/sync/interpreters/coverage/actors/2ids.2.machine";
import syncActorsChild1 from "#machines/sync/interpreters/coverage/actors/child.1.machine";
import syncActorsChild2 from "#machines/sync/interpreters/coverage/actors/child.2.machine";
import syncActorsEmitter from "#machines/sync/interpreters/coverage/actors/emitter.machine";

describe('Actors machines validation', () => {
  test('#01 => async emitter1.machine', () =>
    expect(validate.safe(asyncEmitter1.config).success).toBe(true));

  test("#02 => async emitter3.machine", () =>
    expect(validate.safe(asyncEmitter3.config).success).toBe(true));

  test("#03 => async error.machine", () =>
    expect(validate.safe(asyncErrorEmitter.config).success).toBe(true));

  test("#04 => sync emitter1.machine", () =>
    expect(validate.safe(syncEmitter1.config).success).toBe(true));

  test("#05 => sync emitter3.machine", () =>
    expect(validate.safe(syncEmitter3.config).success).toBe(true));

  test("#06 => sync error.machine", () =>
    expect(validate.safe(syncErrorEmitter.config).success).toBe(true));

  test("#07 => async children.1.machine", () =>
    expect(validate.safe(asyncChildren1.config).success).toBe(true));

  test("#08 => async children.3.machine", () =>
    expect(validate.safe(asyncChildren3.config).success).toBe(true));

  test("#09 => sync children.1.machine", () =>
    expect(validate.safe(syncChildren1.config).success).toBe(true));

  test("#10 => sync children.2.machine", () =>
    expect(validate.safe(syncChildren2.config).success).toBe(true));

  test("#11 => sync children.3.machine", () =>
    expect(validate.safe(syncChildren3.config).success).toBe(true));

  test("#12 => sync children.4.machine", () =>
    expect(validate.safe(syncChildren4.config).success).toBe(true));

  test("#13 => sync children.5.machine", () =>
    expect(validate.safe(syncChildren5.config).success).toBe(true));

  test("#14 => sync coverage actors 2ids.1.machine", () =>
    expect(validate.safe(syncActors2ids1.config).success).toBe(true));

  test("#15 => sync coverage actors 2ids.2.machine", () =>
    expect(validate.safe(syncActors2ids2.config).success).toBe(true));

  test("#16 => sync coverage actors child.1.machine", () =>
    expect(validate.safe(syncActorsChild1.config).success).toBe(true));

  test("#17 => sync coverage actors child.2.machine", () =>
    expect(validate.safe(syncActorsChild2.config).success).toBe(true));

  test("#18 => sync coverage actors emitter.machine", () =>
    expect(validate.safe(syncActorsEmitter.config).success).toBe(true));
});
