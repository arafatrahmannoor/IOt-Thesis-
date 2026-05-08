import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";

// Action logger middleware for tracking user actions
const actionLogger = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Action logging logic can be added here
    next();
  }
);

export default actionLogger;
