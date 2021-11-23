import React from "react";
import { makeStyles } from "@mui/styles";
import ProgressCounter from "@components/ProgressCounter";

const state = {
    textTransform: "uppercase",
    opacity: 0.8,
    fontSize: "0.8rem",
    paddingTop: "4px",
    fontWeight: 500,
};

const useStyles = makeStyles(async (theme) => ({
    state_running: {
        ...state,
        color: theme.palette.success.main,
    },
    state_idle: {
        ...state,
        color: theme.palette.secondary.main,
    },
    state_empty: {
        ...state,
    },
    state_stopping: {
        ...state,
        color: theme.palette.primary.main,
    },
    state_starting: {
        ...state,
        color: theme.palette.primary.main,
    },
    state_restarting: {
        ...state,
        color: theme.palette.primary.main,
    },
    state_building: {
        ...state,
        color: theme.palette.primary.main,
    },
    state_error: {
        ...state,
        color: theme.palette.error.main,
    },
    state_active: {
        ...state,
        color: theme.palette.success.main,
    },
}));

export default function PanelRowState({ panel }) {
    const classes = useStyles();

    const errorCount = panel._status.filter((x) => x.type === "error").length;
    const warningCount = panel._status.filter((x) => x.type === "warning").length;
    const criticalCount = panel._status.filter((x) => x.type === "critical").length;

    if (panel._isPending) {
        return <div className={classes.stateEmpty}>...</div>;
    }

    switch (panel._dockerContainer._status) {
        case "building":
            return (
                <div className={classes.state_building}>
                    {panel._buildStatus.text} - <ProgressCounter value={panel._buildStatus.progress} />% complete
                </div>
            );
        case "error":
            return <div className={classes.state_error}>ERROR - {panel._buildStatus.text}</div>;
        default:
        // do nothing
    }

    // if the container isn't running, we don't care about statusItems
    if (panel._dockerContainer._status !== "running") {
        return (
            <div className={`${classes["state_" + panel._dockerContainer._status]}`}>
                {panel._dockerContainer._status}
            </div>
        );
    }

    if (criticalCount > 0) {
        return <div className={classes.state_error}>RUNNING - WITH {criticalCount} CRITICAL ERROR(S)</div>;
    } else if (errorCount > 0) {
        return <div className={classes.state_error}>RUNNING - WITH {errorCount} ERROR(S)</div>;
    } else if (errorCount > 0) {
        return <div className={classes.state_warning}>RUNNING - WITH {warningCount} WARNINGS(S)</div>;
    }

    // this'll only be 'running' but I just left the whole thing in here ...
    return (
        <div className={`${classes["state_" + panel._dockerContainer._status]}`}>{panel._dockerContainer._status}</div>
    );
}
