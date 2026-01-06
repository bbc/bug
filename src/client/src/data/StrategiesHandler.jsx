import strategiesSlice from "@redux/strategiesSlice";
import io from "@utils/io";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function StrategiesHandler() {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io("/strategies");

        socket.on("event", (result) => {
            const action = strategiesSlice.actions[result?.status];
            if (action) dispatch(action(result));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    return null;
}
