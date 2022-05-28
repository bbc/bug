import React from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import HostCard from "./../components/HostCard";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { useApiPoller } from "@hooks/ApiPoller";

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const hosts = useApiPoller({
        url: `/container/${params?.panelId}/hosts/`,
        interval: 5000,
    });

    const getHostCards = (hosts) => {
        const cards = [];
        for (let host of hosts) {
            console.log(host);
            cards.push(
                <Grid key={host?.hostId} item lg={3} md={6} xs={12}>
                    <HostCard {...host} />
                </Grid>
            );
        }
        return cards;
    };

    if (hosts.status === "loading" || hosts.status === "idle" || panelConfig.status === "loading") {
        return <BugLoading />;
    }

    return (
        <>
            <Grid container spacing={1}>
                {getHostCards(hosts.data)}
            </Grid>
        </>
    );
}
