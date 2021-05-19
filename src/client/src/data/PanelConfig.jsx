import { useEffect } from "react";
import { useDispatch } from "react-redux";
import panelConfigSlice from "../redux/panelConfigSlice";
import io from "@utils/io";

const panelConfig = io("/panelConfig");

export function usePanelConfig({ panelId }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!panelId) {
            return;
        }
        panelConfig.emit("subscribe", panelId);
        // console.log(`${panelId}: panelConfig - subscribed`);

        panelConfig.on("event", function (result) {
            console.log(`${panelId}: panelConfig - event`, result);
            dispatch(panelConfigSlice.actions[result["status"]](result));
        });

        return () => {
            panelConfig.emit("unsubscribe", panelId);
            // console.log(`${panelId}: panelConfig - unsubscribed`);
            dispatch(panelConfigSlice.actions["idle"]());
        };
    }, [panelId, dispatch]);
}
