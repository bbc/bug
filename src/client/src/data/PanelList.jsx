import React, { useEffect } from 'react';
import socketIOClient from "socket.io-client";
import { useDispatch } from 'react-redux';
import panelListSlice from '../redux/panelListSlice';

export const PanelContext = React.createContext();

export default function PanelList(props) {

    //TODO can we use the proxy for this?
    const socketHost = 'http://localhost:3101'
    const dispatch = useDispatch()

    useEffect(() => {
        const socket = socketIOClient(socketHost);

        socket.on("connect", () => {
            socket.emit('panel');
        });

        socket.on("panel", (result) => {
            dispatch(panelListSlice.actions[result['status']](result));
        });

        return async () => {
            socket.disconnect();
        }
    },[]);

    return (
        <>
            {props.children}
        </>
    )
}