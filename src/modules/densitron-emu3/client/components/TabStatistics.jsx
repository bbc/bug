import React from "react";
import BugGauge from "@core/BugGauge";
import Grid from "@mui/material/Grid";
export default function Statistics({ panelId }) {
    return (
        <Grid container>
            <Grid item xs={12} md={6}>
                <BugGauge value={50} label="120V" title="Voltage" />
            </Grid>
            <Grid item xs={12} md={6}>
                <BugGauge value={70} label="120V" title="Current" />
            </Grid>
        </Grid>
    );
}
