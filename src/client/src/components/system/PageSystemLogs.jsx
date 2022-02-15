import React, { useEffect } from "react";
import LogTable from "@components/system/LogTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PageSystemLogs() {
    const dispatch = useDispatch();
    const params = useParams();
    const panelId = params.panelId ?? "";
    const panel = useSelector((state) => state.panelList.data.filter((item) => item.id === panelId)[0]);

    useEffect(() => {
        let title = "System Logs";
        if (panel?.title) {
            title += ` | ${panel.title}`;
        }
        dispatch(pageTitleSlice.actions.set(title));
    }, [dispatch, panel]);

    return (
        <>
            <LogTable panelId={panelId} level={"action"} />
        </>
    );
}
