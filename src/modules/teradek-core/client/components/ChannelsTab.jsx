import React from "react";
import Loading from "@components/Loading";
import ChannelCard from "./ChannelCard";
import { useApiPoller } from "@utils/ApiPoller";
import Grid from "@material-ui/core/Grid";

export default function Channels({ panelId }) {
    const channels = useApiPoller({
        url: `/container/${panelId}/channel/all`,
        interval: 2000,
    });

    const renderCard = (channel) => {
        return <ChannelCard key={channel?.identifier} {...channel} />;
    };

    const renderCards = (channels) => {
        if (channels) {
            return channels.map((channel) => renderCard(channel));
        }
    };

    if (channels.status === "loading" || channels.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Grid container spacing={3}>
                {renderCards(channels.data)}
            </Grid>
        </>
    );
}
