import { env } from '../../config/env';
import type { StrapiEntry } from '../../clients/strapi.client';

export interface DocumentoDto {
  id: string;
  titulo: string;
  categoria: string;
  fecha: string | null;
  url: string | null;
  tags: string[];
}

export function toDocumentoDto(entry: StrapiEntry): DocumentoDto {
  const archivo = entry.archivo as { url?: string } | undefined;
  return {
    id: entry.documentId ?? String(entry.id),
    titulo: (entry.titulo as string) ?? '',
    categoria: (entry.categoria as string) ?? 'otros',
    fecha: (entry.fecha as string) ?? null,
    url: archivo?.url ? `${env.STRAPI_PUBLIC_URL}${archivo.url}` : null,
    tags: Array.isArray(entry.tags) ? (entry.tags as string[]) : [],
  };
}
