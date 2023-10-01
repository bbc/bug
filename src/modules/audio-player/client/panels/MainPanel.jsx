import React from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import PlayerCard from "../components/PlayerCard";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";

export default function MainPanel() {
    const { panelId } = useParams();
    const players = useApiPoller({
        url: `/container/${panelId}/players/`,
        interval: 5000,
    });

    if (players.status === "loading" || players.status === "idle") {
        return <BugLoading />;
    }

    const sortedPlayers = Object.keys(players.data)
        .map((key) => {
            return { id: key, ...players.data[key] };
        })
        .sort((a, b) => a?.title.localeCompare(b?.label, "en", { sensitivity: "base" }));

    console.log(sortedPlayers);
    return (
        <>
            <Grid container spacing={1} sx={{ padding: "8px" }}>
                {sortedPlayers.map((player) => (
                    <Grid key={player.id} item xl={3} lg={4} md={6} xs={12}>
                        <PlayerCard panelId={panelId} player={player} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
