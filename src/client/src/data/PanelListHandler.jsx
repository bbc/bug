import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import panelListSlice from "@redux/panelListSlice";
import io from "@utils/io";

const panelList = io("/panelList");

export default function PanelListHandler(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        panelList.on("connect", () => {
            // console.log(`${panelList.id}: panelList - subscribed`);
        });

        panelList.on("event", (result) => {
            // console.log(`${panelList.id}: panelList - event`, result);
            dispatch(panelListSlice.actions[result["status"]](result));
        });

        return async () => {
            // console.log(`${panelList.id}: panelList - unsubscribed`);
            panelList.disconnect();
        };
    }, [dispatch]);

    return null;
}
