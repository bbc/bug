import { useEffect } from "react";
import { useDispatch } from "react-redux";
import panelSlice from "@redux/panelSlice";
import io from "@utils/io";

const panel = io("/panel");

export function usePanel({ panelId }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!panelId) {
            return null;
        }
        panel.emit("subscribe", panelId);
        // console.log(`${panelId}: panel - subscribed`);

        panel.on("event", function (result) {
            // console.log(`${panelId}: panel - event`, result);
            const actionFunction = panelSlice.actions[result["status"]];
            if (typeof actionFunction === "function") {
                dispatch(actionFunction(result));
            } else {
                console.error(`no suitable action found for status ${result["status"]}`);
            }
        });

        return async () => {
            panel.emit("unsubscribe", panelId);
            // console.log(`${panelId}: panel unsubscribed`);
            dispatch(panelSlice.actions["idle"]());
        };
    }, [panelId, dispatch]);

    return null;
}
