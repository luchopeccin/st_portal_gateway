import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  STRAPI_URL: z.string().url().default('http://localhost:1337'),
  STRAPI_PUBLIC_URL: z.string().url().optional(),
  STRAPI_API_TOKEN: z.string().default(''),
  CACHE_TTL_SECONDS: z.coerce.number().default(60),
  // Sin whitelist explícita, se preserva el comportamiento actual (cualquier localhost:*).
  FRONTEND_ORIGIN: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Configuración de entorno inválida:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  STRAPI_PUBLIC_URL: parsed.data.STRAPI_PUBLIC_URL ?? parsed.data.STRAPI_URL,
};
