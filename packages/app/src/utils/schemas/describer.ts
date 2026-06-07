import * as v from 'valibot';

export const DescriberSchema = v.strictObject({
  name: v.string(),
  description: v.string(),
});
