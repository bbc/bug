import { useAlert } from "@utils/Snackbar";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AxiosPost from "@utils/AxiosPost";

export default function ChannelPanel({ panelId }) {
    const history = useHistory();
    const sendAlert = useAlert();

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
        const response = await AxiosPost(`/container/${panelId}/channels`, form);
        if (response) {
            sendAlert(`Channel has been added.`, { broadcast: "true", variant: "success" });
            history.goBack();
        } else {
            sendAlert(`Channel could add channel.`, { variant: "warning" });
        }
    };

    if (groups.status === "loading" || groups.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <BugForm onClose={handleCancelClicked}>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <BugForm.Header onClose={handleCancelClicked}>Add Channel</BugForm.Header>
                    <BugForm.Body>
                        <Grid container spacing={4}>
                            <Grid item size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="title"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.title}
                                    label="Title"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="number"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.number}
                                    type="number"
                                    label="Number"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <BugConfigFormSelect
                                    name="protocol"
                                    control={control}
                                    fullWidth
                                    error={errors?.protocol}
                                    rules={{ required: true }}
                                    label="Protocol"
                                    defaultValue="udp"
                                    options={[
                                        { label: "RTP", id: "rtp" },
                                        { label: "UDP", id: "udp" },
                                    ]}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="address"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors?.address}
                                    label="Address"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="port"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.port}
                                    type="number"
                                    defaultValue={5004}
                                    label="Port"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
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
