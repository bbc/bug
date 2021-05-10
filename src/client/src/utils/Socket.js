import socketIOClient from "socket.io-client";

export default function Socket() {
    const socket = socketIOClient();
    return socket
}