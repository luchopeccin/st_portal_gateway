import { z } from 'zod';

export const CATEGORIAS_RECLAMO = ['reclamo', 'sugerencia', 'habilitación', 'consulta'] as const;

export const createReclamoSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(1),
    email: z.string().trim().email(),
    categoria: z.enum(CATEGORIAS_RECLAMO),
    mensaje: z.string().trim().min(1),
    // Honeypot anti-bot: un campo que el formulario real deja vacío y oculta
    // del usuario, pero que un bot que completa todos los inputs sí llena.
    // "iniciadoEn" es el timestamp (ms) de cuándo se montó el formulario en
    // el cliente — un envío casi instantáneo también delata un bot. Ver
    // reclamos.controller.ts para el chequeo.
    sitioWeb: z.string().optional().default(''),
    iniciadoEn: z.number().optional(),
    // Vacío por default: mientras no haya un widget de Turnstile creado en
    // Cloudflare, el controller no exige este campo (ver env.TURNSTILE_SECRET_KEY).
    turnstileToken: z.string().optional().default(''),
  }),
});
