import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

export default function BugLoading({ height = "100vh" }) {
    return (
        <Grid
            container
            spacing={0}
            sx={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: height,
            }}
        >
            <Grid item xs={3}>
                <CircularProgress />
            </Grid>
        </Grid>
    );
}
