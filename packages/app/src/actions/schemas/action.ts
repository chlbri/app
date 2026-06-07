import { DescriberSchema } from '#utils/schemas/describer';
import * as v from 'valibot';

export const ActionConfig_Schema = v.union([v.string(), DescriberSchema]);
