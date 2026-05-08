import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../errors/appError";
import logger from "../utils/logger";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";

  // Log error details
  logger.error("Global Error Handler", {
    statusCode,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Don't expose internal error details in production
  const isDevelopment = process.env.NODE_ENV !== "production";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(isDevelopment && {
      stack: err.stack,
      error: err,
    }),
  });
};

export default globalErrorHandler;
