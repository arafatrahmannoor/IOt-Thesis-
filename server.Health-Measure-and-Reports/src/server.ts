import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { initializeSocket } from "./app/utils/socket";

let server: Server | null = null;

// Database connection
async function connectToDatabase() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

// Graceful shutdown
function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Closing server...`);
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Application bootstrap
async function bootstrap() {
  try {
    await connectToDatabase();
    //await seed();

    // Listen on all network interfaces (0.0.0.0) to accept connections from Arduino
    server = app.listen(config.port, "0.0.0.0", () => {
      console.log(
        `🚀 Application is running on port http://localhost:${config.port}`
      );
      console.log(
        `🌐 Server listening on all interfaces (0.0.0.0:${config.port}) - Ready for Arduino connections`
      );
    });

    // Initialize Socket.IO
    initializeSocket(server);
    console.log("🔌 Socket.IO initialized for real-time health monitoring");

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Error handling
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (error) => {
      console.error("Unhandled Rejection:", error);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("Error during bootstrap:", error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
