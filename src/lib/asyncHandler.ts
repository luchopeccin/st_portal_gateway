import type { NextFunction, Request, RequestHandler, Response } from 'express';

// Express 4 no propaga rejections de handlers async solos: este wrapper
// asegura que cualquier error termine en el errorHandler central.
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
