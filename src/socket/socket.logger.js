import { SocketLogger } from "../config/index.js";

/**
 * Event Logger for Socket.io
 * @param {import('socket.io').Server} io - The Socket.IO server instance
 * @param {import('socket.io').Socket} socket - The socket instance of the connected client
 */
export const socketLogger = (io, socket) => {
  // Log incoming events
  socket.onAny((eventName, ...args) => {
    SocketLogger.info("Incoming", {
      metadata: {
        eventName,
        socketId: socket.id,
        userId: socket?.user?.id,
        rooms: Array.from(socket.rooms).join(", ")
      },
      data: args
    });
  });

  // Log outgoing events
  socket.onAnyOutgoing((eventName, ...args) => {
    if (args.length === 1) {
      const logData = {
        metadata: {
          eventName,
          socketId: socket.id,
          userId: socket?.user?.id,
          rooms: Array.from(socket.rooms).join(", ")
        },
        data: args
      };

      if (eventName === "socket:error") {
        SocketLogger.error("Outgoing", logData);
      } else {
        SocketLogger.info("Outgoing", logData);
      }
    }
  });

  const originalIoEmit = io.emit;
  io.emit = (...args) => {
    args.push({ broadcast: true, global: true }); // Append global broadcast flag

    SocketLogger.info("Global Broadcast", {
      metadata: {
        type: "Global Broadcast",
        eventName: args[0],
        socketId: socket.id,
        userId: socket?.user?.id,
        totalClients: io.engine.clientsCount
      },
      data: args.slice(1)
    });

    // Execute the original `io.emit`
    originalIoEmit.apply(io, args);
  };

  const originalBroadcastEmit = socket.broadcast.emit;
  socket.broadcast.emit = (...args) => {
    args.push({ broadcast: true, global: true }); // Append broadcast flag

    SocketLogger.info("Global Broadcast", {
      metadata: {
        type: "Global Broadcast",
        eventName: args[0],
        socketId: socket.id,
        userId: socket?.user?.id,
        totalClients: io.engine.clientsCount
      },
      data: args.slice(1)
    });

    // Execute the original broadcast emit
    originalBroadcastEmit.apply(socket.broadcast, args);
  };

  const originalIoTo = io.to;
  io.to = function (room) {
    const roomEmitter = originalIoTo.call(io, room);

    // Override emit for room broadcasts
    const originalRoomEmit = roomEmitter.emit;
    roomEmitter.emit = (...args) => {
      args.push({ broadcast: true, global: false }); // Append broadcast flag

      SocketLogger.info("Room Broadcast", {
        metadata: {
          type: "Room Broadcast",
          roomName: room,
          eventName: args[0],
          socketId: socket.id,
          userId: socket?.user?.id,
          totalClients: io.sockets.adapter.rooms.get(room)?.size || 0
        },
        data: args.slice(1)
      });

      originalRoomEmit.apply(roomEmitter, args);
    };

    return roomEmitter;
  };
};
