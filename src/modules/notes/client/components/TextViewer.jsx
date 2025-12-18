import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function TextEditor({ data }) {
    return <ReactQuill value={data} readOnly={true} theme="bubble" modules={{ toolbar: false }} />;
}
