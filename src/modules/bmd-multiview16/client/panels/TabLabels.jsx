import React from "react";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";

export default function TabLabels({ panelId }) {
    // const layout = useApiPoller({
    //     url: `/container/${panelId}/layout`,
    //     interval: 5000,
    // });

    // if (layout.status === "idle" || layout.status === "loading") {
    //     return <BugLoading height="30vh" />;
    // }
    // if (layout.status === "success" && !layout.data) {
    //     return <BugNoData title="No current data found" showConfigButton={true} />;
    // }

    return (
        <>
            <Grid item xs={12}>
                Yay
            </Grid>
        </>
    );
}
