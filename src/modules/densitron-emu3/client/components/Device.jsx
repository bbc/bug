import React from "react";
import OutputList from "./OutputList";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";
import BugGauge from "@core/BugGauge";

export default function Device({ panelId, deviceIndex }) {
    const stats = useApiPoller({
        url: `/container/${panelId}/device/${deviceIndex}/stats`,
        interval: 5000,
    });

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={7}>
                <OutputList panelId={panelId} deviceIndex={deviceIndex} />
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
                <Grid container spacing={1} sx={{ marginBottom: "8px" }}>
                    <Grid item xs={12} sm={6} md={12} lg={6}>
                        <BugGauge
                            value={stats?.data?.meterVolts / 1000}
                            max={480}
                            unit="V"
                            title="Voltage"
                            decimalPlaces={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={12} lg={6}>
                        <BugGauge value={stats?.data?.meterAmps / 1000} max={16} unit="A" title="Current" />
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <BugGauge value={stats?.data?.meterFrequency / 1000} max={100} unit="Hz" title="Frequency" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <BugGauge
                            value={stats?.data?.meterWatts / 1000}
                            max={16 * 240}
                            unit="W"
                            title="Power"
                            decimalPlaces={0}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
