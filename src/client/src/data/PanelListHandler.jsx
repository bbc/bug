import panelListSlice from "@redux/panelListSlice";
import io from "@utils/io";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PanelListHandler() {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io("/panelList");

        socket.on("connect", () => {
            console.log("PanelList Socket Connected");
        });

        socket.on("event", (result) => {
            const action = panelListSlice?.actions?.[result?.status];
            if (action) {
                dispatch(action(result));
            } else {
                console.warn(`Unknown status received: ${result?.status}`);
            }
        });

        return () => {
            socket.off("connect");
            socket.off("event");
            socket.disconnect();
        };
    }, [dispatch]);

    return null;
}
