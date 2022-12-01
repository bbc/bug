import React, { useState } from "react";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextEditor from "./TextEditor";
import TextViewer from "./TextViewer";
import AxiosPut from "@utils/AxiosPut";
import AxiosDelete from "@utils/AxiosDelete";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { formatDistanceToNow } from "date-fns";

export default function NoteCard({ note, noteId, panelId }) {
    const [edit, setEdit] = useState(false);

    const handleNoteUpdate = async (data) => {
        const response = await AxiosPut(`/container/${panelId}/notes/${noteId}`, { data: data });
        if (response) {
            setEdit(false);
        }
    };

    const handleNoteDelete = async (data) => {
        const response = await AxiosDelete(`/container/${panelId}/notes/${noteId}`);
    };

    const getEditor = () => {
        if (edit) {
            return <TextEditor data={note?.data} onSave={handleNoteUpdate} />;
        }
        return <TextViewer data={note?.data} />;
    };

    const getTime = () => {
        if (note.lastUpdated) {
            {
                return formatDistanceToNow(new Date(note?.lastUpdated), {
                    includeSeconds: true,
                    addSuffix: true,
                });
            }
        }
    };

    return (
        <>
            <Card
                sx={{
                    borderRadius: "3px",
                    minWidth: "30vw",
                    minheight: "30vw",
                    margin: "2px",
                }}
                variant="outlined"
                color="secondary"
            >
                <CardContent>
                    {getEditor()}
                    <Typography textAlign="right" variant="caption">
                        {getTime()}
                    </Typography>
                </CardContent>

                <CardActionArea>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={() => setEdit(true)} size="small" color="primary">
                            Edit
                        </Button>

                        <Button onClick={handleNoteDelete} size="small" color="primary">
                            Delete
                        </Button>
                    </Stack>
                </CardActionArea>
            </Card>
        </>
    );
}
