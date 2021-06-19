import React from "react";
import Loading from "@components/Loading";
import SputnikCard from "./SputnikCard";
import { useApiPoller } from "@utils/ApiPoller";
import Grid from "@material-ui/core/Grid";

export default function Sputniks({ panelId }) {
    const sputniks = useApiPoller({
        url: `/container/${panelId}/sputnik/all`,
        interval: 1000,
    });

    const renderCard = (sputnik) => {
        return <SputnikCard key={sputnik?._id} {...sputnik} />;
    };

    const renderCards = (sputniks) => {
        if (sputniks) {
            return sputniks.map((sputnik) => renderCard(sputnik));
        }
    };

    if (sputniks.status === "loading" || sputniks.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Grid container spacing={3}>
                {renderCards(sputniks.data)}
            </Grid>
        </>
    );
}
