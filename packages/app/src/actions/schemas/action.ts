import { DescriberSchema } from '#utils/schemas/describer';
import * as v from 'valibot';

export const ActorConfigSchema = v.union([v.string(), DescriberSchema]);
