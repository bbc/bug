import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LoadingOverlay from "@components/LoadingOverlay";
import AxiosPut from "@utils/AxiosPut";
import pageTitleSlice from "@redux/pageTitleSlice";
import settingsSlice from "@redux/settingsSlice";
import { useAlert } from "@utils/Snackbar";
import BugLoading from "@core/BugLoading";
import BugForm from "@core/BugForm";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import Button from "@mui/material/Button";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const settings = useSelector((state) => state.settings);
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({});

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Configuration"));
    }, [dispatch]);

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPut(`/api/system/settings`, form);
        if (!response?.error) {
            dispatch(settingsSlice.actions.success({ data: form }));
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
        return <BugLoading />;
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
                                <BugConfigFormTextField
                                    name="title"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    defaultValue={settings?.data?.title}
                                    error={errors?.title}
                                    label="Title"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="description"
                                    control={control}
                                    fullWidth
                                    defaultValue={settings?.data?.description}
                                    error={errors?.description}
                                    label="Description"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <BugConfigFormSelect
                                    name="theme"
                                    control={control}
                                    fullWidth
                                    label="Theme"
                                    defaultValue={settings?.data?.theme}
                                    options={[
                                        { id: "dark", label: "Dark" },
                                        { id: "light", label: "Light" },
                                    ]}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <BugConfigFormSelect
                                    name="logLevel"
                                    control={control}
                                    fullWidth
                                    label="Logging Level"
                                    defaultValue={settings?.data?.logLevel}
                                    options={[
                                        { id: "error", label: "Error" },
                                        { id: "warning", label: "Warning" },
                                        { id: "info", label: "Info" },
                                        { id: "http", label: "HTTP" },
                                        { id: "debug", label: "Debug" },
                                    ]}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <BugConfigFormAutocomplete
                                    name="moduleStatus"
                                    label="Module Status"
                                    control={control}
                                    defaultValue={settings.data.moduleStatus ? settings.data.moduleStatus : []}
                                    options={[
                                        { id: "stable", label: "Stable" },
                                        { id: "beta", label: "Beta" },
                                    ]}
                                    fullWidth
                                    helperText="What should be development status of a module before letting a user add it."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <BugConfigFormSwitch
                                    name="sound"
                                    control={control}
                                    label="Enable Sounds"
                                    defaultValue={settings?.data?.sound}
                                    fullWidth
                                    helperText="Enable tactile sounds"
                                />
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
