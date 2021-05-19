import { useEffect } from "react";
import { useDispatch } from "react-redux";
import panelSlice from "../redux/panelSlice";
import io from "@utils/io";

const panel = io("/panel");

export function usePanel({ panelId }) {
    const dispatch = useDispatch();

    useEffect(() => {
        panel.emit("subscribe", panelId);
        console.log(`${panel.id}: panel - subscribed from ${panelId}`);

        panel.on("event", function (result) {
            console.log(`${panel.id}: panelConfig - event ${result}`);
            dispatch(panelSlice.actions[result["status"]](result));
        });

        return async () => {
            panel.emit("unsubscribe", panelId);
            console.log(`${panel.id}: panel - unsubscribed from ${panelId}`);
            dispatch(panelSlice.actions["idle"]());
        };
    }, [panelId, dispatch]);
}
