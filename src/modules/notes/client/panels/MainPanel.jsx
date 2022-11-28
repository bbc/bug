import React from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import NoteCard from "./../components/NoteCard";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const getNotesCards = (notes) => {
        const cards = [];
        for (let noteId in notes) {
            cards.push(
                <Grid key={noteId} item lg={6} xs={12}>
                    <NoteCard panelId={params?.panelId} noteId={noteId} note={notes[noteId]} />
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
            <Grid container spacing={1}>
                {getNotesCards(panelConfig.data.notes)}
            </Grid>
        </>
    );
}
