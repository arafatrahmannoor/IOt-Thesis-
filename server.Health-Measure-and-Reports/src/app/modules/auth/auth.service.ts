import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, Secret } from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/appError";
import { EmailHelper } from "../../utils/emailHelper";
import { generateOtp } from "../../utils/generateOtp";
import { UserRole } from "../user/user.interface";
import User from "../user/user.model";
import {
  IAuth,
  IJwtPayload,
  IOTPVerificationPayload,
} from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";

const loginUser = async (payload: IAuth) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findOne({ email: payload.email }).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "This user is not found!");
    }

    if (!user.is_active) {
      throw new AppError(StatusCodes.FORBIDDEN, "This user is not active!");
    }

    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
      throw new AppError(StatusCodes.FORBIDDEN, "Password does not match");
    }

    const nowUTC = new Date();
    const nowBDT = new Date(nowUTC.getTime() + 6 * 60 * 60 * 1000);
    const jwtPayload: IJwtPayload = {
      user_id: user._id as string,
      name: user.name as string,
      email: user.email as string,
      is_active: user.is_active,
      last_login: nowBDT,
      profile_photo: user.profile_photo as string,
      role: user.role,
    };

    const token = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );

    const updateUserInfo = await User.findByIdAndUpdate(
      user._id,
      { clientInfo: payload.clientInfo, last_login: Date.now() },
      { new: true, session }
    );

    await session.commitTransaction();

    return {
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
        role: user.role,
        profile_photo: user.profile_photo,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt_refresh_secret as Secret);
  } catch (err) {
    throw new AppError(StatusCodes.FORBIDDEN, "Invalid Refresh Token");
  }

  const { user_id } = verifiedToken;

  const isUserExist = await User.findById(user_id);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist");
  }

  if (!isUserExist.is_active) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not active");
  }

  const jwtPayload: IJwtPayload = {
    user_id: isUserExist._id as string,
    name: isUserExist.name as string,
    email: isUserExist.email as string,
    last_login: isUserExist.last_login,
    is_active: isUserExist.is_active,
    profile_photo: isUserExist.profile_photo,
    role: isUserExist.role,
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const { user_id } = userData;
  const { oldPassword, newPassword } = payload;

  const user = await User.findOne({ _id: user_id });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (!user.is_active) {
    throw new AppError(StatusCodes.FORBIDDEN, "User account is inactive");
  }

  // Validate old password
  const isOldPasswordCorrect = await User.isPasswordMatched(
    oldPassword,
    user.password
  );
  if (!isOldPasswordCorrect) {
    throw new AppError(StatusCodes.FORBIDDEN, "Incorrect old password");
  }

  // Hash and update the new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  await User.updateOne({ _id: user_id }, { password: hashedPassword });

  return { message: "Password changed successfully" };
};

// Forgot password - send OTP to email
const forgotPassword = async (payload: { email: string }) => {
  const { email } = payload;

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found with this email");
  }

  // Check if user is admin or super admin
  if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "This endpoint is only available for Admin and Super Admin"
    );
  }

  if (!user.is_active) {
    throw new AppError(StatusCodes.FORBIDDEN, "User account is inactive");
  }

  // Generate OTP
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  // Save OTP to user using updateOne (avoid pre-save hook)
  await User.updateOne(
    { _id: user._id },
    {
      otp: otp,
      otpExpiresAt: otpExpiresAt,
    }
  );

  // Send OTP via email
  try {
    console.log("📧 Preparing to send OTP email to:", user.email);
    console.log("🔐 Generated OTP:", otp);

    const emailContent = await EmailHelper.createEmailContent(
      {
        userName: user.name,
        otpCode: otp,
        year: new Date().getFullYear(),
      },
      "forgotPassword"
    );

    console.log("📝 Email content created successfully");

    const emailResult = await EmailHelper.sendEmail(
      user.email,
      emailContent,
      "Password Reset OTP - Airduino"
    );

    console.log("✅ OTP email sent successfully to:", user.email);
    console.log("📧 Email Info:", emailResult);
  } catch (error) {
    console.error("❌ Error in sending OTP email:", error);

    // Clear OTP if email sending fails
    await User.updateOne(
      { _id: user._id },
      {
        otp: undefined,
        otpExpiresAt: undefined,
      }
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to send OTP email. Please check your email configuration.";

    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
  }

  return {
    message: "OTP has been sent to your email",
    email: user.email,
  };
};

// Verify OTP - Step 2: Verify OTP and get token (60 seconds valid)
const verifyOtp = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload;

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Check if user is admin or super admin
  if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "This endpoint is only available for Admin and Super Admin"
    );
  }

  if (!user.is_active) {
    throw new AppError(StatusCodes.FORBIDDEN, "User account is inactive");
  }

  // Check if OTP exists and is valid
  if (!user.otp || !user.otpExpiresAt) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "No OTP found. Please request a new OTP"
    );
  }

  // Check if OTP is expired
  if (new Date() > user.otpExpiresAt) {
    // Clear expired OTP
    await User.updateOne(
      { _id: user._id },
      {
        otp: undefined,
        otpExpiresAt: undefined,
      }
    );
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "OTP has expired. Please request a new OTP"
    );
  }

  // Verify OTP
  if (user.otp !== otp) {
    throw new AppError(StatusCodes.FORBIDDEN, "Invalid OTP");
  }

  // OTP verified successfully - create 60 seconds valid token
  const otpPayload: IOTPVerificationPayload = {
    user_id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
    type: "password_reset",
  };

  // Create token valid for 60 seconds (1 minute)
  const resetToken = createToken(
    otpPayload,
    config.jwt_otp_secret as string,
    "60s" // 60 seconds
  );

  // Clear OTP after successful verification
  await User.updateOne(
    { _id: user._id },
    {
      otp: undefined,
      otpExpiresAt: undefined,
    }
  );

  return {
    message: "OTP verified successfully. You have 60 seconds to change your password.",
    resetToken: resetToken,
    expiresIn: 60, // seconds
  };
};

// Change password with token - Step 3: Use token to change password
const changePasswordWithToken = async (payload: {
  resetToken: string;
  newPassword: string;
}) => {
  const { resetToken, newPassword } = payload;

  // Verify token
  let verifiedToken: any = null;
  try {
    verifiedToken = verifyToken(
      resetToken,
      config.jwt_otp_secret as Secret
    ) as IOTPVerificationPayload;
  } catch (err) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Invalid or expired reset token. Please verify OTP again."
    );
  }

  // Check token type
  if (verifiedToken.type !== "password_reset") {
    throw new AppError(StatusCodes.FORBIDDEN, "Invalid token type");
  }

  // Find user
  const user = await User.findOne({ _id: verifiedToken.user_id });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Check if user is admin or super admin
  if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "This endpoint is only available for Admin and Super Admin"
    );
  }

  if (!user.is_active) {
    throw new AppError(StatusCodes.FORBIDDEN, "User account is inactive");
  }

  // Verify email matches
  if (user.email.toLowerCase() !== verifiedToken.email.toLowerCase()) {
    throw new AppError(StatusCodes.FORBIDDEN, "Token email mismatch");
  }

  // Hash and update the new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // Update password using updateOne (avoids pre-save hook double hashing)
  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  return {
    message: "Password changed successfully",
    email: user.email,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  verifyOtp,
  changePasswordWithToken,
};

