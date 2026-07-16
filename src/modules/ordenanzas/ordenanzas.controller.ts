import type { Request } from 'express';
import { cacheable } from '../../lib/cache';
import * as service from './ordenanzas.service';

interface ListQuery {
  query: { page: number; pageSize: number };
}

export const listOrdenanzas = cacheable((req: Request) => {
  const { query } = req.validated as ListQuery;
  return service.listOrdenanzas(query.page, query.pageSize);
});
