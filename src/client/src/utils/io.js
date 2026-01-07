import { io } from "socket.io-client";

const socket = (namespace, options = {}, autoConnect) => {
    const instance = io(namespace, {
        withCredentials: true,
        transports: ["websocket"],
        upgrade: false,
        forceNew: true,
        reconnectionDelay: 0,
        timeout: 2000,
        autoConnect: autoConnect,
        ...options
    });

    setTimeout(() => instance.connect(), 100);

    return instance;
};

export default socket;