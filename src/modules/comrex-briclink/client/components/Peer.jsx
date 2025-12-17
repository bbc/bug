import BugConfigFormDeleteButton from "@core/BugConfigFormDeleteButton";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import BugLoading from "@core/BugLoading";
import { Button, Grid } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosGet from "@utils/AxiosGet";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

export default function Peer({ panelId, peerId }) {
    const navigate = useNavigate();
    const [peer, setPeer] = React.useState(null);
    const [profileLabels, setProfileLabels] = React.useState(null);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        setPeer(await AxiosGet(`/container/${panelId}/peer/${peerId}`));
    }, []);

    useAsyncEffect(async () => {
        setProfileLabels(await AxiosGet(`/container/${panelId}/profile/labels`));
    }, []);

    const handleDeleteClicked = async () => {
        const response = await AxiosDelete(`/container/${panelId}/peer/${peerId}`);
        if (response) {
            sendAlert(`Connection has been deleted.`, { broadcast: "true", variant: "success" });
            navigate(-1);
        } else {
            sendAlert(`Connection could not be deleted.`, { variant: "warning" });
        }
    };

    const handleCancelClicked = () => {
        navigate(-1);
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
        const response = await AxiosPut(`/container/${panelId}/peer/${peerId}`, form);
        if (response) {
            sendAlert(`Connection has been updated.`, { broadcast: "true", variant: "success" });
            navigate(-1);
        } else {
            sendAlert(`Connection could not be updated.`, { variant: "warning" });
        }
    };

    if (peer === null) {
        return <BugLoading />;
    }

    return (
        <>
            <BugForm onClose={handleCancelClicked}>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <BugForm.Header onClose={handleCancelClicked}>Edit Connection</BugForm.Header>
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
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="name"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.name}
                                    defaultValue={peer.name}
                                    label="Name"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="addr"
                                    control={control}
                                    fullWidth
                                    error={errors.addr}
                                    defaultValue={peer.addr}
                                    label="IP address and port"
                                />
                            </Grid>
                            {profileLabels && (
                                <Grid size={{ xs: 12 }}>
                                    <BugConfigFormSelect
                                        name="profile"
                                        label="Profile"
                                        control={control}
                                        defaultValue={peer.profile}
                                        error={errors.profile}
                                        fullWidth
                                        options={profileLabels}
                                    />
                                </Grid>
                            )}
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormSwitch
                                    name="use_xlock"
                                    label="Use crosslock"
                                    control={control}
                                    defaultValue={peer.use_xlock}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </BugForm.Body>
                    <BugForm.Actions>
                        <BugConfigFormDeleteButton onClick={handleDeleteClicked} />
                        <Button variant="contained" color="secondary" disableElevation onClick={handleCancelClicked}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            Save
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
