import React from "react";
import ProgressCounter from "@components/ProgressCounter";
import Box from "@mui/material/Box";

const State = ({ state, children }) => {
    const stateColors = {
        running: "success.main",
        idle: "text.secondary",
        empty: "text.primary",
        stopping: "text.primary",
        starting: "text.primary",
        restarting: "text.primary",
        building: "text.primary",
        error: "error.main",
        warning: "warning.main",
        active: "success.main",
    };
    return (
        <Box
            sx={{
                textTransform: "uppercase",
                opacity: 0.8,
                fontSize: "0.8rem",
                paddingTop: "4px",
                fontWeight: 500,
                color: stateColors[state],
            }}
        >
            {children}
        </Box>
    );
};

export default function PanelRowState({ panel }) {
    const errorCount = panel._status.filter((x) => x.type === "error").length;
    const warningCount = panel._status.filter((x) => x.type === "warning").length;
    const criticalCount = panel._status.filter((x) => x.type === "critical").length;

    if (panel._isPending) {
        return <State state="empty">...</State>;
    }

    switch (panel._dockerContainer._status) {
        case "building":
            return (
                <State state="building">
                    {panel._buildStatus.text} - <ProgressCounter value={panel._buildStatus.progress} />% complete
                </State>
            );
        case "error":
            return <State state="error">ERROR - {panel._buildStatus.text}</State>;
        default:
        // do nothing
    }

    // if the container isn't running, we don't care about statusItems
    if (panel._dockerContainer._status !== "running") {
        return <State state={panel._dockerContainer._status}>{panel._dockerContainer._status}</State>;
    }

    if (criticalCount > 0) {
        return <State state="error">RUNNING - WITH {criticalCount} CRITICAL ERROR(S)</State>;
    } else if (errorCount > 0) {
        return <State state="error">RUNNING - WITH {errorCount} ERROR(S)</State>;
    } else if (warningCount > 0) {
        return <State state="warning">RUNNING - WITH {warningCount} WARNING(S)</State>;
    }

    // this'll only be 'running' but I just left the whole thing in here ...
    return <State state={panel._dockerContainer._status}>{panel._dockerContainer._status}</State>;
}
