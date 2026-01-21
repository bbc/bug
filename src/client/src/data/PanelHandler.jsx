import panelSlice from "@redux/panelSlice";
import io from "@utils/io";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function usePanel({ panelId }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!panelId) {
            return;
        }

        const socket = io("/panel");

        socket.emit("subscribe", panelId);

        socket.on("event", (result) => {
            const actionFunction = panelSlice.actions[result?.status];
            if (typeof actionFunction === "function") {
                dispatch(actionFunction(result));
            } else {
                console.error(`No suitable action found for status: ${result?.status}`);
            }
        });

        return () => {
            socket.emit("unsubscribe", panelId);
            socket.off("event");
            socket.disconnect();
            dispatch(panelSlice.actions["idle"]());
        };
    }, [panelId, dispatch]);

    return null;
}
