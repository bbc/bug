import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import strategiesSlice from "@redux/strategiesSlice";
import io from "@utils/io";

const panelList = io("/strategies");

export default function StrategiesHandler(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        panelList.on("connect", () => {
            // console.log(`${panelList.id}: panelList - subscribed`);
        });

        panelList.on("event", (result) => {
            // console.log(`${panelList.id}: panelList - event`, result);
            dispatch(strategiesSlice.actions[result["status"]](result));
        });

        return async () => {
            // console.log(`${panelList.id}: panelList - unsubscribed`);
            panelList.disconnect();
        };
    }, [dispatch]);

    return null;
}
