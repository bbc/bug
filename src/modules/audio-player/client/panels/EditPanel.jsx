import { useBugCustomDialog } from "@core/BugCustomDialog";
import BugLoading from "@core/BugLoading";
import { Grid } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosPost from "@utils/AxiosPost";
import AxiosPut from "@utils/AxiosPut";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddCard from "../components/AddCard";
import AddDialog from "../components/AddDialog";
import EditDialog from "../components/EditDialog";
import PlayerCardEdit from "../components/PlayerCardEdit";

import { useAlert } from "@utils/Snackbar";

export default function EditPanel() {
    const params = useParams();
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const { customDialog } = useBugCustomDialog();

    const deletePlayer = async (playerId) => {
        const response = await AxiosDelete(`/container/${params?.panelId}/players/${playerId}`);
        if (response) {
            sendAlert(`Deleted player  ${panelConfig.data.players[playerId].title}`, { variant: "success" });
        } else {
            sendAlert(`Could not delete player ${panelConfig.data.players[playerId].title}`, { variant: "error" });
        }
    };

    const onClickAdd = async () => {
        const result = await customDialog({
            dialog: <AddDialog />,
        });
        if (result !== false) {
            const response = await AxiosPost(`/container/${params?.panelId}/players`, result);
            if (response) {
                sendAlert(`Created player ${result.title}`, { variant: "success" });
            } else {
                sendAlert(`Could not create player ${result.title}`, { variant: "error" });
            }
        }
    };

    const onClickEdit = async (player) => {
        const result = await customDialog({
            dialog: <EditDialog item={player} />,
        });
        if (result !== false) {
            const response = await AxiosPut(`/container/${params?.panelId}/players/${result.id}`, result);
            if (response) {
                sendAlert(`Updated player ${result.title}`, { variant: "success" });
            } else {
                sendAlert(`Could not update player ${result.title}`, { variant: "error" });
            }
        }
    };

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const sortedPlayers = Object.keys(panelConfig?.data?.players)
        .map((key) => {
            return { id: key, ...panelConfig?.data?.players[key] };
        })
        .sort((a, b) => a?.title.localeCompare(b?.label, "en", { sensitivity: "base" }));

    return (
        <>
            <Grid container spacing={1} sx={{ padding: "8px" }}>
                {sortedPlayers.map((player) => (
                    <Grid key={player.id} size={{ xl: 3, lg: 4, md: 6, xs: 12 }}>
                        <PlayerCardEdit
                            handleDelete={deletePlayer}
                            handleEdit={() => onClickEdit(player)}
                            player={player}
                        />
                    </Grid>
                ))}
                <Grid size={{ xl: 3, lg: 4, md: 6, xs: 12 }}>
                    <AddCard handleClick={onClickAdd} />
                </Grid>
            </Grid>
        </>
    );
}
