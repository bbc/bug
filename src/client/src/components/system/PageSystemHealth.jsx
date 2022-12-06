import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import SystemHealthHost from "@components/system/SystemHealthHost";
import SystemHealthContainers from "@components/system/SystemHealthContainers";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";

export default function PageSystemHealth() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Health"));
    }, [dispatch]);

    return (
        <>
            <BugPanelTabbedForm
                labels={["Bug Server", "Containers"]}
                content={[<SystemHealthHost />, <SystemHealthContainers />]}
            ></BugPanelTabbedForm>
        </>
    );
}
