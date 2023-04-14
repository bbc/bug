import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PageReconnect from "@components/pages/PageReconnect";
import settingsSlice from "@redux/settingsSlice";
import { useEffect } from "react";
import io from "@utils/io";

const system = io("/system", {
    reconnection: true,
    reconnectionDelay: 500,
});

// this is used to fetch the initial global configuration settings state
export default function SettingsHandler() {
    const dispatch = useDispatch();
    const [connection, setConnection] = useState(true);

    useEffect(() => {
        system.on("connect", () => {
            //console.log(`${system.id}: system - subscribed`);
            setConnection(true);
            system.emit("settings");
        });

        system.on("settings", (result) => {
            //console.log(`${system.id}: system - settings event`, result);
            dispatch(settingsSlice.actions[result["status"]](result));
        });

        system.on("disconnect", () => {
            //console.log(`${system.id}: system - disconnected`);
            setConnection(false);
        });

        return async () => {
            // console.log(`${system.id}: system - unsubscribed`);
            system.disconnect();
        };
    }, [dispatch]);

    return <PageReconnect connection={connection} />;
}
