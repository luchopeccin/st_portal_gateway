import { strapiGetList } from '../../clients/strapi.client';
import { toMenuItemDto, type MenuItemDto } from './menu.dto';

export async function getMenu(): Promise<MenuItemDto[]> {
  const { data } = await strapiGetList(
    'menu-items?filters[padre][id][$null]=true&populate[hijos][populate][hijos]=true&pagination[pageSize]=100'
  );
  return data
    .slice()
    .sort((a, b) => ((a.orden as number) ?? 0) - ((b.orden as number) ?? 0))
    .map(toMenuItemDto);
}
