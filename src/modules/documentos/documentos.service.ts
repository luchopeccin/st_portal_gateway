import { strapiGetList } from '../../clients/strapi.client';
import { toPaginationDto, type Paginated } from '../../lib/pagination';
import { toDocumentoDto, type DocumentoDto } from './documentos.dto';

export async function listDocumentos(
  page: number,
  pageSize: number,
  categoria?: string
): Promise<Paginated<DocumentoDto>> {
  const filtro = categoria ? `&filters[categoria][$eq]=${encodeURIComponent(categoria)}` : '';
  const { data, meta } = await strapiGetList(
    `documentos?populate=archivo&sort=fecha:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}${filtro}`
  );
  return {
    items: data.map(toDocumentoDto),
    pagination: toPaginationDto(page, pageSize, meta?.pagination?.total ?? data.length),
  };
}
