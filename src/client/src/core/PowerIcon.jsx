import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";

const useStyles = makeStyles((theme) => ({
    iconEnabled: {
        color: theme.palette.primary.main,
        display: "block",
        margin: "auto",
    },
    iconDisabled: {
        opacity: 0.1,
        display: "block",
        margin: "auto",
    },
}));

export default function PowerIcon(props) {
    const classes = useStyles();
    const enabled = props && props.enabled;
    return <PowerSettingsNew className={enabled ? classes.iconEnabled : classes.iconDisabled} />;
}
