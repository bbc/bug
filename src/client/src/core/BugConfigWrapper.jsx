import { useHistory } from "react-router-dom";
import React from "react";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function BugConfigWrapper({ panelId, children, config, handleSubmit }) {
    const history = useHistory();
    const sendAlert = useAlert();

    const onCancel = () => {
        history.goBack();
    };

    const onSubmit = async (form) => {
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
            <BugForm onClose={onCancel}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <BugForm.Header onClose={onCancel}>Configuration</BugForm.Header>
                    <BugForm.Body>
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
                    </BugForm.Body>
                    <BugForm.Actions>
                        <Button variant="contained" color="secondary" disableElevation onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            Save Changes
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
