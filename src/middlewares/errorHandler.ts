import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (err.status >= 500) {
      req.log.error({ err }, 'Error del servidor');
    }
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  req.log.error({ err }, 'Error no controlado');
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } });
}
