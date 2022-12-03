import React from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import NoteCard from "./../components/NoteCard";
import Masonry from "@mui/lab/Masonry";
import { useSelector } from "react-redux";

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const getNotesCards = (notes) => {
        const cards = [];
        for (let noteId in notes) {
            cards.push(<NoteCard key={noteId} panelId={params?.panelId} noteId={noteId} note={notes[noteId]} />);
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
            <Masonry columns={2} spacing={1}>
                {getNotesCards(panelConfig.data.notes)}
            </Masonry>
        </>
    );
}
