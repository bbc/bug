import { useEffect } from "react";
import { useDispatch } from "react-redux";
import panelConfigSlice from "../redux/panelConfigSlice";
import io from "@utils/io";

const panelConfig = io("/panelConfig");

export function usePanelConfig({ panelId }) {
    const dispatch = useDispatch();

    useEffect(() => {
        panelConfig.emit("subscribe", panelId);
        console.log(
            `${panelConfig.id}: panelConfig - subscribed to ${panelId}`
        );

        panelConfig.on("event", function (result) {
            console.log(`${panelConfig.id}: panelConfig - event ${result}`);
            dispatch(panelConfigSlice.actions[result["status"]](result));
        });

        return () => {
            panelConfig.emit("unsubscribe", panelId);
            console.log(
                `${panelConfig.id}: panelConfig - unsubscribed from ${panelId}`
            );
            dispatch(panelConfigSlice.actions["idle"]());
        };
    }, [panelId, dispatch]);
}
