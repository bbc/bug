import PageReconnect from "@components/pages/PageReconnect";
import settingsSlice from "@redux/settingsSlice";
import io from "@utils/io";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function SettingsHandler() {
    const dispatch = useDispatch();
    const [connection, setConnection] = useState(false);

    useEffect(() => {
        const socket = io(
            "/system",
            {
                reconnection: true,
                reconnectionDelay: 500,
            },
            false
        );

        socket.on("connect", () => {
            setConnection(true);
            socket.emit("settings");
        });

        socket.on("settings", (result) => {
            const action = settingsSlice.actions[result?.status];
            if (action) {
                dispatch(action(result));
            }
        });

        socket.on("disconnect", () => {
            setConnection(false);
        });

        return () => {
            socket.off("connect");
            socket.off("settings");
            socket.off("disconnect");
            socket.disconnect();
        };
    }, [dispatch]);

    return <PageReconnect connection={connection} />;
}
