import panelConfigSlice from "@redux/panelConfigSlice";
import io from "@utils/io";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function usePanelConfig({ panelId }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!panelId) return;

        const socket = io("/panelConfig");

        socket.emit("subscribe", panelId);

        socket.on("event", (result) => {
            const action = panelConfigSlice.actions[result?.status];
            if (action) dispatch(action(result));
        });

        return () => {
            socket.emit("unsubscribe", panelId);
            socket.disconnect();
            dispatch(panelConfigSlice.actions["idle"]());
        };
    }, [panelId, dispatch]);
}
