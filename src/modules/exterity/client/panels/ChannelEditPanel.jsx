import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { Button, Grid } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

export default function ChannelPanel({ panelId }) {
    const { channelId } = useParams();

    const navigate = useNavigate();
    const [channel, setChannel] = React.useState(null);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        setChannel(await AxiosGet(`/container/${panelId}/channels/${channelId}`));
    }, []);

    const handleCancelClicked = () => {
        navigate(-1);
    };

    const groups = useApiPoller({
        url: `/container/${panelId}/groups`,
        interval: 30000,
    });

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
        const response = await AxiosPut(`/container/${panelId}/channels/${channelId}`, form);
        if (response) {
            sendAlert(`Channel has been updated.`, { broadcast: "true", variant: "success" });
            navigate(-1);
        } else {
            sendAlert(`Channel could not be updated.`, { variant: "warning" });
        }
    };

    if (groups.status === "loading" || groups.status === "idle" || channel === null) {
        return <BugLoading />;
    }

    return (
        <>
            <BugForm onClose={handleCancelClicked}>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <BugForm.Header onClose={handleCancelClicked}>Edit Channel</BugForm.Header>
                    <BugForm.Body>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="title"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.title}
                                    defaultValue={channel?.title}
                                    label="Title"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="number"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.number}
                                    defaultValue={channel?.number}
                                    type="number"
                                    label="Number"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormSelect
                                    name="protocol"
                                    control={control}
                                    fullWidth
                                    error={errors?.protocol}
                                    defaultValue={channel?.protocol}
                                    rules={{ required: true }}
                                    label="Protocol"
                                    options={[
                                        { label: "RTP", id: "rtp" },
                                        { label: "UDP", id: "udp" },
                                    ]}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="address"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors?.address}
                                    defaultValue={channel?.address}
                                    label="Address"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="port"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.port}
                                    type="number"
                                    defaultValue={channel?.port}
                                    label="Port"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <BugConfigFormAutocomplete
                                    name="groups"
                                    label="Groups"
                                    control={control}
                                    defaultValue={channel?.groups}
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
                            Save
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
