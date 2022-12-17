import React from "react";
import Grid from "@mui/material/Grid";
import TrafficChart from "./TrafficChart";

export default function NetworkTab({ panelId, deviceId }) {
    return (
        <>
            <Grid item xs={12}>
                <TrafficChart deviceId={deviceId} panelId={panelId} type="area" />
            </Grid>
        </>
    );
}
