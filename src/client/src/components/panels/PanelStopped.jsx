import React from "react";
import Grid from "@mui/material/Grid";

export default function PanelStopped(props) {
    return (
        <>
            <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                <h3>Panel is not running</h3>
            </Grid>
        </>
    );
}
