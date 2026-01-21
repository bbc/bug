import LoadingOverlay from "@components/LoadingOverlay";
import BugCard from "@core/BugCard";
import { Box, Button, CardContent, CardHeader, Grid, Input, Link, Paper } from "@mui/material";
import pageTitleSlice from "@redux/pageTitleSlice";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [filename, setFilename] = React.useState("");

    const { register, handleSubmit } = useForm({});

    const onSubmit = async (form) => {
        const formData = new FormData();
        formData.append("backup", form.file[0]);
        setLoading(true);
        const response = await AxiosPost(`/api/system/restore`, formData);
        if (response) {
            sendAlert(`BUG configuration has been restored`, {
                broadcast: "true",
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
            <Grid
                container
                spacing={1}
                sx={{
                    justifyContent: "center",
                }}
            >
                <Grid size={{ xs: 12, lg: 8 }}>
                    <BugCard>
                        <CardHeader component={Paper} square elevation={1} title="Backup" />
                        <CardContent>
                            You can download the entire configuration of this BUG as a single, compressed file.
                            <Box sx={{ marginTop: "16px" }}>
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
                            </Box>
                        </CardContent>
                    </BugCard>
                </Grid>

                <Grid size={{ xs: 12, lg: 8 }}>
                    <BugCard>
                        <CardHeader component={Paper} square elevation={1} title="Restore" />
                        <CardContent>
                            Upload a backup file to restore a previous BUG configuration.
                            <div style={{ marginTop: 16 }}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={4}>
                                        <Grid size={{ xs: 12, lg: 6 }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "rows",
                                                }}
                                            >
                                                <label htmlFor="contained-button-file">
                                                    <Input
                                                        sx={{ display: "none" }}
                                                        accept="image/*"
                                                        id="contained-button-file"
                                                        multiple
                                                        onChange={(event) => {
                                                            const filename = event.target.value.replace(/^.*\\/, "");
                                                            setFilename(filename);
                                                        }}
                                                        type="file"
                                                        inputProps={{
                                                            ...{ accept: "application/gzip" },
                                                            ...register("file", { required: true }),
                                                        }}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{
                                                            width: "6rem",
                                                            height: "36px",
                                                        }}
                                                        component="span"
                                                    >
                                                        Select
                                                    </Button>
                                                </label>
                                                <Box
                                                    sx={{
                                                        padding: "8px",
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                    {filename ? filename : "No file selected"}
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12, lg: 6 }}>
                                            <Button
                                                type="submit"
                                                color="primary"
                                                disableElevation
                                                underline="none"
                                                variant="outlined"
                                                disabled={!filename}
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
