import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import HostCard from "./../components/HostCard";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";

export default function MainPanel() {
    const params = useParams();
    const hosts = useApiPoller({
        url: `/container/${params?.panelId}/hosts/`,
        interval: 3000,
    });

    const getHostCards = (hosts) => {
        const cards = [];
        for (let host of hosts) {
            cards.push(
                <Grid key={host?.hostId} item xl={3} lg={4} md={6} xs={12}>
                    <HostCard panelId={params?.panelId} {...host} />
                </Grid>
            );
        }
        return cards;
    };

    if (hosts.status === "loading" || hosts.status === "idle") {
        return <BugLoading />;
    }

    if (hosts.status !== "success") {
        return (
            <BugNoData
                panelId={params?.panelId}
                title="No hosts found. Try adding some to monitor."
                showConfigButton={false}
            />
        );
    }

    return (
        <>
            <Grid alignItems="stretch" container spacing={1}>
                {getHostCards(hosts.data)}
            </Grid>
        </>
    );
}
