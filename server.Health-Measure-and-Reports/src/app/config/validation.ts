import { z } from "zod";

const serverConfigSchema = z.object({
  PORT: z.string().default("5001"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DB_URL: z.string().min(1, "Database URL is required"),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT access secret is required"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT refresh secret is required"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  BCRYPT_SALT_ROUNDS: z.string().default("12"),
  // Email configuration
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.string().optional(),
  MAIL_USERNAME: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_FROM_ADDRESS: z.string().optional(),
  // Cloudinary configuration (optional)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export type ServerConfig = z.infer<typeof serverConfigSchema>;

export const validateServerConfig = (): ServerConfig => {
  try {
    return serverConfigSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Server Configuration Error:");
      error.errors.forEach((err) => {
        console.error(`   - ${err.path.join(".")}: ${err.message}`);
      });
      console.error("\nPlease check your environment variables in .env file");
      process.exit(1);
    }
    throw error;
  }
};

export const getServerConfig = (): ServerConfig => {
  return validateServerConfig();
};
