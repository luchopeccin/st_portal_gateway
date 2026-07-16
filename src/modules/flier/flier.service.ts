import { strapiGetOne } from '../../clients/strapi.client';
import { toFlierDto, type FlierDto } from './flier.dto';

export async function getFlier(): Promise<FlierDto | null> {
  const entry = await strapiGetOne('flier?populate=imagen');
  if (!entry) return null;
  return toFlierDto(entry);
}
