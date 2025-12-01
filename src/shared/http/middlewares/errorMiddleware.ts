import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../errors/api-errors";

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : "Internal Server Error";
  
  if(statusCode === 500) console.error(error);

  return res.status(statusCode).json({ error: message });
};
