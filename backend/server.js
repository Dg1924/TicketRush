const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down....");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");
const mySqlPool = require("./config/db");
const { initSocket } = require("./utils/socket");

const {
  joinQueue,
  leaveQueue,
  leaveQueueBySocketId,
  cleanupExpiredAccess,
} = require("./utils/virtualQueue");

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await mySqlPool.promise().query("SELECT 1");
    console.log("MySQL connected");

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      },
    });

    initSocket(io);

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      // Realtime seat map room
      socket.on("event:join", (eventId) => {
        if (!eventId) return;

        socket.join(`event:${eventId}`);
        console.log(`Socket ${socket.id} joined event:${eventId}`);
      });

      socket.on("event:leave", (eventId) => {
        if (!eventId) return;

        socket.leave(`event:${eventId}`);
        console.log(`Socket ${socket.id} left event:${eventId}`);
      });

      // Virtual queue room
      socket.on("queue:join", ({ eventId, sessionId, userId }) => {
        if (!eventId || !sessionId) return;

        socket.join(`queue:${eventId}`);

        joinQueue({
          io,
          socket,
          eventId,
          sessionId,
          userId,
        });

        console.log(
          `Socket ${socket.id} joined queue:${eventId} session:${sessionId}`
        );
      });

      socket.on("queue:leave", ({ eventId, sessionId }) => {
        if (!eventId || !sessionId) return;

        leaveQueue({
          io,
          eventId,
          sessionId,
        });

        socket.leave(`queue:${eventId}`);

        console.log(
          `Socket ${socket.id} left queue:${eventId} session:${sessionId}`
        );
      });

      socket.on("disconnect", () => {
        leaveQueueBySocketId({
          io,
          socketId: socket.id,
        });

        console.log("Socket disconnected:", socket.id);
      });
    });

    // Chỉ tạo 1 interval cleanup cho toàn server
    setInterval(() => {
      cleanupExpiredAccess(io);
    }, 5000);

    server.listen(port, () => {
      console.log(`App running on port ${port}`);
    });

    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION! Shutting down");
      console.log(err.name, err.message);

      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.log("MySQL connection failed");
    console.log(err.name, err.message);
    process.exit(1);
  }
};

startServer();