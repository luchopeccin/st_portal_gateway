import type { NextFunction, Request, RequestHandler, Response } from 'express';
import NodeCache from 'node-cache';
import { env } from '../config/env';
import { NotFoundError } from './errors';

// Caché en memoria: evita pegarle a Strapi en cada visita.
const cache = new NodeCache({ stdTTL: env.CACHE_TTL_SECONDS });

export function cacheable<T>(handler: (req: Request) => Promise<T | undefined>): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = req.originalUrl;
    const hit = cache.get<T>(cacheKey);
    if (hit !== undefined) {
      res.set('X-Cache', 'HIT');
      res.json(hit);
      return;
    }

    try {
      const data = await handler(req);
      if (data === undefined) throw new NotFoundError();
      cache.set(cacheKey, data);
      res.set('X-Cache', 'MISS');
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
}
