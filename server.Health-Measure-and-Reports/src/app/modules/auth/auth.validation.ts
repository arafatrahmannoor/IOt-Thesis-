import { z } from "zod";

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z.string({ required_error: "New password is required" }),
  }),
});

const forgotPasswordZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
  }),
});

const verifyOtpZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
    otp: z.string({ required_error: "OTP is required" }),
  }),
});

const changePasswordWithTokenZodSchema = z.object({
  body: z.object({
    resetToken: z.string({ required_error: "Reset token is required" }),
    newPassword: z.string({ required_error: "New password is required" }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  changePasswordZodSchema,
  forgotPasswordZodSchema,
  verifyOtpZodSchema,
  changePasswordWithTokenZodSchema,
};

