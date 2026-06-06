import { PrimitiveObjectSchema } from '#utils/schemas';
import { MapSchema } from '#utils/schemas/map';

export const EventsMapSchema = MapSchema(PrimitiveObjectSchema);
