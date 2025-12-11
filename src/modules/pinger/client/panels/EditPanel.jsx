import BugLoading from "@core/BugLoading";
import Grid from "@mui/material/Grid";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddCard from "../components/AddCard";
import HostCardEdit from "../components/HostCardEdit";

export default function EditPanel() {
    const params = useParams();
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);

    const deleteHost = async (hostId) => {
        const response = await AxiosDelete(`/container/${params?.panelId}/hosts/${hostId}`);
        if (response) {
            sendAlert(`Deleted host  ${panelConfig.data.hosts[hostId].title}`, { variant: "success" });
        } else {
            sendAlert(`Could not delete host ${panelConfig.data.hosts[hostId].title}`, { variant: "error" });
        }
    };

    const getHostCards = (hosts) => {
        const cards = [];
        for (let hostId in hosts) {
            cards.push(
                <Grid item key={hostId} size={{ xl: 3, lg: 4, md: 6, xs: 12 }}>
                    <HostCardEdit
                        handleDelete={deleteHost}
                        host={hosts[hostId]}
                        hostId={hostId}
                        panelId={params?.panelId}
                    />
                </Grid>
            );
        }
        return cards;
    };

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <>
            <Grid container alignItems="stretch" spacing={1}>
                {getHostCards(panelConfig.data.hosts)}
                <Grid item key={"addDialog"} size={{ xl: 3, lg: 4, md: 6, xs: 12 }}>
                    <AddCard panelId={params?.panelId} />
                </Grid>
            </Grid>
        </>
    );
}
