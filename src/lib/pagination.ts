import { z } from 'zod';

export const MAX_PAGE_SIZE = 100;

// Factory: cada módulo preserva su pageSize por defecto original (noticias 50,
// eventos 20, ordenanzas 50), todos comparten el mismo tope de seguridad.
// El tope se aplica capeando el valor (no rechazando la request): un cliente
// que pide pageSize=9999 simplemente recibe como máximo MAX_PAGE_SIZE.
export function paginationQuerySchema(defaultPageSize: number) {
  return z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .default(defaultPageSize)
      .transform((n) => Math.min(n, MAX_PAGE_SIZE)),
  });
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export function toPaginationDto(page: number, pageSize: number, total: number): Pagination {
  return { page, pageSize, total };
}
