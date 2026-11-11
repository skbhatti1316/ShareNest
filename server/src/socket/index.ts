import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer | null = null;

export function initSocketIO(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket: Socket) => {
    // When client authenticates with their user ID
    socket.on("join_user_room", (userId: string) => {
      if (userId) {
        const room = `user_${userId}`;
        socket.join(room);
        console.log(`[Socket.IO] Socket ${socket.id} joined room ${room}`);
      }
    });

    // When client opens a borrow request chat/details view
    socket.on("join_request_room", (requestId: string) => {
      if (requestId) {
        const room = `request_${requestId}`;
        socket.join(room);
        console.log(`[Socket.IO] Socket ${socket.id} joined request room ${room}`);
      }
    });

    socket.on("leave_request_room", (requestId: string) => {
      if (requestId) {
        socket.leave(`request_${requestId}`);
      }
    });

    socket.on("disconnect", () => {
      // Disconnected cleanly
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.IO is not initialized yet!");
  }
  return io;
}

export function emitToUser(userId: string, event: string, payload: any): void {
  if (!io) return;
  const room = `user_${userId}`;
  io.to(room).emit(event, payload);
  console.log(`[Socket.IO] Emitted '${event}' to ${room}`);
}

export function emitToRequest(requestId: string, event: string, payload: any): void {
  if (!io) return;
  const room = `request_${requestId}`;
  io.to(room).emit(event, payload);
  console.log(`[Socket.IO] Emitted '${event}' to ${room}`);
}
