import { strapiGetList, strapiGetOne } from '../../clients/strapi.client';
import { toPaginationDto, type Paginated } from '../../lib/pagination';
import { toNoticiaDto, type NoticiaDto } from './noticias.dto';

export async function listNoticias(page: number, pageSize: number): Promise<Paginated<NoticiaDto>> {
  const { data, meta } = await strapiGetList(
    `noticias?populate=imagen&sort=fechaPublicacion:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
  );
  return {
    items: data.map(toNoticiaDto),
    pagination: toPaginationDto(page, pageSize, meta?.pagination?.total ?? data.length),
  };
}

export async function getNoticiaById(id: string): Promise<NoticiaDto | undefined> {
  const entry = await strapiGetOne(`noticias/${id}?populate=imagen`);
  return entry ? toNoticiaDto(entry) : undefined;
}
