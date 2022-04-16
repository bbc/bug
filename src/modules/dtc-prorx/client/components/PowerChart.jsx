import React from "react";
import Grid from "@mui/material/Grid";
import BugPowerChart from "@core/BugPowerChart";

export default function TrafficChart({ panelId, type = "snr" }) {
    return (
        <>
            <Grid
                item
                xs={12}
                sx={{
                    padding: "2rem 1rem 1rem 1rem",
                    minHeight: "400px",
                    "@media (max-height:650px)": {
                        padding: "1rem",
                    },
                }}
            >
                <BugPowerChart url={`/container/${panelId}/receiver/${type}`} />
            </Grid>
        </>
    );
}
