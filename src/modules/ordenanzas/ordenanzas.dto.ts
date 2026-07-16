import { env } from '../../config/env';
import type { StrapiEntry } from '../../clients/strapi.client';

export interface OrdenanzaDto {
  id: string;
  numero: string;
  titulo: string;
  fecha: string;
  url: string | null;
}

export function toOrdenanzaDto(entry: StrapiEntry): OrdenanzaDto {
  const archivo = entry.archivo as { url?: string } | undefined;
  return {
    id: entry.documentId ?? String(entry.id),
    numero: (entry.numero as string) ?? '',
    titulo: (entry.titulo as string) ?? '',
    fecha: (entry.fecha as string) ?? '',
    url: archivo?.url ? `${env.STRAPI_PUBLIC_URL}${archivo.url}` : null,
  };
}
