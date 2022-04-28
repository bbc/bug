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
    const [currentIndex, setCurrentIndex] = useState(null);

    const deleteLink = async (index) => {
        const updatedLinks = Object.assign([], panelConfig.data.links);
        updatedLinks.splice(index, 1);
        const response = await AxiosPut(`/api/panelconfig/${params?.panelId}`, { links: updatedLinks });
    };

    const createLink = async (link) => {
        const updatedLinks = Object.assign([], panelConfig.data.links);
        updatedLinks.push(link);
        const response = await AxiosPut(`/api/panelconfig/${params?.panelId}`, { links: updatedLinks });
        setCurrentIndex(null);
    };

    const updateLink = async (link, index) => {
        const updatedLinks = Object.assign([], panelConfig.data.links);
        updatedLinks[index] = link;
        const response = await AxiosPut(`/api/panelconfig/${params?.panelId}`, { links: updatedLinks });
        setCurrentIndex(null);
    };

    const onClickAdd = (index) => {
        setDialogOpen(true);
        if (index) {
            setCurrentIndex(index);
        }
    };

    const onDismiss = () => {
        setDialogOpen(false);
        setCurrentIndex(null);
    };

    const getDialogData = () => {
        if (currentIndex) {
            return panelConfig.data.links[currentIndex];
        }
        return null;
    };

    const getLinkCards = (links) => {
        const cards = [];
        for (let index in links) {
            cards.push(
                <Grid item key={index} lg={6} xs={12}>
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
                <Grid item lg={6} xs={12}>
                    <AddCard handleClick={onClickAdd} />
                </Grid>
            </Grid>
        </>
    );
}
