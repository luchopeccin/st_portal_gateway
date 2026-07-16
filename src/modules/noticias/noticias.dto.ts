import { env } from '../../config/env';
import type { StrapiEntry } from '../../clients/strapi.client';

export interface NoticiaDto {
  id: string;
  categoria: string;
  titulo: string;
  fecha: string;
  img: string | null;
  contenido: string;
}

export function toNoticiaDto(entry: StrapiEntry): NoticiaDto {
  const imagen = entry.imagen as { url?: string } | undefined;
  return {
    id: entry.documentId ?? String(entry.id),
    categoria: (entry.categoria as string) ?? '',
    titulo: (entry.titulo as string) ?? '',
    fecha: (entry.fechaPublicacion as string) ?? '',
    img: imagen?.url ? `${env.STRAPI_PUBLIC_URL}${imagen.url}` : null,
    contenido: (entry.contenido as string) ?? '',
  };
}
