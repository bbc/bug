import socketIOClient from "socket.io-client";

export default function Socket() {
    //TODO can we use the proxy for this?
    const host = window.location.host;
    const socketHost = `http://${host}`
    const socket = socketIOClient(socketHost);
    return socket
}