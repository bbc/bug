import strategiesSlice from "@redux/strategiesSlice";
import io from "@utils/io";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function StrategiesHandler() {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io("/strategies", {}, false);

        socket.on("event", (result) => {
            const action = strategiesSlice?.actions?.[result?.status];
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
