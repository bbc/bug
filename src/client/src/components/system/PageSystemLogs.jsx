import React, { useEffect } from "react";
import LogTable from "@components/system/LogTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

export default function PageSystemLogs() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Logs"));
    }, [dispatch]);

    return (
        <>
            <LogTable level={"action"} />
        </>
    );
}
