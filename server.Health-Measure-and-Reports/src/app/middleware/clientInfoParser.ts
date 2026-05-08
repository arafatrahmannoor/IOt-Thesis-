import { NextFunction, Request, Response } from "express";
import UAParser from "ua-parser-js";
import catchAsync from "../utils/catchAsync";

const clientInfoParser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers["user-agent"] || "";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const clientInfo = {
      device: result.device.type || "Desktop",
      browser: `${result.browser.name || "Unknown"} ${result.browser.version || ""}`.trim(),
      ipAddress: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "Unknown",
      pcName: req.headers["x-pc-name"] as string || "",
      os: `${result.os.name || "Unknown"} ${result.os.version || ""}`.trim(),
      userAgent: userAgent,
    };

    req.body.clientInfo = clientInfo;
    next();
  }
);

export default clientInfoParser;

