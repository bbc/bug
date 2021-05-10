import socketIOClient from "socket.io-client";

export default function Socket() {
    //TODO can we use the proxy for this?
    const host = window.location.host.split(':')
    const socketHost = `http://${host[0]}:3101`
    const socket = socketIOClient(socketHost);
    return socket
}