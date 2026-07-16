import { z } from 'zod';
import { paginationQuerySchema } from '../../lib/pagination';

export const listQuerySchema = z.object({
  query: paginationQuerySchema(20),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-zA-Z0-9]+$/, 'Id inválido'),
  }),
});
