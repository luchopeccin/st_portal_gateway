import { env } from '../../config/env';
import type { StrapiEntry } from '../../clients/strapi.client';

export interface FlierDto {
  imagenUrl: string;
  enlace: string | null;
  duracionSegundos: number;
}

function normalizarEnlace(enlace: string): string {
  return /^https?:\/\//i.test(enlace) ? enlace : `https://${enlace}`;
}

export function toFlierDto(entry: StrapiEntry): FlierDto | null {
  if (!(entry.activo as boolean)) return null;
  const imagen = entry.imagen as { url?: string } | undefined;
  if (!imagen?.url) return null;
  const enlace = (entry.enlace as string) || '';
  return {
    imagenUrl: `${env.STRAPI_PUBLIC_URL}${imagen.url}`,
    enlace: enlace ? normalizarEnlace(enlace) : null,
    duracionSegundos: (entry.duracionSegundos as number) ?? 6,
  };
}
