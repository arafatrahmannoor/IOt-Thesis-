import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/appError";
import { UserRole } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";

const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization?.split(" ")[1]
      : req.headers.authorization;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }

    try {
      console.log("🔐 AUTH: Token received:", token?.substring(0, 50) + "...");

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      console.log("🔐 AUTH: JWT decoded successfully:", {
        user_id: decoded.user_id,
        email: decoded.email,
        role: decoded.role,
      });

      const { user_id, role, email } = decoded;

      // Try to find user by user_id first, fall back to email if needed
      console.log("🔐 AUTH: Looking up user with ID:", user_id);
      const user =
        (await User.findById(user_id)) ||
        (await User.findOne({ email, role, is_active: true }));

      console.log("🔐 AUTH: User lookup result:", user ? "FOUND" : "NOT_FOUND");
      if (user) {
        console.log("🔐 AUTH: User details:", {
          id: user._id,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
        });
      }

      if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "This user is not found!");
      }
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
      }

      // Attach full user object to request
      req.user = {
        _id: user._id?.toString() || user.id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profile_photo: user.profile_photo,
        is_active: user.is_active,
        last_login: user.last_login,
      };
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(
          new AppError(
            StatusCodes.UNAUTHORIZED,
            "Token has expired! Please login again.",
          ),
        );
      }
      return next(new AppError(StatusCodes.UNAUTHORIZED, "Invalid token!"));
    }
  });
};

export default auth;
