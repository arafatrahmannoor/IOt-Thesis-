import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        role: string;
        profile_photo?: string;
        is_active: boolean;
        last_login?: Date;
      };
    }
  }
}

export {};
