import LogStream from "@components/system/LogStream";
import pageTitleSlice from "@redux/pageTitleSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

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

    return <LogStream panelId={panelId} level={"action"} />;
}
