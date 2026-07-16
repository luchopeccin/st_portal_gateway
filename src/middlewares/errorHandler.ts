import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (err.status >= 500) {
      logger.error(`Error en ${req.method} ${req.originalUrl}:`, err.message);
    }
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  logger.error(`Error no controlado en ${req.method} ${req.originalUrl}:`, err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } });
}
