import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import EditLinkCard from "../components/EditLinkCard";
import AddCard from "../components/AddCard";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import AddDialog from "./../components/AddDialog";
import AxiosPut from "@utils/AxiosPut";

export default function EditPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentLink, setCurrentLink] = useState(null);

    const deleteLink = async (index) => {
        const updatedLinks = Object.assign([], panelConfig.data.links);
        updatedLinks.splice(index, 1);
        const response = await AxiosPut(`/api/panelconfig/${params?.panelId}`, { links: updatedLinks });
        console.log(response);
    };

    const onClickAdd = () => {
        setDialogOpen(true);
    };

    const onDismiss = () => {
        setDialogOpen(false);
    };

    const getLinkCards = (links) => {
        const cards = [];
        for (let index in links) {
            cards.push(
                <Grid item key={index} lg={6} xs={12}>
                    <EditLinkCard onDelete={deleteLink} onEdit={onClickAdd} link={links[index]} index={index} />
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
                links={panelConfig.data.links}
                panelId={params?.panelId}
                open={dialogOpen}
                onDismiss={onDismiss}
            />
            <Grid container spacing={1}>
                {getLinkCards(panelConfig.data.links)}
                <Grid item lg={6} xs={12}>
                    <AddCard onClick={onClickAdd} />
                </Grid>
            </Grid>
        </>
    );
}
