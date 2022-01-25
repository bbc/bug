import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

export default function BugConfigWrapper({ panelId, children, config, handleSubmit }) {
    const history = useHistory();
    const [editorMode, setEditorMode] = useState(false);
    const [editorJson, setEditorJson] = useState(config);
    const sendAlert = useAlert();

    const onCancel = () => {
        history.goBack();
    };

    const onEditorMode = () => {
        const newEditorMode = editorMode;
        setEditorMode(!newEditorMode);
    };

    const onEditorChange = (editor) => {
        if (!editor.error) {
            setEditorJson(editor.jsObject);
        }
    };

    const getSaveButton = () => {
        if (editorMode) {
            return (
                <Button
                    onClick={() => {
                        onSubmit(editorJson);
                    }}
                    variant="contained"
                    color="primary"
                    disableElevation
                >
                    Save Changes
                </Button>
            );
        }
        return (
            <Button type="submit" variant="contained" color="primary" disableElevation>
                Save Changes
            </Button>
        );
    };

    const getBody = () => {
        if (editorMode) {
            return (
                <JSONInput
                    id="json_editor"
                    onChange={onEditorChange}
                    placeholder={config}
                    colors={{ background: "#262626" }}
                    locale={locale}
                    height="auto"
                    width="auto"
                />
            );
        }
        return (
            <Grid
                container
                spacing={4}
                sx={{
                    "& .MuiFormControl-root .MuiFormHelperText-root:not(.Mui-error)": {
                        color: "success.main",
                    },
                }}
            >
                {children}
            </Grid>
        );
    };

    const onSubmit = async (form) => {
        console.log(form);
        const response = await AxiosPut(`/api/panelconfig/${config?.id}`, form);
        if (!response?.error) {
            sendAlert(`${config?.title} has been updated.`, { broadcast: true, variant: "success" });
            history.goBack();
        } else {
            sendAlert(`${config?.title} could not be updated.`, { variant: "warning" });
        }
    };

    return (
        <>
            <BugForm onEditor={onEditorMode} onClose={onCancel}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <BugForm.Header onClose={onCancel}>Configuration</BugForm.Header>
                    <BugForm.Body>{getBody()}</BugForm.Body>
                    <BugForm.Actions>
                        <Button variant="contained" color="secondary" disableElevation onClick={onCancel}>
                            Cancel
                        </Button>
                        {getSaveButton()}
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
