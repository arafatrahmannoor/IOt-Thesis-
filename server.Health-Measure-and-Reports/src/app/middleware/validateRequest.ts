import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import AppError from "../errors/appError";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync";
import logger from "../utils/logger";

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        logger.warn("Validation Error", {
          url: req.url,
          method: req.method,
          errors: errorMessages,
          body: req.body,
        });

        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Validation Error: ${errorMessages.map((e) => e.message).join(", ")}`,
        );
      }
      next(error);
    }
  });
};

export default validateRequest;
