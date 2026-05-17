const crypto = require("crypto");

const MAX_ACTIVE_PER_EVENT = 3;
const ACCESS_TTL_MS = 10 * 60 * 1000;

const queues = new Map();

const getEventQueue = (eventId) => {
  const key = String(eventId);

  if (!queues.has(key)) {
    queues.set(key, {
      waiting: [],
      active: new Map(),
    });
  }

  return queues.get(key);
};

const createAccessToken = () => {
  return crypto.randomBytes(24).toString("hex");
};

const broadcastQueue = (io, eventId) => {
  const queue = getEventQueue(eventId);

  queue.waiting.forEach((item, index) => {
    io.to(item.socketId).emit("queue:update", {
      eventId: String(eventId),
      status: "waiting",
      position: index + 1,
      activeCount: queue.active.size,
      waitingCount: queue.waiting.length,
    });
  });

  queue.active.forEach((item) => {
    io.to(item.socketId).emit("queue:update", {
      eventId: String(eventId),
      status: "active",
      position: 0,
      activeCount: queue.active.size,
      waitingCount: queue.waiting.length,
      accessToken: item.accessToken,
      expiresAt: item.expiresAt,
    });
  });
};

const promoteNextUsers = (io, eventId) => {
  const queue = getEventQueue(eventId);
  const now = Date.now();

  for (const [sessionId, item] of queue.active.entries()) {
    if (item.expiresAt <= now) {
      queue.active.delete(sessionId);
    }
  }

  while (queue.active.size < MAX_ACTIVE_PER_EVENT && queue.waiting.length > 0) {
    const next = queue.waiting.shift();

    if (!next) break;

    const accessToken = createAccessToken();
    const expiresAt = Date.now() + ACCESS_TTL_MS;

    queue.active.set(next.sessionId, {
      ...next,
      accessToken,
      expiresAt,
    });

    io.to(next.socketId).emit("queue:admitted", {
      eventId: String(eventId),
      accessToken,
      expiresAt,
    });
  }

  broadcastQueue(io, eventId);
};

const joinQueue = ({ io, socket, eventId, sessionId, userId = null }) => {
  const queue = getEventQueue(eventId);
  const sessionKey = String(sessionId);

  const activeItem = queue.active.get(sessionKey);

  if (activeItem) {
    activeItem.socketId = socket.id;

    socket.emit("queue:admitted", {
      eventId: String(eventId),
      accessToken: activeItem.accessToken,
      expiresAt: activeItem.expiresAt,
    });

    broadcastQueue(io, eventId);
    return;
  }

  const existingWaiting = queue.waiting.find(
    (item) => item.sessionId === sessionKey
  );

  if (existingWaiting) {
    existingWaiting.socketId = socket.id;
    broadcastQueue(io, eventId);
    return;
  }

  queue.waiting.push({
    eventId: String(eventId),
    sessionId: sessionKey,
    userId,
    socketId: socket.id,
    joinedAt: Date.now(),
  });

  promoteNextUsers(io, eventId);
};

const leaveQueue = ({ io, eventId, sessionId }) => {
  const queue = getEventQueue(eventId);
  const sessionKey = String(sessionId);

  queue.waiting = queue.waiting.filter(
    (item) => item.sessionId !== sessionKey
  );

  queue.active.delete(sessionKey);

  promoteNextUsers(io, eventId);
};

const leaveQueueBySocketId = ({ io, socketId }) => {
  for (const eventId of queues.keys()) {
    const queue = getEventQueue(eventId);

    const oldWaitingLength = queue.waiting.length;

    queue.waiting = queue.waiting.filter((item) => item.socketId !== socketId);

    let removedActive = false;

    for (const [sessionId, item] of queue.active.entries()) {
      if (item.socketId === socketId) {
        queue.active.delete(sessionId);
        removedActive = true;
      }
    }

    const removedWaiting = oldWaitingLength !== queue.waiting.length;

    if (removedWaiting || removedActive) {
      promoteNextUsers(io, eventId);
    }
  }
};

const validateQueueAccess = ({ eventId, sessionId, accessToken }) => {
  const queue = getEventQueue(eventId);
  const sessionKey = String(sessionId);

  const activeItem = queue.active.get(sessionKey);

  if (!activeItem) return false;

  if (activeItem.accessToken !== accessToken) return false;

  if (activeItem.expiresAt <= Date.now()) {
    queue.active.delete(sessionKey);
    return false;
  }

  return true;
};

const getPublicQueueState = (eventId, sessionId) => {
  const queue = getEventQueue(eventId);
  const sessionKey = String(sessionId);

  const activeItem = queue.active.get(sessionKey);

  if (activeItem) {
    return {
      status: "active",
      position: 0,
      activeCount: queue.active.size,
      waitingCount: queue.waiting.length,
      accessToken: activeItem.accessToken,
      expiresAt: activeItem.expiresAt,
    };
  }

  const waitingIndex = queue.waiting.findIndex(
    (item) => item.sessionId === sessionKey
  );

  return {
    status: waitingIndex >= 0 ? "waiting" : "none",
    position: waitingIndex >= 0 ? waitingIndex + 1 : null,
    activeCount: queue.active.size,
    waitingCount: queue.waiting.length,
  };
};

const cleanupExpiredAccess = (io) => {
  for (const eventId of queues.keys()) {
    promoteNextUsers(io, eventId);
  }
};

module.exports = {
  MAX_ACTIVE_PER_EVENT,
  joinQueue,
  leaveQueue,
  leaveQueueBySocketId,
  promoteNextUsers,
  validateQueueAccess,
  getPublicQueueState,
  cleanupExpiredAccess,
};