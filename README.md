# Portal Gateway

API Gateway (BFF) en Node.js + Express + TypeScript para el proyecto [PortalWeb](../PortalWeb) de la Municipalidad de Santo Tomé. Consulta a [Strapi](../strapi) (CMS headless), normaliza la respuesta al shape que espera el frontend y cachea en memoria.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor con hot-reload (ts-node-dev) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Corre la versión compilada |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/ping` | Verifica que el gateway está operativo |
| GET | `/api/noticias` | Listado de noticias (Strapi `noticias`, ordenadas por fecha desc, hasta 50) |
| GET | `/api/noticias/:id` | Detalle de una noticia (404 si no existe) |
| GET | `/api/eventos` | Listado de eventos (Strapi `eventos`, ordenados por fecha asc, hasta 20) |
| GET | `/api/eventos/:id` | Detalle de un evento (404 si no existe) |
| GET | `/api/ordenanzas` | Listado de ordenanzas (Strapi `ordenanzas`, ordenadas por fecha desc, hasta 50) |
| POST | `/api/reclamos` | Crea un reclamo/sugerencia/consulta (valida `nombre`, `email`, `categoria`, `mensaje`) |
| GET | `/api/menu` | Árbol del menú de navegación (Strapi `menu-items`, autoreferencial, hasta 3 niveles) |
| GET | `/api/flier` | Flier de bienvenida del home (Strapi single type `Flier`). Devuelve `null` (200) si no hay ninguno activo/publicado — no es un error |

Todos los GET responden `502` si Strapi no está disponible o devuelve error — el frontend cae a datos estáticos de fallback en ese caso (ver `PortalWeb/src/data.ts`).

### Ejemplo de respuesta (`/api/ping`)

```json
{
  "status": "ok",
  "message": "Gateway operativo",
  "timestamp": "2026-06-29T12:00:00.000Z"
}
```

## Integración con Strapi y caché

- Todas las lecturas (`GET`) pasan por un caché en memoria (`node-cache`) con TTL configurable — evita pegarle a Strapi en cada visita. La respuesta incluye el header `X-Cache: HIT`/`MISS`.
- La normalización de los campos de Strapi al shape que espera el frontend vive en un `dto.ts` por módulo (`src/modules/<recurso>/<recurso>.dto.ts`) — si cambian los nombres de campo en un Content-Type de Strapi, es el único lugar a ajustar para ese recurso.
- `GET /api/flier` normaliza el campo `enlace` para que siempre tenga protocolo (antepone `https://` si en Strapi se cargó sin `http(s)://`), y cachea también la respuesta `null` cuando no hay flier activo — un cambio de `activo` en Strapi puede tardar hasta `CACHE_TTL_SECONDS` en reflejarse en el sitio.
- `POST /api/reclamos` reenvía el body a Strapi con el mismo `STRAPI_API_TOKEN` (que necesita permiso `create` sobre el Content-Type `Reclamo`, además de `find`/`findOne` sobre los demás — ver `strapi/README.md`).

## Logging

Logging estructurado con [pino](https://getpino.io) (`src/lib/logger.ts`) — JSON en cualquier entorno salvo `NODE_ENV=development`, donde se usa `pino-pretty` solo para que la terminal sea legible (lo que llega a Loki en un entorno real sigue siendo JSON). `pino-http` (`src/app.ts`) agrega un middleware que:

- Loguea automáticamente cada request completada/con error (método, URL, status, `responseTime`).
- Asigna un id de correlación por request (respeta el header `x-request-id` entrante, si no genera uno) disponible en `req.log` — cualquier log manual durante esa request (ej. `errorHandler.ts`) queda taggeado con el mismo id, para poder rastrear una request puntual en Grafana/Loki (`infra/docker-compose.observability.yml`).

## Configuración

| Variable | Descripción |
|---|---|
| `NODE_ENV` | `development` habilita `pino-pretty`; cualquier otro valor emite JSON plano (default `development`) |
| `PORT` | Puerto del servidor (default `3001`) |
| `STRAPI_URL` | URL interna de Strapi (default `http://localhost:1337`; en Docker, `http://strapi:1337`) |
| `STRAPI_PUBLIC_URL` | URL de Strapi accesible desde el browser, para armar URLs de imágenes/archivos (default: igual a `STRAPI_URL`) |
| `STRAPI_API_TOKEN` | Token de API de Strapi (tipo Custom, ver arriba) |
| `CACHE_TTL_SECONDS` | TTL del caché en memoria (default `60`) |

El CORS acepta cualquier origen `http://localhost:<puerto>` (para no atarse a un puerto fijo del frontend en desarrollo).
