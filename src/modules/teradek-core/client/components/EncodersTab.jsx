import React from "react";
import Loading from "@components/Loading";
import EncoderCard from "./EncoderCard";
import { useApiPoller } from "@utils/ApiPoller";
import Grid from "@material-ui/core/Grid";

export default function Encoders({ panelId }) {
    const encoders = useApiPoller({
        url: `/container/${panelId}/device/all/encoders`,
        interval: 1000,
    });

    const renderCard = (encoder) => {
        return (
            <EncoderCard panelId={panelId} key={encoder?.sid} {...encoder} />
        );
    };

    const renderCards = (encoders) => {
        if (encoders) {
            return encoders.map((encoder) => renderCard(encoder));
        }
    };

    if (encoders.status === "loading" || encoders.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Grid container spacing={3}>
                {renderCards(encoders.data)}
            </Grid>
        </>
    );
}
