let io = null;

exports.initSocket = (socketIoInstance) => {
  io = socketIoInstance;
  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo");
  }

  return io;
};

exports.emitSeatUpdate = (eventId, payload) => {
  if (!io) return;

  io.to(`event:${eventId}`).emit("seat:update", {
    eventId: String(eventId),
    ...payload,
  });
};