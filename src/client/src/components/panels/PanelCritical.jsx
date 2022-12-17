import React from "react";
import Grid from "@mui/material/Grid";
import BugAlert from "@components/BugAlert";

export default function PanelCritical({ panel }) {
    return (
        <>
            <Grid
                container
                spacing={0}
                sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "16px",
                }}
            >
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
