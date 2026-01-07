import { Button, Card, CardContent, Stack, TextField } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import TextEditor from "./TextEditor";

export default function NoteCard({ note, noteId, panelId, onSave }) {
    const sendAlert = useAlert();
    const currentUser = useSelector((state) => state.user);
    const editorRef = useRef(null);
    const [title, setTitle] = useState(note.title || "");

    const handleNoteUpdate = async () => {
        if (!editorRef.current) return;
        const content = editorRef.current.getContent();

        const request = { data: content, user: currentUser?.data?.id ?? null, title: title };

        if (await AxiosPut(`/container/${panelId}/notes/${noteId}`, request)) {
            sendAlert(`Updated note`, { variant: "success" });
            onSave();
        } else {
            sendAlert(`Failed to update note`, { variant: "error" });
        }
    };

    return (
        <Card
            sx={{
                borderRadius: "3px",
                minWidth: "30vw",
                margin: "2px",
                marginBottom: "12px",
                backgroundColor: note?.color ? note?.color : "background.paper",
            }}
            variant="outlined"
        >
            <CardContent sx={{ "&:last-child": { paddingBottom: "16px", paddingTop: "10px" } }}>
                <TextField
                    placeholder="Note title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 1 }}
                />
                <TextEditor ref={editorRef} data={note?.data} onCancel={onSave} />
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button variant="contained" color="secondary" onClick={onSave}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleNoteUpdate}>
                        Save
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
