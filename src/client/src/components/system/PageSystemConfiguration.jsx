import LoadingOverlay from "@components/LoadingOverlay";
import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import BugLoading from "@core/BugLoading";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import pageTitleSlice from "@redux/pageTitleSlice";
import settingsSlice from "@redux/settingsSlice";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

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
            sendAlert(`BUG settings have been updated`, {
                broadcast: "true",
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
                    <BugForm.Header onClose={handleCancel}>Global Configuration</BugForm.Header>
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
                                    label="Filter Modules"
                                    control={control}
                                    defaultValue={settings.data.moduleStatus ? settings.data.moduleStatus : []}
                                    options={[
                                        { id: "stable", label: "Stable" },
                                        { id: "beta", label: "Beta" },
                                    ]}
                                    fullWidth
                                    helperText="Filter available modules by status tag"
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
