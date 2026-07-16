import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import * as service from './reclamos.service';

interface CreateBody {
  body: { nombre: string; email: string; categoria: string; mensaje: string };
}

export const createReclamo = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req.validated as CreateBody;
  await service.createReclamo(body);
  res.status(201).json({ status: 'ok' });
});
