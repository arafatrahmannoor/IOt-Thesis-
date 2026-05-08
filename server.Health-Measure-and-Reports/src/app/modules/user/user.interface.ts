import { Document, Model } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  ADMIN = "Admin",
  EDITOR = "Editor",
  PUBLISHER = "Publisher",
  USER = "User",
}

// User Schema Definition
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  profile_photo?: string;
  clientInfo: {
    device: string;
    browser: string;
    ipAddress: string;
    pcName?: string;
    os?: string;
    userAgent?: string;
  };
  last_login: Date;
  is_active: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isUserExistsByEmail(id: string): Promise<IUser>;
  checkUserExist(user_id: string): Promise<IUser>;
}

