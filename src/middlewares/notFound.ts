import type { Request, Response } from 'express';
import { NotFoundError } from '../lib/errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function notFound(req: Request, _res: Response) {
  throw new NotFoundError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
}
