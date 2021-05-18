import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    alert: {
        minWidth: "30rem",
        marginBottom: 8,
    },
    title: {
        color: "#ffffff",
    },
}));

export default function PanelCritical({ panel }) {
    const classes = useStyles();

    return (
        <>
            <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                {panel._status
                    .filter((x) => x.type === "critical")
                    .map((eachItem) => (
                        <Alert severity="error" className={classes.alert} key={eachItem.key}>
                            <AlertTitle className={classes.title}>Critical Error</AlertTitle>
                            {eachItem.message}
                        </Alert>
                    ))}
            </Grid>
        </>
    );
}
