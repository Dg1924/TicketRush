import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const socketUrl =
      process.env.NEXT_PUBLIC_API_SOCKET_URL || "http://localhost:8000";

    socket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
    });
  }

  return socket;
};