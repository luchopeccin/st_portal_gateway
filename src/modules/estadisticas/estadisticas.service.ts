import { strapiGetList } from '../../clients/strapi.client';
import { toEstadisticaDto, type EstadisticaDto } from './estadisticas.dto';

export async function getEstadisticas(): Promise<EstadisticaDto[]> {
  const { data } = await strapiGetList('estadisticas?pagination[pageSize]=100');
  return data
    .slice()
    .sort((a, b) => ((a.orden as number) ?? 0) - ((b.orden as number) ?? 0))
    .map(toEstadisticaDto);
}
