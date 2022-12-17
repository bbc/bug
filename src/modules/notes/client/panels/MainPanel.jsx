import React from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import NoteCard from "./../components/NoteCard";
import Masonry from "@mui/lab/Masonry";
import { useSelector } from "react-redux";
import { useApiPoller } from "@hooks/ApiPoller";

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const users = useApiPoller({
        url: `/api/user`,
        interval: 5000,
    });

    const getUser = (userId) => {
        if (Array.isArray(users.data)) {
            for (let user of users.data) {
                if (userId === user.id) {
                    return user;
                }
            }
        }
    };

    const getNotesCards = (notes) => {
        const cards = [];
        for (let noteId in notes) {
            const user = getUser(notes?.[noteId]?.user);
            cards.push(
                <NoteCard key={noteId} user={user} panelId={params?.panelId} noteId={noteId} note={notes[noteId]} />
            );
        }
        return cards;
    };

    if (panelConfig.status === "loading" || users.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success" || users.status !== "success") {
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
