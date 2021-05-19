import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import panelListSlice from "../redux/panelListSlice";
import socket from "@utils/Socket";

export default function PanelList(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("panelList");
        });

        socket.on("panelList", (result) => {
            dispatch(panelListSlice.actions[result["status"]](result));
        });

        return async () => {
            socket.disconnect();
        };
    }, [dispatch]);

    return <>{props.children}</>;
}
