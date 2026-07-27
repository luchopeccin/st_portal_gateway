import { z } from 'zod';

export const slugParamSchema = z.object({
  params: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  }),
});
