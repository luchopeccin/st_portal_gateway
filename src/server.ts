import { app } from './app';
import { env } from './config/env';
import { logger } from './lib/logger';

app.listen(env.PORT, () => {
  logger.info(`Gateway corriendo en http://localhost:${env.PORT}`);
  logger.info(`Apuntando a Strapi en ${env.STRAPI_URL}`);
});
