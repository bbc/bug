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
import BugCard from "@core/BugCard";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [filename, setFilename] = React.useState("");

    const {
        register,
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
                                        <Grid item lg={6} xs={12}>
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
