import { z } from 'zod';
import { paginationQuerySchema } from '../../lib/pagination';

export const listQuerySchema = z.object({
  query: paginationQuerySchema(50),
});
