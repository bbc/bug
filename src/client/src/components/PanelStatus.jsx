import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    panelStatus: {},
    alert: {},
}));

export default function PanelStatus({ statusItems }) {
    const classes = useStyles();

    const titles = {
        warning: "Warning",
        info: "Info",
        error: "Error",
    };

    return (
        <div className={classes.panelStatus}>
            {statusItems.map((eachItem) => (
                <Alert severity={eachItem.type} className={classes.alert} key={eachItem.key}>
                    <AlertTitle className={classes.title}>{titles[eachItem.type]}</AlertTitle>
                    {eachItem.message}
                </Alert>
            ))}
        </div>
    );
}
