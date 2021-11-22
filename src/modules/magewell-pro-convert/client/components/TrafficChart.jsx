import React from "react";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import BugTrafficChart from "@core/BugTrafficChart";

const useStyles = makeStyles((theme) => ({
    chart: {
        padding: "2rem 1rem 1rem 1rem",
        minHeight: 400,
        "@media (max-height:650px)": {
            padding: "1rem",
        },
    },
}));

export default function TrafficChart({ panelId }) {
    const classes = useStyles();

    return (
        <>
            <Grid item xs={12} className={classes.chart}>
                <BugTrafficChart type="area" url={`/container/${panelId}/network/history`} />
            </Grid>
        </>
    );
}
