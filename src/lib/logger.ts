import pino from 'pino';
import { env } from '../config/env';

// En development se usa pino-pretty para que la terminal sea legible; en
// cualquier otro entorno (producción) el output es JSON plano, que es lo
// que espera parsear Loki (infra/observability/) con `| json` en LogQL.
export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : 'info',
  serializers: { err: pino.stdSerializers.err },
  transport:
    env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } }
      : undefined,
});
