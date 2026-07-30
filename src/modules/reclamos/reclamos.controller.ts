import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import * as service from './reclamos.service';

interface CreateBody {
  body: {
    nombre: string;
    email: string;
    categoria: string;
    mensaje: string;
    sitioWeb: string;
    iniciadoEn?: number;
  };
}

// Un formulario real nunca completa el honeypot, y tarda al menos esto en
// enviarse desde que se montó (un bot típico completa y envía en un solo
// request scripteado, casi instantáneo).
const MIN_MS_ANTES_DE_ENVIAR = 1500;

function esSpam(body: CreateBody['body']): boolean {
  if (body.sitioWeb.trim() !== '') return true;
  if (typeof body.iniciadoEn === 'number' && Date.now() - body.iniciadoEn < MIN_MS_ANTES_DE_ENVIAR) {
    return true;
  }
  return false;
}

export const createReclamo = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req.validated as CreateBody;

  if (esSpam(body)) {
    // Respuesta de éxito falsa a propósito: no le da al bot ninguna señal
    // para ajustar su script, y evita revelar que existe un honeypot.
    req.log.info({ email: body.email }, 'Reclamo descartado por honeypot/timing');
    res.status(201).json({ status: 'ok' });
    return;
  }

  const { nombre, email, categoria, mensaje } = body;
  await service.createReclamo({ nombre, email, categoria, mensaje });
  res.status(201).json({ status: 'ok' });
});
