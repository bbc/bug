import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TrafficChart from "@core/TrafficChart";

const useStyles = makeStyles((theme) => ({
    chart: {
        padding: '2rem 1rem 1rem 1rem',
        minHeight: 400,
        "@media (max-height:650px)": {
            padding: "1rem",
        },
    },

}));

export default function InterfaceTabStatistics({ panelId, interfaceName }) {
    const classes = useStyles();

    return (
        <>
            <Grid item xs={12} className={classes.chart}>
                <TrafficChart 
                    url={`/container/${panelId}/interface/history/${interfaceName}`}
                />
            </Grid>
        </>
    );
}
