import React, { useEffect } from 'react';
import socketIOClient from "socket.io-client";
import { useDispatch } from 'react-redux';
import panelListSlice from '../redux/panelListSlice';

import ApiPoller from '@utils/ApiPoller';

export const PanelContext = React.createContext();

export default function PanelList(props) {

    //TODO can we use the proxy for this?
    const socketHost = 'http://localhost:3101'
    const dispatch = useDispatch()
    const setSuccess = (result) => {
        dispatch(panelListSlice.actions[result['status']](result));
    };

    useEffect(() => {
        const socket = socketIOClient(socketHost);

        socket.on("connect", () => {
            console.log(`Websocket connection to the server!`);
        });
        
        socket.on("panel", (result) => {
            console.log(result);
            dispatch(panelListSlice.actions[result['status']](result));
        });

        return async () => {
            socket.disconnect();
        }
    },[]);

    return (
        <>
            <ApiPoller url="/api/panel/" interval="1000" onChanged={(result) => setSuccess(result)}/>
            {props.children}
        </>
    )
}