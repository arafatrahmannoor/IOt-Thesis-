import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,

  // Database
  db_url: process.env.DB_URL || "",

  // Server URL
  server_url:
    process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`,

  // Bcrypt
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  // JWT
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || "",
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "",
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "1d",
  jwt_otp_secret: process.env.JWT_OTP_SECRET || "",
  jwt_pass_reset_secret: process.env.JWT_PASS_RESET_SECRET || "",
  jwt_pass_reset_expires_in: process.env.JWT_PASS_RESET_EXPIRES_IN || "15m",

  // Mail Sender
  mail_mailer: process.env.MAIL_MAILER || "smtp",
  mail_host: process.env.MAIL_HOST || "",
  mail_port: Number(process.env.MAIL_PORT) || 587,
  mail_username: process.env.MAIL_USERNAME || "",
  mail_password: process.env.MAIL_PASSWORD || "",
  mail_encryption: process.env.MAIL_ENCRYPTION || "tls",
  mail_from_address: process.env.MAIL_FROM_ADDRESS || "",
  mail_from_name: process.env.MAIL_FROM_NAME || "Airduino",

  //recaptch
  recaptch_secret: process.env.RECAPTCHA_SECRET,
};

