import BugCodecAutocomplete from "@core/BugCodecAutocomplete";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import { Button, Grid } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

export default function PeerAdd({ panelId }) {
    const navigate = useNavigate();
    const [profileLabels, setProfileLabels] = React.useState(null);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        setProfileLabels(await AxiosGet(`/container/${panelId}/profile/labels`));
    }, []);

    const handleCancelClicked = () => {
        navigate(-1);
    };

    const { handleSubmit, control, formState, setValue } = useForm();

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
            navigate(`/panel/${panelId}/`);
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
                            <Grid size={{ xs: 12 }}>
                                <BugCodecAutocomplete
                                    apiUrl={`/container/${panelId}/codecdb`}
                                    capability="comrex"
                                    variant="standard"
                                    onChange={(event, codec) => {
                                        setValue("name", codec.label);
                                        setValue("addr", `${codec.address}:${codec.port}`);
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="name"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.name}
                                    defaultValue=""
                                    label="Name"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="addr"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.addr}
                                    defaultValue=""
                                    label="IP address and port"
                                />
                            </Grid>
                            {profileLabels && (
                                <Grid size={{ xs: 12 }}>
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
