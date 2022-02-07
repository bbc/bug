import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAlert } from "@utils/Snackbar";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import LoadingOverlay from "@components/LoadingOverlay";
import AxiosPost from "@utils/AxiosPost";
import TextField from "@mui/material/TextField";
import BugConfigFormFileUpload from "@core/BugConfigFormFileUpload";
import BugCard from "@core/BugCard";

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const onSubmit = async (form) => {
        const formData = new FormData();
        formData.append("backup", form.file[0]);

        setLoading(true);
        const response = await AxiosPost(`/api/system/restore`, formData);
        if (response) {
            sendAlert(`BUG configuration has been restored`, {
                broadcast: true,
                variant: "success",
            });
        } else {
            sendAlert(`Failed to restore BUG settings`, {
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

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Backup & Restore"));
    }, [dispatch]);

    return (
        <>
            {renderLoading()}
            <Grid container spacing={1}>
                <Grid item lg={6} xs={12}>
                    <BugCard>
                        <CardHeader component={Paper} square elevation={1} title="Backup" />
                        <CardContent>
                            You can download the entire configuration of this BUG as a single, compressed file.
                            <div style={{ marginTop: 16 }}>
                                <Button
                                    component={Link}
                                    href={`/api/system/backup`}
                                    download
                                    underline="none"
                                    variant="outlined"
                                    color="primary"
                                    disableElevation
                                >
                                    Download
                                </Button>
                            </div>
                        </CardContent>
                    </BugCard>
                </Grid>

                <Grid item lg={6} xs={12}>
                    <BugCard>
                        <CardHeader component={Paper} square elevation={1} title="Restore" />
                        <CardContent>
                            Upload a backup file to restore a previous BUG configuration.
                            <div style={{ marginTop: 16 }}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={4}>
                                        <Grid item lg={6} xs={12}>
                                            <BugConfigFormFileUpload
                                                error={errors?.file}
                                                name="file"
                                                control={control}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item lg={6} xs={12}>
                                            <Button
                                                type="submit"
                                                color="primary"
                                                disableElevation
                                                underline="none"
                                                variant="outlined"
                                            >
                                                Restore
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </div>
                        </CardContent>
                    </BugCard>
                </Grid>
            </Grid>
        </>
    );
}
