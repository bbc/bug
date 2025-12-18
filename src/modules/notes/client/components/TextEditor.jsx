import { Stack } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const TextEditor = forwardRef(({ data }, ref) => {
    const quillRef = useRef(null);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        getContent: () => {
            const editor = quillRef.current.getEditor();
            return editor.root.innerHTML;
        },
        setContent: (value) => {
            const editor = quillRef.current.getEditor();
            editor.root.innerHTML = value;
        },
    }));

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
        <Stack
            spacing={1}
            sx={{
                ".ql-toolbar": { borderRadius: "4px 4px 0 0" },
                ".ql-container": { borderRadius: "0 0 4px 4px" },
                ".ql-container.ql-snow": { border: "1px solid #3c3c3c" },
                ".ql-toolbar.ql-snow": { border: "1px solid #3c3c3c", borderBottom: "none" },
            }}
        >
            <ReactQuill ref={quillRef} theme="snow" defaultValue={data} modules={modules} />
        </Stack>
    );
});

export default TextEditor;
