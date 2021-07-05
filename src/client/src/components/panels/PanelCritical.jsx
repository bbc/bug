import React from "react";
import Grid from "@material-ui/core/Grid";
import BugAlert from "@components/BugAlert";

export default function PanelCritical({ panel }) {
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
