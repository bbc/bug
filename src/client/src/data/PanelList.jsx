import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import panelListSlice from '../redux/panelListSlice';
import Socket from "@utils/Socket";

export const PanelConfigContext = React.createContext();

const socket = Socket();

export default function PanelList(props) {

    const dispatch = useDispatch()

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit('panel');
        });

        socket.on("panel", (result) => {
            dispatch(panelListSlice.actions[result['status']](result));
        });

        return async () => {
            socket.disconnect();
        }
    },[dispatch]);

    return (
        <>
            {props.children}
        </>
    )
}