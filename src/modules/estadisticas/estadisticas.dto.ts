import type { StrapiEntry } from '../../clients/strapi.client';

export interface EstadisticaDto {
  numero: number;
  prefijo: string | null;
  sufijo: string | null;
  etiqueta: string;
}

export function toEstadisticaDto(entry: StrapiEntry): EstadisticaDto {
  return {
    numero: (entry.numero as number) ?? 0,
    prefijo: (entry.prefijo as string) || null,
    sufijo: (entry.sufijo as string) || null,
    etiqueta: (entry.etiqueta as string) ?? '',
  };
}
