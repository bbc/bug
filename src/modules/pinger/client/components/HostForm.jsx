import React from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "@utils/Snackbar";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import BugForm from "@core/BugForm";
import Button from "@mui/material/Button";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugConfigFormTextField from "@core/BugConfigFormTextField";

import AxiosPost from "@utils/AxiosPost";
import AxiosPut from "@utils/AxiosPut";

export default function HostCard({ panelId, hostId }) {
    const history = useHistory();
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const getVerb = () => {
        if (hostId) {
            return "Edit";
        }
        return "Add";
    };

    const handleCancelClicked = () => {
        history.goBack();
    };

    const createHost = async (host) => {
        const response = await AxiosPost(`/container/${panelId}/hosts`, host);
        if (response) {
            sendAlert(`Created host ${host.title}`, { variant: "success" });
            history.goBack();
        } else {
            sendAlert(`Could not create host ${host.title}`, { variant: "error" });
        }
    };

    const updateHost = async (host, hostId) => {
        const response = await AxiosPut(`/container/${panelId}/hosts/${hostId}`, host);
        if (response) {
            sendAlert(`Updated host ${host.title}`, { variant: "success" });
            history.goBack();
        } else {
            sendAlert(`Could not update host ${host.title}`, { variant: "error" });
        }
    };

    const onSubmit = (form) => {
        //If new host
        if (!hostId) {
            createHost(form);
        } else {
            updateHost(form, hostId);
        }
    };

    if (panelConfig.status === "idle" || panelConfig.status === "loading") {
        return <BugLoading height="30vh" />;
    }

    if (!panelConfig.data.hosts[hostId] && hostId) {
        return <BugNoData title="Link not Found" showConfigButton={false} />;
    }

    return (
        <>
            <BugForm onClose={handleCancelClicked}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <BugForm.Header onClose={handleCancelClicked}>{getVerb()} Host</BugForm.Header>
                    <BugForm.Body>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="title"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.title}
                                    defaultValue={panelConfig?.data?.hosts?.[hostId]?.title}
                                    label="Title"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="description"
                                    control={control}
                                    rules={{ required: false }}
                                    fullWidth
                                    error={errors.description}
                                    defaultValue={panelConfig?.data?.hosts?.[hostId]?.description}
                                    label="Description"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="host"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.host}
                                    defaultValue={panelConfig?.data?.hosts?.[hostId]?.host}
                                    label="Host"
                                />
                            </Grid>
                        </Grid>
                    </BugForm.Body>
                    <BugForm.Actions>
                        <Button variant="contained" color="secondary" disableElevation onClick={handleCancelClicked}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            {getVerb()}
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
