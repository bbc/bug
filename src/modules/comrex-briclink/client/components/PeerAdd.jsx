import { useHistory } from "react-router-dom";
import React from "react";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import { useForm } from "react-hook-form";

export default function PeerAdd({ panelId }) {
    const history = useHistory();
    const [profileLabels, setProfileLabels] = React.useState(null);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        setProfileLabels(await AxiosGet(`/container/${panelId}/profile/labels`));
    }, []);

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
        const response = await AxiosPost(`/container/${panelId}/peer/add`, form);
        if (response) {
            sendAlert(`Connection has been added.`, { broadcast: "true", variant: "success" });
            history.push(`/panel/${panelId}/connection/`);
        } else {
            sendAlert(`Connection could not be added.`, { variant: "warning" });
        }
    };

    return (
        <>
            <BugForm onClose={handleCancelClicked}>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <BugForm.Header onClose={handleCancelClicked}>Add Connection</BugForm.Header>
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
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="name"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.name}
                                    label="Name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="addr"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.addr}
                                    label="IP address and port"
                                />
                            </Grid>
                            {profileLabels && (
                                <Grid item xs={12}>
                                    <BugConfigFormSelect
                                        name="profile"
                                        rules={{ required: true }}
                                        label="Profile"
                                        control={control}
                                        defaultValue={null}
                                        error={errors.profile}
                                        fullWidth
                                        options={profileLabels}
                                    />
                                </Grid>
                            )}
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
