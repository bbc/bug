import React from "react";
import Grid from "@mui/material/Grid";
import TrafficChart from "./TrafficChart";

export default function NetworkTab({ panelId }) {
    return (
        <>
            <Grid item xs={12}>
                <TrafficChart panelId={panelId} />
            </Grid>
        </>
    );
}
