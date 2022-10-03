import React from "react";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useForceRefresh } from "@hooks/ForceRefresh";
import { useApiPoller } from "@hooks/ApiPoller";
import Grid from "@mui/material/Grid";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import Group from "./Group";

export default function GroupList({ panelId }) {
    const sendAlert = useAlert();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const loadedProgram = useApiPoller({
        url: `/container/${panelId}/program/loaded`,
        interval: 1000,
        forceRefresh: forceRefresh,
    });

    if (loadedProgram.status === "idle" || loadedProgram.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (loadedProgram.status === "success" && !loadedProgram.data) {
        return <BugNoData title="No connections found" showConfigButton={false} />;
    }

    const handleChange = async (groupId, connectionId, valueArray) => {
        const url = `/container/${panelId}/destination/${[
            encodeURIComponent(loadedProgram.data.handle),
            encodeURIComponent(groupId),
            encodeURIComponent(connectionId),
        ].join("/")}`;
        const result = await AxiosPut(url, valueArray);
        if (result) {
            doForceRefresh();
            sendAlert(`Successfully updated device config`, { variant: "success" });
        } else {
            sendAlert(`Failed to update device config`, { variant: "error" });
        }
    };

    return (
        <Grid
            spacing={1}
            container
            sx={{
                backgroundColor: "background.default",
                padding: "0px",
                "&.MuiGrid-root>.MuiGrid-item": {
                    paddingLeft: "4px",
                    paddingTop: "4px",
                },
            }}
        >
            {loadedProgram.data.groups &&
                loadedProgram.data.groups.map((group) => (
                    <Group group={group} key={group.id} panelId={panelId} onChange={handleChange} />
                ))}
        </Grid>
    );
}
