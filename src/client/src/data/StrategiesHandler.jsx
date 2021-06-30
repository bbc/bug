import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import strategiesSlice from "@redux/strategiesSlice";
import io from "@utils/io";

const strategyList = io("/strategies");

export default function StrategiesHandler(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        strategyList.on("connect", () => {
            // console.log(`${strategyList.id}: strategyList - subscribed`);
        });

        strategyList.on("event", (result) => {
            // console.log(`${strategyList.id}: strategyList - event`, result);
            dispatch(strategiesSlice.actions[result["status"]](result));
        });

        return async () => {
            // console.log(`${strategyList.id}: strategyList - unsubscribed`);
            strategyList.disconnect();
        };
    }, [dispatch]);

    return null;
}
