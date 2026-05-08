import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import mongoose, { Schema } from "mongoose";
import config from "../../config";
import AppError from "../../errors/appError";
import { IUser, UserModel, UserRole } from "./user.interface";

// Create the User schema based on the interface
const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.EDITOR,
        UserRole.PUBLISHER,
        UserRole.USER,
      ],
      required: true,
    },
    profile_photo: {
      type: String,
    },

    clientInfo: {
      device: {
        type: String,
        required: true,
      },
      browser: {
        type: String,
        required: true,
      },
      ipAddress: {
        type: String,
        required: true,
      },
      pcName: {
        type: String,
      },
      os: {
        type: String,
      },
      userAgent: {
        type: String,
      },
    },
    last_login: {
      type: Date,
      default: Date.now,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash password if it's modified and not empty
  if (user.isModified("password") && user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.checkUserExist = async function (user_id: string) {
  const existingUser = await this.findById(user_id);

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User does not exist!");
  }

  if (!existingUser.is_active) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User is not active!");
  }

  return existingUser;
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;

