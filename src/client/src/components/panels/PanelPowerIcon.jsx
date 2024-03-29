import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import BugPowerIcon from "@core/BugPowerIcon";

export default function PanelPowerIcon({ panel }) {
    if (
        panel._dockerContainer._status === "building" ||
        panel._dockerContainer._status === "stopping" ||
        panel._dockerContainer._status === "starting" ||
        panel._dockerContainer._status === "restarting"
    ) {
        return <CircularProgress size={30} />;
    }
    const enabled = panel._dockerContainer._isRunning || (!panel._module.needsContainer && panel.enabled);
    return <BugPowerIcon disabled={!enabled} />;
}
