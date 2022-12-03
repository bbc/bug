import React, { useState } from "react";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextEditor from "./TextEditor";
import TextViewer from "./TextViewer";
import AxiosPut from "@utils/AxiosPut";
import Typography from "@mui/material/Typography";
import { formatDistanceToNow } from "date-fns";
import { useAlert } from "@utils/Snackbar";

export default function NoteCard({ note, noteId, panelId }) {
    const [edit, setEdit] = useState(false);
    const sendAlert = useAlert();

    const handleNoteUpdate = async (data) => {
        if (await AxiosPut(`/container/${panelId}/notes/${noteId}`, { data: data })) {
            sendAlert(`Updated note`, {
                variant: "success",
            });
            setEdit(false);
        } else {
            sendAlert(`Failed to update note`, { variant: "error" });
        }
    };

    const getEditor = () => {
        if (edit) {
            return (
                <TextEditor
                    panelId={panelId}
                    color={note?.color}
                    noteId={noteId}
                    data={note?.data}
                    onSave={handleNoteUpdate}
                />
            );
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
        return " ";
    };

    const getEditButton = () => {
        if (!edit) {
            return (
                <CardActionArea>
                    <Button onClick={() => setEdit(true)} size="small" color="primary">
                        Edit
                    </Button>
                </CardActionArea>
            );
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
                    backgroundColor: () => {
                        if (note?.color) {
                            return note?.color;
                        }
                        return "secondary";
                    },
                }}
                variant="outlined"
            >
                <CardContent>
                    {getEditor()}
                    <Typography textAlign="right" variant="caption">
                        {getTime()}
                    </Typography>
                </CardContent>

                {getEditButton()}
            </Card>
        </>
    );
}
