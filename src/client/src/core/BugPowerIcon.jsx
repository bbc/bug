import React from "react";
import { makeStyles } from "@mui/styles";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";

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

export default function BugPowerIcon(props) {
    const classes = useStyles();
    const enabled = props && props.enabled;
    return <PowerSettingsNew className={enabled ? classes.iconEnabled : classes.iconDisabled} />;
}
