import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Stack } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TextEditor({ data, onSave, panelId, noteId }) {
    const quillRef = useRef(null);
    const sendAlert = useAlert();

    const handleSave = () => {
        const editor = quillRef.current.getEditor();
        const value = editor.root.innerHTML;
        if (onSave) onSave(value);
    };

    const handleDelete = async () => {
        if (await AxiosDelete(`/container/${panelId}/notes/${noteId}`)) {
            sendAlert(`Deleted note`, { variant: "success" });
        } else {
            sendAlert(`Failed to delete note`, { variant: "error" });
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    return (
        <Stack spacing={1}>
            <ReactQuill ref={quillRef} theme="snow" defaultValue={data} modules={modules} />
            <Stack direction="row" spacing={1}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
                    Delete
                </Button>
            </Stack>
        </Stack>
    );
}
