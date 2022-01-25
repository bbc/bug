import React from "react";
import { useParams } from "react-router-dom";
import { useApiPoller } from "@hooks/ApiPoller";
import Loading from "@components/Loading";
import FeedCard from "./../components/FeedCard";
import Grid from "@mui/material/Grid";

export default function MainPanel() {
    const params = useParams();

    const items = useApiPoller({
        url: `/container/${params.panelId}/feed/items`,
        interval: 60000,
    });

    const getCards = (items) => {
        const cards = [];
        for (let item of items) {
            cards.push(
                <>
                    <Grid item lg={6} xs={12}>
                        <FeedCard key={item._id} item={item} />
                    </Grid>
                </>
            );
        }
        return cards;
    };

    if (items.status === "loading" || items.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Grid container spacing={2}>
                {getCards(items.data)}
            </Grid>
        </>
    );
}
