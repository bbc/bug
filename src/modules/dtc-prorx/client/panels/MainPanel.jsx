import React from "react";
import { useParams } from "react-router-dom";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import Grid from "@mui/material/Grid";
import PowerChart from "../components/PowerChart";
export default function MainPanel() {
    const params = useParams();

    const items = useApiPoller({
        url: `/container/${params.panelId}/receiver/snr`,
        interval: 60000,
    });

    if (items.status === "loading" || items.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <Grid container spacing={2}>
                <PowerChart panelId={params.panelId} />
            </Grid>
        </>
    );
}
