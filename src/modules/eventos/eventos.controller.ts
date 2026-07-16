import type { Request } from 'express';
import { cacheable } from '../../lib/cache';
import * as service from './eventos.service';

interface ListQuery {
  query: { page: number; pageSize: number };
}

interface IdParams {
  params: { id: string };
}

export const listEventos = cacheable((req: Request) => {
  const { query } = req.validated as ListQuery;
  return service.listEventos(query.page, query.pageSize);
});

export const getEventoById = cacheable((req: Request) => {
  const { params } = req.validated as IdParams;
  return service.getEventoById(params.id);
});
