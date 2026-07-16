import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import noticiasRoutes from './modules/noticias/noticias.routes';
import eventosRoutes from './modules/eventos/eventos.routes';
import ordenanzasRoutes from './modules/ordenanzas/ordenanzas.routes';
import reclamosRoutes from './modules/reclamos/reclamos.routes';
import menuRoutes from './modules/menu/menu.routes';
import pingRoutes from './modules/ping/ping.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

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
app.use('/api/ping', pingRoutes);

app.use(notFound);
app.use(errorHandler);
