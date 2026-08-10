import { validate } from "@bemedev/app-valibot";
import actionBatchCov from "#machines/helpers/actions/action.batch.cov.machine";
import actions1 from "#machines/helpers/actions/actions.1.machine";
import actions2 from "#machines/helpers/actions/actions.2.machine";
import asyncActions1 from "#machines/helpers/actions/async-actions.1.machine";
import asyncActions2 from "#machines/helpers/actions/async-actions.2.machine";
import asyncActions3 from "#machines/helpers/actions/async-actions.3.machine";
import asyncActions4 from "#machines/helpers/actions/async-actions.4.machine";
import asyncActions5 from "#machines/helpers/actions/async-actions.5.machine";
import asyncActions6 from "#machines/helpers/actions/async-actions.6.machine";
import asyncActions7 from "#machines/helpers/actions/async-actions.7.machine";
import asyncActions8 from "#machines/helpers/actions/async-actions.8.machine";
import sendToActions1 from "#machines/helpers/actions/sendToActions/sendToActions1.machine";
import sendToActions2 from "#machines/helpers/actions/sendToActions/sendToActions2.machine";

describe('Actions machines validation', () => {
  test('#01 => action.batch.cov.machine', () =>
    expect(validate.safe(actionBatchCov.config).success).toBe(true));

  test("#02 => actions.1.machine", () =>
    expect(validate.safe(actions1.config).success).toBe(true));

  test("#03 => actions.2.machine", () =>
    expect(validate.safe(actions2.config).success).toBe(true));

  test("#04 => async-actions.1.machine", () =>
    expect(validate.safe(asyncActions1.config).success).toBe(true));

  test("#05 => async-actions.2.machine", () =>
    expect(validate.safe(asyncActions2.config).success).toBe(true));

  test("#06 => async-actions.3.machine", () =>
    expect(validate.safe(asyncActions3.config).success).toBe(true));

  test("#07 => async-actions.4.machine", () =>
    expect(validate.safe(asyncActions4.config).success).toBe(true));

  test("#08 => async-actions.5.machine", () =>
    expect(validate.safe(asyncActions5.config).success).toBe(true));

  test("#09 => async-actions.6.machine", () =>
    expect(validate.safe(asyncActions6.config).success).toBe(true));

  test("#10 => async-actions.7.machine", () =>
    expect(validate.safe(asyncActions7.config).success).toBe(true));

  test("#11 => async-actions.8.machine", () =>
    expect(validate.safe(asyncActions8.config).success).toBe(true));

  test("#12 => sendToActions1.machine", () =>
    expect(validate.safe(sendToActions1.config).success).toBe(true));

  test("#13 => sendToActions2.machine", () =>
    expect(validate.safe(sendToActions2.config).success).toBe(true));
});
