import React, { useEffect } from "react";
import Loading from "@components/Loading";
import EncoderCard from "./EncoderCard";
import { useApiPoller } from "@utils/ApiPoller";
import Grid from "@material-ui/core/Grid";
import io from "socket.io-client-2";
import { useSelector } from "react-redux";

let socket;

export default function Encoders({ panelId }) {
    const panelConfig = useSelector((state) => state.panelConfig);

    const encoders = useApiPoller({
        url: `/container/${panelId}/device/all/encoders`,
        interval: 2000,
    });

    const renderCard = (encoder) => {
        return <EncoderCard key={encoder?.sid} {...encoder} />;
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
