import type { StrapiEntry } from '../../clients/strapi.client';

export interface PaginaDto {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
}

export function toPaginaDto(entry: StrapiEntry): PaginaDto {
  return {
    id: entry.documentId ?? String(entry.id),
    titulo: (entry.titulo as string) ?? '',
    slug: (entry.slug as string) ?? '',
    contenido: (entry.contenido as string) ?? '',
  };
}
