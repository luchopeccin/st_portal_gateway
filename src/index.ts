import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/ }));
app.use(express.json());

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '60', 10);

// Caché en memoria: evita pegarle a Strapi en cada visita.
const cache = new NodeCache({ stdTTL: CACHE_TTL });

interface StrapiEntry {
  id: number;
  documentId?: string;
  [key: string]: unknown;
}

interface StrapiListResponse {
  data: StrapiEntry[];
  meta?: unknown;
}

// Strapi v5 devuelve los campos planos (sin wrapper "attributes" como en v4).
async function fetchFromStrapi(path: string): Promise<StrapiListResponse> {
  const url = `${STRAPI_URL}/api/${path}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Strapi respondió ${res.status} para ${path}`);
  }
  return res.json() as Promise<StrapiListResponse>;
}

function withCache(handler: (req: express.Request) => Promise<unknown>) {
  return async (req: express.Request, res: express.Response) => {
    const cacheKey = req.originalUrl;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    try {
      const data = await handler(req);
      cache.set(cacheKey, data);
      res.set('X-Cache', 'MISS');
      res.json(data);
    } catch (err) {
      console.error(`Error en ${req.originalUrl}:`, (err as Error).message);
      res.status(502).json({ error: 'No se pudo obtener la información del CMS' });
    }
  };
}

// ── Normalización ────────────────────────────────────────
// Adapta los campos de Strapi al shape que ya espera el frontend
// (src/data.ts en PortalWeb). Ajustá estos nombres de campo si no
// coinciden con los Content-Types que termines creando en Strapi.

interface Noticia {
  categoria: string;
  titulo: string;
  fecha: string;
  img: string | null;
}

function toNoticia(entry: StrapiEntry): Noticia {
  const imagen = entry.imagen as { url?: string } | undefined;
  return {
    categoria: (entry.categoria as string) ?? '',
    titulo: (entry.titulo as string) ?? '',
    fecha: (entry.fechaPublicacion as string) ?? '',
    img: imagen?.url ? `${STRAPI_URL}${imagen.url}` : null,
  };
}

interface Evento {
  titulo: string;
  fechaInicio: string;
  lugar: string | null;
  descripcion: string | null;
}

function toEvento(entry: StrapiEntry): Evento {
  return {
    titulo: (entry.titulo as string) ?? '',
    fechaInicio: (entry.fechaInicio as string) ?? '',
    lugar: (entry.lugar as string) ?? null,
    descripcion: (entry.descripcion as string) ?? null,
  };
}

interface Documento {
  titulo: string;
  fecha: string;
  url: string | null;
}

function toDocumento(entry: StrapiEntry): Documento {
  const archivo = entry.archivo as { url?: string } | undefined;
  return {
    titulo: (entry.titulo as string) ?? '',
    fecha: (entry.fecha as string) ?? '',
    url: archivo?.url ? `${STRAPI_URL}${archivo.url}` : null,
  };
}

// ── Endpoints ────────────────────────────────────────────

app.get(
  '/api/noticias',
  withCache(async () => {
    const { data } = await fetchFromStrapi(
      'noticias?populate=imagen&sort=fechaPublicacion:desc&pagination[pageSize]=20'
    );
    return data.map(toNoticia);
  })
);

app.get(
  '/api/eventos',
  withCache(async () => {
    const { data } = await fetchFromStrapi(
      'eventos?populate=*&sort=fechaInicio:asc&pagination[pageSize]=20'
    );
    return data.map(toEvento);
  })
);

app.get(
  '/api/documentos',
  withCache(async () => {
    const { data } = await fetchFromStrapi(
      'documentos?populate=archivo&sort=fecha:desc&pagination[pageSize]=50'
    );
    return data.map(toDocumento);
  })
);

app.get('/api/ping', (_req, res) => {
  res.json({ status: 'ok', message: 'Gateway operativo', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Gateway corriendo en http://localhost:${PORT}`);
  console.log(`Apuntando a Strapi en ${STRAPI_URL}`);
});
