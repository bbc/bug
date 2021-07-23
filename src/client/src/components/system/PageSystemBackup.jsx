import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAlert } from "@utils/Snackbar";
import Grid from "@material-ui/core/Grid";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import LoadingOverlay from "@components/LoadingOverlay";
import AxiosPost from "@utils/AxiosPost";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
    card: {
        minWidth: 300,
        textAlign: "left",
        color: theme.palette.text.secondary,
        position: "relative",
        maxWidth: "70rem",
    },
}));

export default function PageSystemBackup() {
    const classes = useStyles();
    const sendAlert = useAlert();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const onSubmit = async (form) => {
        const formData = new FormData();
        formData.append("backup", form.file[0]);

        setLoading(true);
        const response = await AxiosPost(`/api/system/restore`, formData);
        if (!response?.status === "success") {
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
            <Grid container spacing={4}>
                <Grid item lg={6} xs={12}>
                    <Card className={classes.card}>
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
                    </Card>
                </Grid>

                <Grid item lg={6} xs={12}>
                    <Card className={classes.card}>
                        <CardHeader component={Paper} square elevation={1} title="Restore" />
                        <CardContent>
                            Upload a backup file to restore a previous BUG configuration.
                            <div style={{ marginTop: 16 }}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Button
                                        color="primary"
                                        disableElevation
                                        underline="none"
                                        error={errors?.file ? true : false}
                                        variant="outlined"
                                        component="label"
                                    >
                                        Select File
                                        <input
                                            {...register("file", { required: true })}
                                            type="file"
                                            name="file"
                                            hidden
                                        />
                                    </Button>

                                    <Button
                                        type="submit"
                                        color="primary"
                                        disableElevation
                                        underline="none"
                                        variant="outlined"
                                    >
                                        Restore
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
