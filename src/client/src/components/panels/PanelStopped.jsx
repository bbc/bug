import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";

export default function PanelStopped(props) {
    return (
        <>
            <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                <h3>Panel is not running</h3>
            </Grid>
        </>
    );
}
