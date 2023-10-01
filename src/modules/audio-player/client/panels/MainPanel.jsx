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

    return (
        <>
            <Grid container spacing={1} sx={{ padding: "8px" }}>
                {players.data &&
                    Object.keys(players.data).map((playerId) => (
                        <Grid key={playerId} item xl={3} lg={4} md={6} xs={12}>
                            <PlayerCard playerId={playerId} panelId={panelId} {...players.data[playerId]} />
                        </Grid>
                    ))}
            </Grid>
        </>
    );
}
