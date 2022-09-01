import { Response, Request, NextFunction } from "express";

export const LogMiddleware = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  let dateISO = new Date().toISOString();
  console.log(`${dateISO} | DEBUG: ${request.method} ${request.originalUrl}`);
  return next();
};
