import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer | null = null;

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        "http://localhost:5000",
        "http://localhost:5001",
        "http://localhost:5002",
        "http://localhost:5003",
        "https://admin.smartrecruit.agency",
        "https://www.smartrecruit.agency",
        "https://smartrecruit.agency",
      ],
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Auto-join health monitoring room for all clients
    socket.join("health-room");
    console.log(`📡 Client ${socket.id} auto-joined health-room`);

    // Also allow manual join (for explicit control)
    socket.on("join-health-room", () => {
      socket.join("health-room");
      console.log(`📡 Client ${socket.id} manually joined health-room`);
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected: ${socket.id}, Reason: ${reason}`);
    });

    // Handle connection errors
    socket.on("error", (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });
  });

  console.log("🔌 Socket.IO initialized successfully");
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO not initialized! Call initializeSocket first.");
  }
  return io;
};
