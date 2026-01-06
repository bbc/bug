import { io } from "socket.io-client";

const socket = (namespace, options = {}) => {
    return io(namespace, {
        withCredentials: true,
        transports: ["websocket"], // Stay with this to avoid the polling loop
        upgrade: false,
        forceNew: true,
        reconnectionDelay: 0,      // Connect faster on start
        timeout: 2000,             // Don't wait forever if the proxy is lagging
        ...options
    });
};

export default socket;