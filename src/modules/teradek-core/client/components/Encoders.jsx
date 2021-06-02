import React from "react";
import Loading from "@components/Loading";
import EncoderCard from "./EncoderCard";
import { useApiPoller } from "@utils/ApiPoller";
import Grid from "@material-ui/core/Grid";

export default function Encoders({ panelId }) {
    const encoders = useApiPoller({
        url: `/container/${panelId}/device/all/encoders`,
        interval: 2000,
    });

    const renderCard = (encoder) => {
        return <EncoderCard {...encoder} />;
    };

    const renderCards = (encoders) => {
        if (encoders) {
            return encoders.map((encoder) => renderCard(encoder));
        }
    };

    if (encoders.status === "loading" || encoders.status === "idle") {
        return <Loading />;
    }

    console.log(encoders);
    return (
        <>
            <Grid container spacing={2}>
                {renderCards(encoders.data)}
            </Grid>
        </>
    );
}
