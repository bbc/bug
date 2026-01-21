import BugAvatar from "@core/BugAvatar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import TextViewer from "./TextViewer";

export default function NoteView({ user, note, noteId, panelId, onEdit }) {
    const sendAlert = useAlert();
    const currentUser = useSelector((state) => state.user);

    const handleDelete = async () => {
        if (await AxiosDelete(`/container/${panelId}/notes/${noteId}`)) {
            sendAlert(`Deleted note`, { variant: "success" });
        } else {
            sendAlert(`Failed to delete note`, { variant: "error" });
        }
    };

    const handleEdit = () => {
        if (onEdit) onEdit();
    };

    const getTime = () => {
        if (note.lastUpdated) {
            {
                return (
                    <>
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

    return (
        <>
            <Card
                sx={{
                    borderRadius: "3px",
                    minWidth: "30vw",
                    minheight: "30vw",
                    margin: "2px",
                    marginBottom: "12px",
                    backgroundColor: note?.color ? note?.color : "background.paper",
                }}
                variant="outlined"
            >
                <CardContent
                    sx={{
                        "&:last-child": { paddingBottom: "16px", paddingTop: "10px" },
                    }}
                >
                    <Stack
                        sx={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6">{note.title ?? "NOTE"}</Typography>

                        <Box>
                            <IconButton onClick={handleEdit}>
                                <EditIcon color="primary" />
                            </IconButton>
                            <IconButton onClick={handleDelete}>
                                <DeleteIcon color="primary" />
                            </IconButton>
                        </Box>
                    </Stack>
                    <Box sx={{ ".ql-editor": { padding: "1rem 0" } }}>
                        <TextViewer data={note?.data} />
                    </Box>

                    <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center" sx={{ mt: 1 }}>
                        {user && <BugAvatar email={user?.email} name={user?.name} />}
                        <Typography textAlign="right" variant="caption">
                            {getTime()}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}
