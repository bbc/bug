import BugForm from "@core/BugForm";
import Editor from "@monaco-editor/react";
import CodeIcon from "@mui/icons-material/Code";
import { Box, Button, Grid, IconButton } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BugConfigWrapper({ children, config, handleSubmit = () => {} }) {
    const navigate = useNavigate();
    const sendAlert = useAlert();

    const [editorMode, setEditorMode] = useState(false);
    const [editorText, setEditorText] = useState("");
    const [editorJson, setEditorJson] = useState(config);
    const [jsonError, setJsonError] = useState(null);

    // Initialize editor with current config
    useEffect(() => {
        const pretty = JSON.stringify(config, null, 2);
        setEditorText(pretty);
        setEditorJson(config);
        setJsonError(null);
    }, [config]);

    const onCancel = () => navigate(-1);

    const handleEditorMode = () => setEditorMode(!editorMode);

    const handleEditorChange = (value) => {
        setEditorText(value);
        try {
            const parsed = JSON.parse(value);
            setEditorJson(parsed);
            setJsonError(null);
        } catch (err) {
            setJsonError(err.message);
        }
    };

    const getBody = () => {
        if (editorMode) {
            return (
                <>
                    <Editor
                        height="400px"
                        defaultLanguage="json"
                        theme="vs-dark"
                        value={editorText}
                        onChange={handleEditorChange}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                            tabSize: 2,
                            scrollBeyondLastLine: false,
                        }}
                    />
                    {jsonError && (
                        <Box sx={{ color: "#f44336", margin: 1, marginBottom: 0 }}>Invalid JSON: {jsonError}</Box>
                    )}
                </>
            );
        }

        return (
            <Grid container spacing={4}>
                {children}
            </Grid>
        );
    };

    const onSubmit = async (form) => {
        const response = await AxiosPut(`/api/panelconfig/${config?.id}`, form);
        if (!response?.error) {
            sendAlert(`${config?.title} has been updated.`, {
                broadcast: "true",
                variant: "success",
            });
            navigate(-1);
        } else {
            sendAlert(`${config?.title} could not be updated.`, {
                variant: "warning",
            });
        }
    };

    return (
        <BugForm
            onClose={onCancel}
            iconButtons={
                <IconButton
                    aria-label="toggle editor"
                    sx={{
                        color: editorMode ? "primary.main" : "grey.A500",
                        padding: "14px",
                    }}
                    onClick={handleEditorMode}
                >
                    <CodeIcon />
                </IconButton>
            }
            sx={{
                maxWidth: "800px",
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <BugForm.Header onClose={onCancel}>Configuration</BugForm.Header>

                <BugForm.Body>{getBody()}</BugForm.Body>

                <BugForm.Actions>
                    <Button variant="contained" color="secondary" disableElevation onClick={onCancel}>
                        Cancel
                    </Button>

                    <Button
                        type={editorMode ? "button" : "submit"}
                        variant="contained"
                        color="primary"
                        disableElevation
                        disabled={editorMode && !!jsonError}
                        onClick={editorMode ? () => onSubmit(editorJson) : undefined}
                    >
                        Save Changes
                    </Button>
                </BugForm.Actions>
            </form>
        </BugForm>
    );
}
