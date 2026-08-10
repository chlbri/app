import { validate } from "@bemedev/app-valibot";
import guards1 from "#machines/helpers/guards/index.1.machine";
import guards2 from "#machines/helpers/guards/index.2.machine";
import guards3 from "#machines/helpers/guards/index.3.machine";
import guards4 from "#machines/helpers/guards/index.4.machine";

describe("Guards machines validation", () => {

  test("#01 => guards index.1.machine", () =>
    expect(validate.safe(guards1.config).success).toBe(true));

  test("#02 => guards index.2.machine", () =>
    expect(validate.safe(guards2.config).success).toBe(true));

  test("#03 => guards index.3.machine", () =>
    expect(validate.safe(guards3.config).success).toBe(true));

  test("#04 => guards index.4.machine", () =>
    expect(validate.safe(guards4.config).success).toBe(true));
});
