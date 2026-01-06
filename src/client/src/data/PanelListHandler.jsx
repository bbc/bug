import panelListSlice from "@redux/panelListSlice";
import io from "@utils/io";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PanelListHandler() {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io("/panelList", {}, false);

        socket.on("event", (result) => {
            const action = panelListSlice?.actions?.[result?.status];
            if (action) {
                dispatch(action(result));
            } else {
                console.warn(`Unknown status received: ${result?.status}`);
            }
        });

        return () => {
            socket.off("event");
            socket.disconnect();
        };
    }, [dispatch]);

    return null;
}
