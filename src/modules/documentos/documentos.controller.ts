import type { Request } from 'express';
import { cacheable } from '../../lib/cache';
import * as service from './documentos.service';

interface ListQuery {
  query: { page: number; pageSize: number; categoria?: string };
}

export const listDocumentos = cacheable((req: Request) => {
  const { query } = req.validated as ListQuery;
  return service.listDocumentos(query.page, query.pageSize, query.categoria);
});
