import socketIOClient from "socket.io-client";

export default function Socket() {

    //TODO can we use the proxy for this?
    const socketHost = 'http://localhost:3101'
    const socket = socketIOClient(socketHost);
    return socket
}