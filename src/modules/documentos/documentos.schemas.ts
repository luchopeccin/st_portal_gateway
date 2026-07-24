import { z } from 'zod';
import { paginationQuerySchema } from '../../lib/pagination';

export const CATEGORIAS = [
  'informacion-publica',
  'tramites',
  'formularios',
  'nomina-personal',
  'impuestos-y-tasas',
  'educacion',
  'concursos',
  'otros',
] as const;

export const listQuerySchema = z.object({
  query: paginationQuerySchema(50).extend({
    categoria: z.enum(CATEGORIAS).optional(),
  }),
});
