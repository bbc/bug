import React from "react";
import MUIRichTextEditor from "mui-rte";

export default function TextEditor({ data }) {
    return (
        <>
            <MUIRichTextEditor
                readOnly={true}
                defaultValue={data}
                inlineToolbar={false}
                toolbar={false}
                toolbarButtonSize="small"
            />
        </>
    );
}
