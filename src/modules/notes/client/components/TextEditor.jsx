import React from "react";
import MUIRichTextEditor from "mui-rte";
import DeleteIcon from "@mui/icons-material/Delete";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";

const defaultChange = (data) => {
    console.log(data);
};

export default function TextEditor({ data, onSave = { defaultChange }, panelId, noteId }) {
    const sendAlert = useAlert();

    return (
        <>
            <MUIRichTextEditor
                readOnly={false}
                onSave={onSave}
                defaultValue={data}
                label="Your notes here"
                inlineToolbar={false}
                toolbar={true}
                toolbarButtonSize="small"
                controls={[
                    "title",
                    "bold",
                    "underline",
                    "italic",
                    "link",
                    "clear",
                    "undo",
                    "redo",
                    "bulletList",
                    "numberList",
                    "color",
                    "delete",
                    "save",
                ]}
                customControls={[
                    {
                        name: "delete",
                        icon: <DeleteIcon />,
                        type: "callback",
                        onClick: async (editorState, name, anchor) => {
                            if (await AxiosDelete(`/container/${panelId}/notes/${noteId}`)) {
                                sendAlert(`Deleted note`, {
                                    variant: "success",
                                });
                                setEdit(false);
                            } else {
                                sendAlert(`Failed to delete note`, { variant: "error" });
                            }
                        },
                    },
                ]}
            />
        </>
    );
}
