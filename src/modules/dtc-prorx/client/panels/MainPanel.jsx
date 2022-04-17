import React from "react";
import { useParams } from "react-router-dom";
import { useApiPoller } from "@hooks/ApiPoller";
import { useSelector } from "react-redux";
import BugLoading from "@core/BugLoading";
import Grid from "@mui/material/Grid";
import PowerChart from "../components/PowerChart";
import ReceiverStatus from "../components/ReceiverStatus";

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const items = useApiPoller({
        url: `/container/${params.panelId}/status`,
        interval: 60000,
    });

    if (items.status === "loading" || items.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <ReceiverStatus panelId={params.panelId} />
            <Grid container spacing={2}>
                <PowerChart receiverCount={panelConfig?.data?.receiverCount} panelId={params.panelId} />
            </Grid>
        </>
    );
}
