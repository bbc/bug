import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import SpeedCard from "./../components/SpeedCard";
import ResultsTable from "../components/ResultsTable";
import { useApiPoller } from "@hooks/ApiPoller";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function MainPanel() {
    const params = useParams();

    const status = useApiPoller({
        url: `/container/${params.panelId}/test/status`,
        interval: 3000,
    });

    return (
        <>
            <Grid container spacing={0}>
                <SpeedCard
                    running={status.data?.running}
                    url={`/container/${params.panelId}/download/stats`}
                    units="Mb/s"
                    title="Download"
                    interval={500}
                />
                <SpeedCard
                    running={status.data?.running}
                    url={`/container/${params.panelId}/upload/stats`}
                    units="Mb/s"
                    title="Upload"
                    interval={500}
                />

                <Grid item xs={12} sx={{ padding: "8px" }}>
                    <ResultsTable panelId={params.panelId} limit={10} />
                </Grid>
            </Grid>
        </>
    );
}
