import * as v from 'valibot';

export const DescriberSchema = v.object({
  name: v.string(),
  description: v.string(),
});
