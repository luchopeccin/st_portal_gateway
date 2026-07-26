import type { Request } from 'express';
import { cacheable } from '../../lib/cache';
import * as service from './paginas.service';

interface SlugParams {
  params: { slug: string };
}

export const getPaginaBySlug = cacheable((req: Request) => {
  const { params } = req.validated as SlugParams;
  return service.getPaginaBySlug(params.slug);
});
