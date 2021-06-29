import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useApiPoller } from "@utils/ApiPoller";
import ChartCPU from "@components/system/charts/ChartCPU";
import ChartMemory from "@components/system/charts/ChartMemory";
import ChartDisk from "@components/system/charts/ChartDisk";
import ChartNetwork from "@components/system/charts/ChartNetwork";
import Loading from "@components/Loading";

const useStyles = makeStyles((theme) => ({}));

export default function PageSystemInfo() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const stats = useApiPoller({
        url: `/api/system/stats`,
        interval: 5000,
    });

    const containers = useApiPoller({
        url: `/api/system/containers`,
        interval: 5000,
    });

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Information"));
    }, [dispatch]);

    if (stats.status === "loading" || stats.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item lg={6} sm={12} xs={12}>
                    <ChartCPU containers={containers} stats={stats.data} />
                </Grid>
                <Grid item lg={6} sm={12} xs={12}>
                    <ChartMemory stats={stats.data} />
                </Grid>
                <Grid item lg={6} sm={12} xs={12}>
                    <ChartDisk stats={stats.data} />
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                    <ChartNetwork type="rx" stats={stats.data} />
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                    <ChartNetwork type="tx" stats={stats.data} />
                </Grid>
            </Grid>
        </>
    );
}
