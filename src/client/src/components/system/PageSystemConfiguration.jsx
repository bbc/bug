import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import LoadingOverlay from "@components/LoadingOverlay";
import AxiosPut from "@utils/AxiosPut";
import { useApiPoller } from "@utils/ApiPoller";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";
import { useAlert } from "@utils/Snackbar";
import Loading from "@components/Loading";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import { useForm } from "react-hook-form";
import Grid from "@material-ui/core/Grid";
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

    if (settings.status === "loading" || settings.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            {renderLoading()}
            <Card className={classes.card}>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" disableElevation>
                                    Save changes
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
