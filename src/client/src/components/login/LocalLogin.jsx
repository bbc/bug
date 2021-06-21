import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import { useAlert } from "@utils/Snackbar";
import LoadingOverlay from "@components/LoadingOverlay";
import AxiosPost from "@utils/AxiosPost";
import Grid from "@material-ui/core/Grid";

export default function LocalLogin() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});
    const sendAlert = useAlert();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPost(`/api/login`, form);
        if (!response?.error) {
            sendAlert(
                `${response?.firstName} ${response?.lastName} has been logged in.`,
                {
                    variant: "success",
                }
            );
        } else {
            sendAlert("Could not login user.", {
                variant: "warning",
            });
        }
        setLoading(false);
    };

    if (loading) {
        return <LoadingOverlay />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("email") }}
                        variant="filled"
                        fullWidth
                        error={errors?.email ? true : false}
                        type="email"
                        label="Email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("password") }}
                        variant="filled"
                        fullWidth
                        error={errors?.password ? true : false}
                        type="password"
                        label="Password"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disableElevation
                    >
                        Login
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
