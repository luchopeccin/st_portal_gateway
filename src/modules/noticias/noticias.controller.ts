import type { Request } from 'express';
import { cacheable } from '../../lib/cache';
import * as service from './noticias.service';

interface ListQuery {
  query: { page: number; pageSize: number };
}

interface IdParams {
  params: { id: string };
}

export const listNoticias = cacheable((req: Request) => {
  const { query } = req.validated as ListQuery;
  return service.listNoticias(query.page, query.pageSize);
});

export const getNoticiaById = cacheable((req: Request) => {
  const { params } = req.validated as IdParams;
  return service.getNoticiaById(params.id);
});
