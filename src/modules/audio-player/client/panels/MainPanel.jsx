import React from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import PlayerCard from "./../components/PlayerCard";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";

export default function MainPanel() {
    const params = useParams();
    const players = useApiPoller({
        url: `/container/${params?.panelId}/players/`,
        interval: 5000,
    });

    const getPlayerCards = (players) => {
        const cards = [];
        if (Object.keys(players).length !== 0) {
            for (let playerId in players) {
                cards.push(
                    <Grid key={playerId} item xl={3} lg={4} md={6} xs={12}>
                        <PlayerCard playerId={playerId} panelId={params?.panelId} {...players[playerId]} />
                    </Grid>
                );
            }
        }
        return cards;
    };

    if (players.status === "loading" || players.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <Grid container spacing={1}>
                {getPlayerCards(players.data)}
            </Grid>
        </>
    );
}
