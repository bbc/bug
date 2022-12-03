import React from "react";
import MUIRichTextEditor from "mui-rte";
import DeleteIcon from "@mui/icons-material/Delete";
import AxiosDelete from "@utils/AxiosDelete";

const defaultChange = (data) => {
    console.log(data);
};

export default function TextEditor({ data, onSave = { defaultChange }, panelId, noteId }) {
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
                            const response = await AxiosDelete(`/container/${panelId}/notes/${noteId}`);
                        },
                    },
                ]}
            />
        </>
    );
}
