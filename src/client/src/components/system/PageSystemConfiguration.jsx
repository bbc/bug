import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoadingOverlay from "@components/LoadingOverlay";
import AxiosPut from "@utils/AxiosPut";
import { useApiPoller } from "@utils/ApiPoller";
import pageTitleSlice from "@redux/pageTitleSlice";
import { useAlert } from "@utils/Snackbar";
import Loading from "@components/Loading";
import BugForm from "@core/BugForm";
import Button from "@mui/material/Button";

import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Backup & Restore"));
    }, [dispatch]);

    const settings = useApiPoller({
        url: `/api/system/settings`,
        interval: 5000,
    });

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPut(`/api/system/settings`, form);
        if (!response?.error) {
            sendAlert(`BUG Settings have been updated`, {
                broadcast: true,
                variant: "success",
            });
        } else {
            sendAlert(`Failed to update BUG settings`, {
                variant: "warning",
            });
        }
        setLoading(false);
    };

    const renderLoading = () => {
        if (loading) {
            return <LoadingOverlay />;
        }
        return null;
    };

    const handleCancel = () => {
        history.goBack();
    };

    if (settings.status === "loading" || settings.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            {renderLoading()}
            <BugForm onClose={handleCancel}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <BugForm.Header onClose={handleCancel}>Edit Settings</BugForm.Header>
                    <BugForm.Body>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{
                                        ...register("title", {
                                            required: true,
                                        }),
                                    }}
                                    fullWidth
                                    defaultValue={settings?.data?.title}
                                    error={errors?.title ? true : false}
                                    type="text"
                                    label="Title"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{
                                        ...register("description"),
                                    }}
                                    fullWidth
                                    defaultValue={settings?.data?.description}
                                    error={errors?.description ? true : false}
                                    type="text"
                                    label="Description"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    select
                                    inputProps={{
                                        ...register("theme"),
                                    }}
                                    fullWidth
                                    label="Theme"
                                    defaultValue={settings?.data?.theme}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value={"dark"}>Dark</option>
                                    <option value={"light"}>Light</option>
                                </TextField>
                            </Grid>
                        </Grid>
                    </BugForm.Body>
                    <BugForm.Actions>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            Save changes
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
