import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import { env } from './config/env';
import { logger } from './lib/logger';
import noticiasRoutes from './modules/noticias/noticias.routes';
import eventosRoutes from './modules/eventos/eventos.routes';
import ordenanzasRoutes from './modules/ordenanzas/ordenanzas.routes';
import reclamosRoutes from './modules/reclamos/reclamos.routes';
import menuRoutes from './modules/menu/menu.routes';
import flierRoutes from './modules/flier/flier.routes';
import pingRoutes from './modules/ping/ping.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

// Cada request recibe un id de correlación (header `x-request-id` si el
// cliente lo manda, si no lo genera pino-http) y un logger hijo en
// `req.log` que lo incluye en todos sus logs — así se puede rastrear una
// request específica en Grafana/Loki filtrando por ese id.
app.use(pinoHttp({ logger, genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID() }));
app.use(helmet());
// Sin FRONTEND_ORIGIN seteada (caso actual de infra/), se preserva el
// comportamiento de siempre: cualquier puerto local.
app.use(cors({ origin: env.FRONTEND_ORIGIN ?? /^http:\/\/localhost(:\d+)?$/ }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 300 }));

app.use('/api/noticias', noticiasRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/ordenanzas', ordenanzasRoutes);
// Límite más estricto: único endpoint de escritura pública del Gateway.
app.use('/api/reclamos', rateLimit({ windowMs: 15 * 60_000, limit: 20 }), reclamosRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/flier', flierRoutes);
app.use('/api/ping', pingRoutes);

app.use(notFound);
app.use(errorHandler);
