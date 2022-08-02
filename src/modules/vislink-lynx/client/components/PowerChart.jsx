import React from "react";
import Grid from "@mui/material/Grid";
import BugPowerChart from "@core/BugPowerChart";

export default function TrafficChart({ receiverCount = 4, panelId, type = "power" }) {
    return (
        <>
            <Grid
                item
                xs={12}
                sx={{
                    padding: "2rem 1rem 1rem 1rem",
                    minHeight: "400px",
                    "@media (max-height:650px)": {
                        padding: "2rem",
                    },
                }}
            >
                <BugPowerChart receiverCount={receiverCount} url={`/container/${panelId}/receiver/${type}`} />
            </Grid>
        </>
    );
}
