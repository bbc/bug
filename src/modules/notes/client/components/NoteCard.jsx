import { useState } from "react";
import NoteEdit from "./NoteEdit";
import NoteView from "./NoteView";

export default function NoteCard({ user, note, noteId, panelId }) {
    const [isEditMode, setIsEditMode] = useState(false);

    if (isEditMode) {
        return <NoteEdit note={note} noteId={noteId} panelId={panelId} onSave={() => setIsEditMode(false)} />;
    }

    return <NoteView user={user} note={note} noteId={noteId} panelId={panelId} onEdit={() => setIsEditMode(true)} />;
}
