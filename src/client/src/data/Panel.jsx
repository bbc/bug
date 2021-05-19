import { useEffect } from "react";
import { useDispatch } from "react-redux";
import panelSlice from "../redux/panelSlice";
import socket from "@utils/Socket";

export function usePanel({ panelId }) {
    const dispatch = useDispatch();
    useEffect(() => {
        socket.emit("panel:join", panelId);

        socket.on("panel", function (result) {
            console.log("panel", result);
            dispatch(panelSlice.actions[result["status"]](result));
        });

        return async () => {
            socket.emit("panel:leave", panelId);
            dispatch(panelSlice.actions["idle"]());
        };
    }, [panelId, dispatch]);
}
