import React from "react";
import MUIRichTextEditor from "mui-rte";

const defaultChange = (data) => {
    console.log(data);
};

export default function TextEditor({ data, onSave = { defaultChange } }) {
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
                    "save",
                ]}
            />
        </>
    );
}
