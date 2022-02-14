import React from "react";
import Grid from "@mui/material/Grid";
import BugDetailsTable from "@core/BugDetailsTable";

export default function OutputTabDetails({ output, panelId }) {
    return (
        <>
            <Grid item xs={12}>
                <BugDetailsTable
                    items={[
                        {
                            name: "Number",
                            value: output.number,
                        },
                        {
                            name: "Name",
                            value: output.name,
                        },
                        {
                            name: "State",
                            value: output.state ? "On" : "Off",
                        },
                        {
                            name: "Fuse",
                            value: output.fuse,
                        },
                        {
                            name: "Delay",
                            value: `${output.delay}s`,
                        },
                    ]}
                />
            </Grid>
        </>
    );
}
