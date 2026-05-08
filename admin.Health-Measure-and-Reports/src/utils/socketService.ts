import { io, Socket } from "socket.io-client";

// Always use localhost:5001 for Socket.IO connection
const SOCKET_URL = "http://localhost:5001";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    console.log("🔌 Attempting to connect to Socket.IO server:", SOCKET_URL);
    
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
      forceNew: false, // Changed to false to reuse connection
    });

    // Set up connection-level listeners (only once per socket instance)
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      console.log("📡 Socket ID:", socket?.id);
      // Join health room immediately on connect
      if (socket) {
        socket.emit("join-health-room");
        console.log("📡 Emitted join-health-room event");
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from Socket.IO server. Reason:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.error("🔍 Error details:", error);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconnected to Socket.IO server. Attempt:", attemptNumber);
      socket?.emit("join-health-room");
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Reconnection attempt:", attemptNumber);
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed after all attempts");
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

