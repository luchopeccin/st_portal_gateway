import { z } from 'zod';

export const CATEGORIAS_RECLAMO = ['reclamo', 'sugerencia', 'habilitación', 'consulta'] as const;

export const createReclamoSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(1),
    email: z.string().trim().email(),
    categoria: z.enum(CATEGORIAS_RECLAMO),
    mensaje: z.string().trim().min(1),
  }),
});
