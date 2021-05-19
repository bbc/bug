import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Weather from "../components/Weather";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

export default function MainPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);
    const classes = useStyles();

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <>
            <div className={classes.root}>
                <Grid
                    container
                    spacing={4}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item lg={12} sm={12} xs={12}>
                        <Weather {...panelConfig?.data} />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
