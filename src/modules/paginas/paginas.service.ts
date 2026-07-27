import { strapiGetList } from '../../clients/strapi.client';
import { toPaginaDto, type PaginaDto } from './paginas.dto';

export async function getPaginaBySlug(slug: string): Promise<PaginaDto | undefined> {
  const { data } = await strapiGetList(`paginas?filters[slug][$eq]=${encodeURIComponent(slug)}`);
  const entry = data[0];
  return entry ? toPaginaDto(entry) : undefined;
}
