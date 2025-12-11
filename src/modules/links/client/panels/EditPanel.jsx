import BugLoading from "@core/BugLoading";
import Grid from "@mui/material/Grid";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddCard from "../components/AddCard";
import EditLinkCard from "../components/EditLinkCard";
import AddDialog from "./../components/AddDialog";

export default function EditPanel() {
    const params = useParams();
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);

    const deleteLink = async (index) => {
        const updatedLinks = Object.assign([], panelConfig.data.links);
        updatedLinks.splice(index, 1);
        const response = await AxiosPut(`/api/panelconfig/${params?.panelId}`, { links: updatedLinks });
        if (response) {
            sendAlert(`Deleted link to ${panelConfig.data.links[index].title}`, { variant: "success" });
        } else {
            sendAlert(`Could not delete link to ${panelConfig.data.links[index].title}`, { variant: "error" });
        }
    };

    const createLink = async (link) => {
        const updatedLinks = Object.assign([], panelConfig.data.links);
        updatedLinks.push(link);
        const response = await AxiosPut(`/api/panelconfig/${params?.panelId}`, { links: updatedLinks });
        setCurrentIndex(null);
        if (response) {
            sendAlert(`Created link to ${link.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not create link to ${link.title}`, { variant: "error" });
        }
    };

    const updateLink = async (link, index) => {
        const updatedLinks = Object.assign([], panelConfig.data.links);
        updatedLinks[index] = link;
        const response = await AxiosPut(`/api/panelconfig/${params?.panelId}`, { links: updatedLinks });
        setCurrentIndex(null);
        if (response) {
            sendAlert(`Updated link to ${link.title}`, { variant: "success" });
        } else {
            sendAlert(`Could not update link to ${link.title}`, { variant: "error" });
        }
    };

    const onClickAdd = (index) => {
        setDialogOpen(true);
        if (index) {
            setCurrentIndex(index);
        } else {
            setCurrentIndex(null);
        }
    };

    const onDismiss = () => {
        setDialogOpen(false);
        setCurrentIndex(null);
    };

    const getLinkCards = (links) => {
        const cards = [];
        for (let index in links) {
            cards.push(
                <Grid item key={index} size={{ lg: 6, xs: 12 }}>
                    <EditLinkCard handleDelete={deleteLink} handleEdit={onClickAdd} link={links[index]} index={index} />
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
            <AddDialog
                index={currentIndex}
                defaultData={panelConfig.data.links[currentIndex]}
                open={dialogOpen}
                onDismiss={onDismiss}
                onEdit={updateLink}
                onCreate={createLink}
            />
            <Grid container spacing={1}>
                {getLinkCards(panelConfig.data.links)}
                <Grid item size={{ xs: 12, lg: 6 }}>
                    <AddCard handleClick={onClickAdd} />
                </Grid>
            </Grid>
        </>
    );
}
