import type { Logger } from 'pino';

// pino-http no trae augmentation propia para Express; la request-scoped
// logger (con el id de correlación ya bindeado) queda en req.log.
declare global {
  namespace Express {
    interface Request {
      id: string | number;
      log: Logger;
    }
  }
}
