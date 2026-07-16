import { strapiGetList } from '../../clients/strapi.client';
import { toPaginationDto, type Paginated } from '../../lib/pagination';
import { toOrdenanzaDto, type OrdenanzaDto } from './ordenanzas.dto';

export async function listOrdenanzas(page: number, pageSize: number): Promise<Paginated<OrdenanzaDto>> {
  const { data, meta } = await strapiGetList(
    `ordenanzas?populate=archivo&sort=fecha:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
  );
  return {
    items: data.map(toOrdenanzaDto),
    pagination: toPaginationDto(page, pageSize, meta?.pagination?.total ?? data.length),
  };
}
