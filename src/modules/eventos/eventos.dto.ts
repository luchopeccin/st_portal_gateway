import { env } from '../../config/env';
import type { StrapiEntry } from '../../clients/strapi.client';

export interface EventoDto {
  id: string;
  titulo: string;
  fechaInicio: string;
  lugar: string | null;
  descripcion: string | null;
  img: string | null;
}

export function toEventoDto(entry: StrapiEntry): EventoDto {
  const imagen = entry.imagen as { url?: string } | undefined;
  return {
    id: entry.documentId ?? String(entry.id),
    titulo: (entry.titulo as string) ?? '',
    fechaInicio: (entry.fechaInicio as string) ?? '',
    lugar: (entry.lugar as string) ?? null,
    descripcion: (entry.descripcion as string) ?? null,
    img: imagen?.url ? `${env.STRAPI_PUBLIC_URL}${imagen.url}` : null,
  };
}
