import type { StrapiEntry } from '../../clients/strapi.client';

export interface MenuItemDto {
  label: string;
  href: string;
  children?: MenuItemDto[];
}

export function toMenuItemDto(entry: StrapiEntry): MenuItemDto {
  const hijos = ((entry.hijos as StrapiEntry[] | undefined) ?? [])
    .slice()
    .sort((a, b) => ((a.orden as number) ?? 0) - ((b.orden as number) ?? 0))
    .map(toMenuItemDto);
  return {
    label: ((entry.etiqueta as string) ?? '').trim(),
    href: ((entry.enlace as string) ?? '').trim(),
    ...(hijos.length > 0 ? { children: hijos } : {}),
  };
}
