import { env } from '../config/env';
import { logger } from '../lib/logger';

const TIMEOUT_MS = 10_000;
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Sin TURNSTILE_SECRET_KEY configurada (todavía no se creó el widget en
// Cloudflare), Turnstile queda deshabilitado sin bloquear el formulario -
// ver reclamos.controller.ts, que solo llama a esto si hay secret key.
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
    if (!data.success) {
      logger.info({ errors: data['error-codes'] }, 'Turnstile rechazó el token');
    }
    return data.success;
  } catch (err) {
    // Cloudflare caído/inalcanzable: falla cerrado (rechaza) para no abrir
    // la puerta a un bypass si el servicio externo tiene un problema.
    logger.error({ err }, 'No se pudo verificar el token de Turnstile');
    return false;
  }
}
