import { strapiGetList, strapiGetOne } from '../../clients/strapi.client';
import { toPaginationDto, type Paginated } from '../../lib/pagination';
import { toEventoDto, type EventoDto } from './eventos.dto';

export async function listEventos(page: number, pageSize: number): Promise<Paginated<EventoDto>> {
  const { data, meta } = await strapiGetList(
    `eventos?populate=imagen&sort=fechaInicio:asc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
  );
  return {
    items: data.map(toEventoDto),
    pagination: toPaginationDto(page, pageSize, meta?.pagination?.total ?? data.length),
  };
}

export async function getEventoById(id: string): Promise<EventoDto | undefined> {
  const entry = await strapiGetOne(`eventos/${id}?populate=imagen`);
  return entry ? toEventoDto(entry) : undefined;
}
