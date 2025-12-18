import BugAvatar from "@core/BugAvatar";
import { Button, Card, CardContent, Stack, Tooltip, Typography } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useSelector } from "react-redux";
import TextEditor from "./TextEditor";
import TextViewer from "./TextViewer";
export default function NoteCard({ user, note, noteId, panelId }) {
    const [edit, setEdit] = useState(false);
    const sendAlert = useAlert();
    const currentUser = useSelector((state) => state.user);

    const handleNoteUpdate = async (data) => {
        const request = { data: data, user: null };

        if (currentUser) {
            request.user = currentUser?.data?.id;
        }

        if (await AxiosPut(`/container/${panelId}/notes/${noteId}`, request)) {
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
                return (
                    <>
                        last edited{" "}
                        {formatDistanceToNow(new Date(note?.lastUpdated), {
                            includeSeconds: true,
                            addSuffix: true,
                        })}
                    </>
                );
            }
        }
        return " ";
    };

    const getAvatar = () => {
        if (user) {
            return (
                <Tooltip title={user?.name}>
                    <BugAvatar {...user} />
                </Tooltip>
            );
        }
    };

    const getEditButton = () => {
        if (!edit) {
            return (
                <Button onClick={() => setEdit(true)} size="small" color="primary">
                    Edit
                </Button>
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
                    backgroundColor: note?.color ? note?.color : "background.paper",
                }}
                variant="outlined"
            >
                <CardContent>
                    {getEditor()}
                    <Stack direction="row-reverse" spacing={1}>
                        {getAvatar()}
                        <Typography textAlign="right" variant="caption">
                            {getTime()}
                        </Typography>
                    </Stack>
                </CardContent>
                {getEditButton()}
            </Card>
        </>
    );
}
