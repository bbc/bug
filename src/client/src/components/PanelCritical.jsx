import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import BugAlert from "@components/BugAlert";

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
                        <BugAlert
                            key={eachItem.key}
                            type="critical"
                            message={eachItem.message}
                            flags={eachItem.flags}
                            panel={panel}
                        />
                    ))}
            </Grid>
        </>
    );
}
