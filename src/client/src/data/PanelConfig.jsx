import { useEffect } from "react";
import { useDispatch } from "react-redux";
import panelConfigSlice from "../redux/panelConfigSlice";
import socket from "@utils/Socket";

export function usePanelConfig({ panelId }) {
    const dispatch = useDispatch();
    useEffect(() => {
        console.log(`joining ${panelId}`);
        socket.emit("panelConfig:join", panelId);

        socket.on("panelConfig", function (result) {
            console.log("panelConfig", result);
            dispatch(panelConfigSlice.actions[result["status"]](result));
        });

        return async () => {
            socket.emit("panelConfig:leave", panelId);
            dispatch(panelConfigSlice.actions["idle"]());
        };
    }, [panelId, dispatch]);
}
