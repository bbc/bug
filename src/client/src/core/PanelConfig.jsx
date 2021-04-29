import { useHistory } from "react-router-dom";
import React from "react";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import PanelForm from "@core/PanelForm";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

export default function PanelConfig({ panelId, children, config, handleSubmit }) {
    const history = useHistory();
    const sendAlert = useAlert();

    const onCancel = () => {
        history.goBack();
    };

    const onSubmit = async (form) => {
        const response = await AxiosPut(`/api/panel/config/${config?.id}`, form);
        if (!response?.error) {
            sendAlert(`${config?.title} has been updated.`, { broadcast: true, variant: "success" });
            history.goBack();
        } else {
            sendAlert(`${config?.title} could not be updated.`, { variant: "warning" });
        }
    };

    return (
        <>
            <PanelForm onClose={onCancel}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PanelForm.Header onClose={onCancel}>Configuration</PanelForm.Header>
                    <PanelForm.Body>
                        <Grid container spacing={4}>
                            {children}
                        </Grid>
                    </PanelForm.Body>
                    <PanelForm.Actions>
                        <Button variant="contained" color="secondary" disableElevation onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            Save Changes
                        </Button>
                    </PanelForm.Actions>
                </form>
            </PanelForm>
        </>
    );
}
