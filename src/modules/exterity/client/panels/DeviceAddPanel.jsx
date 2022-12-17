import React from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "@utils/Snackbar";
import { useForm } from "react-hook-form";
import { useApiPoller } from "@hooks/ApiPoller";

import AxiosPost from "@utils/AxiosPost";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugLoading from "@core/BugLoading";
import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";

export default function DevicePanel({ panelId }) {
    const history = useHistory();
    const sendAlert = useAlert();

    const groups = useApiPoller({
        url: `/container/${panelId}/groups`,
        interval: 30000,
    });

    const handleCancelClicked = () => {
        history.goBack();
    };

    const { handleSubmit, control, formState } = useForm();

    const getErrors = () => {
        const errors = {};

        for (const [field] of Object.entries(formState.errors)) {
            errors[field] = true;
        }

        return errors;
    };

    const errors = getErrors();

    const onSubmit = async (form) => {
        const response = await AxiosPost(`/container/${panelId}/devices`, form);
        if (response) {
            sendAlert(`Device has been added.`, { broadcast: "true", variant: "success" });
            history.goBack();
        } else {
            sendAlert(`Device could not be added.`, { variant: "warning" });
        }
    };

    if (groups.status === "loading" || groups.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <BugForm onClose={handleCancelClicked}>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <BugForm.Header onClose={handleCancelClicked}>Add Device</BugForm.Header>
                    <BugForm.Body>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="address"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.address}
                                    label="Address"
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <BugConfigFormTextField
                                    name="username"
                                    control={control}
                                    rules={{ required: false }}
                                    fullWidth
                                    error={errors.username}
                                    label="Username"
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <BugConfigFormPasswordTextField
                                    name="password"
                                    control={control}
                                    rules={{ required: false }}
                                    fullWidth
                                    error={errors?.password}
                                    label="Password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BugConfigFormAutocomplete
                                    name="groups"
                                    label="Groups"
                                    control={control}
                                    options={groups?.data}
                                    error={errors?.groups}
                                    freeSolo={true}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </BugForm.Body>
                    <BugForm.Actions>
                        <Button variant="contained" color="secondary" disableElevation onClick={handleCancelClicked}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            Add
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
