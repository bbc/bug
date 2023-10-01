import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import PlayerCardEdit from "../components/PlayerCardEdit";
import AddCard from "../components/AddCard";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import AddDialog from "./../components/AddDialog";
import AxiosPut from "@utils/AxiosPut";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosPost from "@utils/AxiosPost";

import { useAlert } from "@utils/Snackbar";

export default function EditPanel() {
    const params = useParams();
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentPlayerId, setCurrentPlayerId] = useState(null);

    const deletePlayer = async (playerId) => {
        const response = await AxiosDelete(`/container/${params?.panelId}/players/${playerId}`);
        if (response) {
            sendAlert(`Deleted player  ${panelConfig.data.players[playerId].title}`, { variant: "success" });
        } else {
            sendAlert(`Could not delete player ${panelConfig.data.players[playerId].title}`, { variant: "error" });
        }
    };

    const createPlayer = async (player) => {
        const response = await AxiosPost(`/container/${params?.panelId}/players`, player);
        if (response) {
            sendAlert(`Created player ${player.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not create player ${player.title}`, { variant: "error" });
        }
        setCurrentPlayerId(null);
    };

    const updatePlayer = async (player, playerId) => {
        setCurrentPlayerId(null);
        const response = await AxiosPut(`/container/${params?.panelId}/players/${playerId}`, player);
        if (response) {
            sendAlert(`Updated player ${player.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not update player ${player.title}`, { variant: "error" });
        }
    };

    const onClickAdd = (playerId) => {
        setCurrentPlayerId(null);
        setDialogOpen(true);
    };

    const onClickEdit = (playerId) => {
        if (playerId) {
            setCurrentPlayerId(playerId);
        } else {
            setCurrentPlayerId(null);
        }
        setDialogOpen(true);
    };

    const onDismiss = () => {
        setDialogOpen(false);
        setCurrentPlayerId(null);
    };

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <>
            <AddDialog
                playerId={currentPlayerId}
                defaultData={panelConfig?.data?.players[currentPlayerId]}
                open={dialogOpen}
                onDismiss={onDismiss}
                onCreate={createPlayer}
                onEdit={updatePlayer}
            />
            <Grid container spacing={1} sx={{ padding: "8px" }}>
                {panelConfig.data.players &&
                    Object.keys(panelConfig.data.players).map((playerId) => (
                        <Grid item key={playerId} xl={3} lg={4} md={6} xs={12}>
                            <PlayerCardEdit
                                handleDelete={deletePlayer}
                                handleEdit={onClickEdit}
                                player={panelConfig.data.players[playerId]}
                                playerId={playerId}
                            />
                        </Grid>
                    ))}
                <Grid item xl={3} lg={4} md={6} xs={12}>
                    <AddCard handleClick={onClickAdd} />
                </Grid>
            </Grid>
        </>
    );
}
