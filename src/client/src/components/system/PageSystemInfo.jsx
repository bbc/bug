import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { useApiPoller } from "@hooks/ApiPoller";
import ChartCPU from "@components/system/charts/ChartCPU";
import ChartMemory from "@components/system/charts/ChartMemory";
import ChartDisk from "@components/system/charts/ChartDisk";
import ChartNetwork from "@components/system/charts/ChartNetwork";
import BugLoading from "@core/BugLoading";

import BugPanelTabbedForm from "@core/BugPanelTabbedForm";

export default function PageSystemInfo() {
    // const classes = useStyles();
    const dispatch = useDispatch();

    const stats = useApiPoller({
        url: `/api/system/stats`,
        interval: 5000,
    });

    const containers = useApiPoller({
        url: `/api/system/containers`,
        interval: 5000,
    });

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Information"));
    }, [dispatch]);

    if (stats.status === "loading" || stats.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <BugPanelTabbedForm
                labels={["CPU", "Memory", "Disk", "Network RX", "Network TX"]}
                content={[
                    <ChartCPU containers={containers} stats={stats.data} />,
                    <ChartMemory stats={stats.data} />,
                    <ChartDisk stats={stats.data} />,
                    <ChartNetwork type="rx" stats={stats.data} />,
                    <ChartNetwork type="tx" stats={stats.data} />,
                ]}
            ></BugPanelTabbedForm>
        </>
    );
}
