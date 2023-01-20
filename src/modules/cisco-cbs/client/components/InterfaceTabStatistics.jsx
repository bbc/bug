import React from "react";
import Grid from "@mui/material/Grid";
import BugTrafficChart from "@core/BugTrafficChart";

export default function InterfaceTabStatistics({ panelId, interfaceId }) {
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
                <BugTrafficChart url={`/container/${panelId}/interface/history/${interfaceId}`} />
            </Grid>
        </>
    );
}
