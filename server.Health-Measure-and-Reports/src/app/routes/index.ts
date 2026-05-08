import { Router } from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthValidation } from "../modules/auth/auth.validation";
import { HealthController } from "../modules/health/health.controller";
import { DashboardController } from "../modules/dashboard/dashboard.controller";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";

const router = Router();

// Health monitoring routes (for Arduino data)
// These routes match the Arduino endpoints
router.post("/health/measurements", HealthController.receiveHealthData);
router.post("/health/device-status", HealthController.receiveDeviceStatus);
router.get("/health/status", HealthController.getDeviceStatus); // New endpoint for dashboard
router.get("/health/forget-wifi-check", HealthController.checkForgetWiFi);
router.post("/health/get-reports", HealthController.getReports);

// Dashboard routes
router.get("/dashboard/stats", DashboardController.getDashboardStats); // Temporarily remove auth() for testing

// Legacy route (keeping for backward compatibility)
router.post("/health-data", HealthController.receiveHealthData);

// Auth routes
router.post(
  "/auth/login",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser,
);

router.post("/auth/refresh-token", AuthController.refreshToken);

router.post(
  "/auth/change-password",
  auth(),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword,
);

router.post(
  "/auth/forgot-password",
  validateRequest(AuthValidation.forgotPasswordZodSchema),
  AuthController.forgotPassword,
);

router.post(
  "/auth/verify-otp",
  validateRequest(AuthValidation.verifyOtpZodSchema),
  AuthController.verifyOtp,
);

router.post(
  "/auth/reset-password",
  validateRequest(AuthValidation.changePasswordWithTokenZodSchema),
  AuthController.changePasswordWithToken,
);

// User profile routes
router.get("/user/me", auth(), AuthController.getMyProfile);

export default router;
