import React from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useAlert } from "@utils/Snackbar";
import { useForm } from "react-hook-form";
import { useApiPoller } from "@hooks/ApiPoller";

import AxiosPut from "@utils/AxiosPut";

import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import BugLoading from "@core/BugLoading";
import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormSelect from "@core/BugConfigFormSelect";

export default function ChannelPanel({ panelId }) {
    const { channelId } = useParams();

    const history = useHistory();
    const [channel, setChannel] = React.useState(null);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        setChannel(await AxiosGet(`/container/${panelId}/channels/${channelId}`));
    }, []);

    const handleCancelClicked = () => {
        history.goBack();
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
            history.goBack();
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
