import { Request, Response, NextFunction } from "express";

// Body parser middleware (if needed for custom parsing)
const bodyParser = (req: Request, res: Response, next: NextFunction) => {
  // Custom body parsing logic can be added here if needed
  next();
};

export default bodyParser;
