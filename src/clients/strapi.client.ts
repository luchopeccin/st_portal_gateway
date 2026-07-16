import { env } from '../config/env';
import { UpstreamError } from '../lib/errors';
import { logger } from '../lib/logger';

const TIMEOUT_MS = 10_000;

// Strapi v5 devuelve los campos planos (sin wrapper "attributes" como en v4).
export interface StrapiEntry {
  id: number;
  documentId?: string;
  [key: string]: unknown;
}

interface StrapiListResponse {
  data: StrapiEntry[];
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
}

interface StrapiEntryResponse {
  data: StrapiEntry | null;
  meta?: unknown;
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${env.STRAPI_API_TOKEN}`;
  }
  return headers;
}

export async function strapiGetList(path: string): Promise<StrapiListResponse> {
  const res = await fetch(`${env.STRAPI_URL}/api/${path}`, {
    headers: buildHeaders(),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    logger.error(`Strapi respondió ${res.status} para ${path}`);
    throw new UpstreamError();
  }
  return res.json() as Promise<StrapiListResponse>;
}

export async function strapiGetOne(path: string): Promise<StrapiEntry | undefined> {
  const res = await fetch(`${env.STRAPI_URL}/api/${path}`, {
    headers: buildHeaders(),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status === 404) return undefined;
  if (!res.ok) {
    logger.error(`Strapi respondió ${res.status} para ${path}`);
    throw new UpstreamError();
  }
  const body = (await res.json()) as StrapiEntryResponse;
  return body.data ?? undefined;
}

export async function strapiCreate(path: string, payload: unknown): Promise<StrapiEntry> {
  const res = await fetch(`${env.STRAPI_URL}/api/${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ data: payload }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    logger.error(`Strapi respondió ${res.status} para ${path}`);
    throw new UpstreamError();
  }
  const body = (await res.json()) as StrapiEntryResponse;
  if (!body.data) throw new UpstreamError('Strapi no devolvió el recurso creado');
  return body.data;
}
