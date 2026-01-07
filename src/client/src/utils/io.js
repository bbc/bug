import { io } from "socket.io-client";

const socket = (namespace, options = {}) => {
    return io(namespace, {
        withCredentials: true,
        transports: ["websocket"],
        upgrade: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 10000,
        ...options
    });
};

export default socket;
