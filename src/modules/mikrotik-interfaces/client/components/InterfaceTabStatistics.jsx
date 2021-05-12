import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Loading from "@components/Loading";
import { makeStyles } from "@material-ui/core/styles";
import TrafficChart from "@core/TrafficChart";
import { useApiPoller } from "@utils/ApiPoller";

const useStyles = makeStyles((theme) => ({
    chart: {
        padding: '2rem 1rem 1rem 1rem',
        height: 400
    },
}));

export default function InterfaceTabStatistics({ panelId, interfaceName }) {
    const classes = useStyles();

    const stats = useApiPoller({
        url: `/container/${panelId}/interface/stats/${interfaceName}`,
        interval: 5000,
    });


    if (stats.status === "loading") {
        return <Loading />;
    }
    if (stats.status === "success" && !stats.data) {
        return <>Interface not found</>;
    }

    return (
        <>
            <Grid item xs={12} className={classes.chart}>
                <TrafficChart data={stats.data}/>
            </Grid>
        </>
    );
}
