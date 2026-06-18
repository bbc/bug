import { useApiPoller } from "@hooks/ApiPoller";
import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";
import { Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import ResultsTable from "../components/ResultsTable";
import SpeedCard from "./../components/SpeedCard";

export default function MainPanel() {
    const params = useParams();
    const [cardRefreshKey, setCardRefreshKey] = React.useState(0);

    const status = useApiPoller({
        url: `/container/${params.panelId}/test/status`,
        interval: 3000,
    });

    usePanelToolbarEvent("refreshGraphs", () => {
        setCardRefreshKey((currentValue) => currentValue + 1);
    });

    return (
        <>
            <Grid container spacing={0}>
                <SpeedCard
                    forceRefresh={cardRefreshKey}
                    running={status.data?.running}
                    url={`/container/${params.panelId}/download/stats`}
                    units="Mb/s"
                    title="Download"
                    interval={500}
                />
                <SpeedCard
                    forceRefresh={cardRefreshKey}
                    running={status.data?.running}
                    url={`/container/${params.panelId}/upload/stats`}
                    units="Mb/s"
                    title="Upload"
                    interval={500}
                />

                <Grid size={{ xs: 12 }} sx={{ padding: "8px" }}>
                    <ResultsTable panelId={params.panelId} limit={10} />
                </Grid>
            </Grid>
        </>
    );
}
